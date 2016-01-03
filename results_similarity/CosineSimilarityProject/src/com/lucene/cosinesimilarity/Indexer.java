// Indexer.java
package com.lucene.cosinesimilarity;

import java.io.*;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

import org.apache.lucene.analysis.Analyzer;
import org.apache.lucene.analysis.standard.StandardAnalyzer;
import org.apache.lucene.document.Document;
import org.apache.lucene.document.Field;
import org.apache.lucene.document.FieldType;
import org.apache.lucene.index.CorruptIndexException;
import org.apache.lucene.index.FieldInfo;
import org.apache.lucene.index.IndexWriter;
import org.apache.lucene.index.IndexWriterConfig;
import org.apache.lucene.store.Directory;
import org.apache.lucene.store.FSDirectory;
import org.apache.lucene.store.LockObtainFailedException;
import org.apache.lucene.util.Version;

import com.util.ConnectionManager;


/**
 * Class to create Lucene Index from files.
 * Remember this class will only index files inside a folder.
 * If there are  multiple folder inside the source folder it will not index 
 * those files.
 * 
 *  It will only index text files 
 * @author Mubin Shrestha
 */
public class Indexer {
    
    private static File indexDirectory;
    private static String fieldName;

    public Indexer() {        
        this.indexDirectory = new File(Configuration.INDEX_DIRECTORY);
        fieldName = Configuration.FIELD_CONTENT;
    }

    /**
     * Method to create Lucene Index
     * Keep in mind that always index text value to Lucene for calculating 
     * Cosine Similarity.
     * You have to generate tokens, terms and their frequencies and store
     * them in the Lucene Index.
     * @throws CorruptIndexException
     * @throws LockObtainFailedException
     * @throws IOException 
     * @throws SQLException 
     */
    public void index() throws CorruptIndexException,
            LockObtainFailedException, IOException, SQLException {       
        createIndexFileFromDbResults();
    }

    /**
	 * Aceasta functie face apeluri la baza de date ca sa ia toate datele care
	 * ne trebuie inainte sa porneasca aplicatia.
	 * 
	 * @throws SQLException
	 * @throws IOException
	 */
	public static  void createIndexFileFromDbResults() throws SQLException, IOException {
		Connection conn = ConnectionManager.getInstance().getConnection();		
		Directory dir = FSDirectory.open(indexDirectory);
        Analyzer analyzer = new StandardAnalyzer(StandardAnalyzer.STOP_WORDS_SET);  // using stop words
        IndexWriterConfig iwc = new IndexWriterConfig(Version.LUCENE_4_10_2, analyzer);

        if (indexDirectory.exists()) {
            iwc.setOpenMode(IndexWriterConfig.OpenMode.CREATE);
        } else {
            // Add new documents to an existing index:
            iwc.setOpenMode(IndexWriterConfig.OpenMode.CREATE_OR_APPEND);
        }

        IndexWriter writer = new IndexWriter(dir, iwc);

		String sql = "SELECT `p`.`id` AS pageId, " + "`w`.`id` AS websiteId, " + "`w`.`name` AS websiteName, "
				+ "`p`.`uri` AS pageUrl, " + "`p`.`content_text` AS pageTextContent "
				+ "FROM `page` AS `p` JOIN `website` AS `w`;";

		ResultSet rs = null;
		Statement stmt = null;
		System.out.println("Starting to index :D");
		try {
			stmt = conn.createStatement();
			rs = stmt.executeQuery(sql);			
			while (rs.next()) {
				
				//String id = rs.getString("pageId");
//				String websiteId = rs.getString("websiteId");
//				String websiteName = rs.getString("websiteName");
//				String pageUrl = rs.getString("pageUrl");
				String pageTextContent = rs.getString("pageTextContent");	
				
				
				Document doc = new Document();
	            FieldType fieldType = new FieldType();
	            fieldType.setIndexed(true);
	            fieldType.setIndexOptions(FieldInfo.IndexOptions.DOCS_AND_FREQS_AND_POSITIONS_AND_OFFSETS);
	            fieldType.setStored(true);
	            fieldType.setStoreTermVectors(true);
	            fieldType.setTokenized(true);
	            Field contentField = new Field(fieldName, pageTextContent, fieldType);
	            doc.add(contentField);
	            writer.addDocument(doc);

			}
		} catch (SQLException e) {
			System.err.println(e);
		} finally {
			if (stmt != null) {
				stmt.close();
			}
		}
		writer.close();
		System.out.println("Indexing -> Done :)");
	}
}
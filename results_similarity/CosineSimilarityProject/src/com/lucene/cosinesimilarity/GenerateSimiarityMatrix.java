package com.lucene.cosinesimilarity;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.SQLException;
import java.util.ArrayList;

import org.apache.lucene.store.LockObtainFailedException;

import com.data.Page;

/**
 * Main Class
 * 
 * @author Mubin Shrestha
 */
public class GenerateSimiarityMatrix {

	public static void main(String[] args) throws LockObtainFailedException, IOException, SQLException {
		getCosineSimilarity();
	}

	public static void getCosineSimilarity() throws LockObtainFailedException, IOException, SQLException {

		Indexer index = new Indexer();
		index.index();

		DatabaseResults dbResults = new DatabaseResults();
		ArrayList<Page> pageList = dbResults.getCrawledPagesFromDb();

		VectorGenerator vectorGenerator = new VectorGenerator();
		vectorGenerator.GetAllTerms();
		DocVector[] docVector = vectorGenerator.GetDocumentVectors(); // getting document vectors
		
		PrintWriter writer = new PrintWriter(Configuration.RESULT_FILE, "UTF-8"); // vectors
		System.out.println("Starting to write matrix in file: " + Configuration.RESULT_FILE);
		
		String finalString = "";
		for (int j = -1; j < pageList.size(); j++) {
			if (j == -1) {
				finalString += "       ";
			} else {
				finalString += pageList.get(j).getId() + "    ";
			}
		}
		//System.out.println(finalString);
		writer.println(finalString);

		for (int i = 0; i < docVector.length; i++) {
			String string = "";
			for (int j = -1; j < docVector.length; j++) {
				if (j == -1) {
					string += pageList.get(i).getId() + "   ";
				} else {
					String cosineSimilarity = CosineSimilarity.CosineSimilarity(docVector[i], docVector[j]);
					string += cosineSimilarity + "    ";
				}
			}
			//System.out.println(string);
			writer.println(string);
		}

		writer.close();
		System.out.println("Writing matrix -> Done :)");
	}
}
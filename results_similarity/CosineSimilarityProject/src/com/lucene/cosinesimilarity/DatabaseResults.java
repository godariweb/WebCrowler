package com.lucene.cosinesimilarity;

import java.io.IOException;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;

import com.data.Page;
import com.util.ConnectionManager;

public class DatabaseResults {
	
	/**
	 * Aceasta functie face apeluri la baza de date ca sa ia toate paginile
	 * parcurse de catre crawler.
	 * 
	 * @return
	 * 
	 * @throws SQLException
	 * @throws IOException
	 */
	public static ArrayList<Page> getCrawledPagesFromDb() throws SQLException, IOException {
		Connection conn = ConnectionManager.getInstance().getConnection();
		ArrayList<Page> pageList = new ArrayList<Page>();

		String sql = "SELECT `p`.`id` AS pageId, " + "`w`.`id` AS websiteId, " + "`w`.`name` AS websiteName, "
				+ "`p`.`uri` AS pageUrl, " + "`p`.`content_text` AS pageTextContent "
				+ "FROM `page` AS `p` JOIN `website` AS `w`;";

		ResultSet rs = null;
		Statement stmt = null;
		System.out.println("Starting to get data from DB! :D");
		try {
			stmt = conn.createStatement();
			rs = stmt.executeQuery(sql);
			while (rs.next()) {
				String id = rs.getString("pageId");
				String websiteId = rs.getString("websiteId");
				String websiteName = rs.getString("websiteName");
				String pageUrl = rs.getString("pageUrl");
				String pageTextContent = rs.getString("pageTextContent");
				Page page = new Page(id, websiteId, websiteName, pageUrl, pageTextContent);
				pageList.add(page);
			}
		} catch (SQLException e) {
			System.err.println(e);
		} finally {
			if (stmt != null) {
				stmt.close();
			}
		}
		System.out.println("Geting data from DB -> Done :)");
		return pageList;
	}
}

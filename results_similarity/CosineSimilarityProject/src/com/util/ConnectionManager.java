package com.util;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class ConnectionManager {
	private static ConnectionManager instance = null; 
	
	//datele pentru acesarea bazei de date
	private final static String NUME = "root";
	private final static String PAROLA = "msql";
	private final String M_CONN_STRING = "jdbc:mysql://localhost/web_crowler?useUnicode=true&characterEncoding=UTF-8";

	// private final String M_CONN_STRING =
	// "jdbc:mysql://sql4.freesqldatabase.com/sql434263?useUnicode=true&characterEncoding=UTF-8";
	private Connection conn = null; // o noua conexiune

	private ConnectionManager() {
	}

	public static ConnectionManager getInstance() {
		if (instance == null) {
			instance = new ConnectionManager();
		}
		return instance;
	}

	private boolean openConnection() {
		try {
			conn = DriverManager.getConnection(M_CONN_STRING, NUME, PAROLA); //aici se realizeaza conectarea cu baza de date
			return true;
		} catch (SQLException e) {
			System.err.println(e);
			return false;
		}
	}

	public Connection getConnection() {
		if (conn == null) {
			if (openConnection()) {
				System.out.println("Connection opened");
				return conn;
			} else {
				return null;
			}
		}
		return conn;
	}

	public void close() {
		System.out.println("Closing connection");
		try {
			conn.close();
			conn = null;
		} catch (Exception e) {
		}
	}
}

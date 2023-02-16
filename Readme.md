# Web Crawler

## Introduction
I developed a web crawler using nodejs with the goal of creating an application that could analyze blog and news web portals to determine which was the first to publish a specific article and which article was the most popular. The system consists of two parts:
Firstly, the application scrapes data from the web and stores it in a database, which is the focus of this project. Secondly, I used Apache Lucene to analyze the data and generate reports.

The application begins by reading a list of websites from the database. 
For each website, it crawls all the pages and extracts information such as HTML, text content, links, shares, page views, and post date and stores it in a database.

## Implementation details
The algorithm and logic can be found in /routes/index.js
The sql database schema can be found in /database/schema.sql
Some reusable components can be found in /components




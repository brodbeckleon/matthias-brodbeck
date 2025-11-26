package main

import (
	"database/sql"
	"fmt"
	"log"

	_ "github.com/go-sql-driver/mysql"
)

var DB *sql.DB

func InitDB() {
	dsn := "root:secret@tcp(127.0.0.1:3306)/mydb?parseTime=true"

	var err error
	DB, err = sql.Open("mysql", dsn)
	if err != nil {
		log.Fatalf("Error opening DB: %v", err)
	}

	// Test the connection
	err = DB.Ping()
	if err != nil {
		log.Fatalf("Error connecting to DB: %v", err)
	}

	fmt.Println(" ✅ Connected to MySQL")

	createContacts := `
CREATE TABLE IF NOT EXISTS contacts (
	id INT AUTO_INCREMENT PRIMARY KEY,
	name VARCHAR(255) NOT NULL,
	email VARCHAR(255) NOT NULL,
	message TEXT NOT NULL,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`

	createEvents := `
CREATE TABLE IF NOT EXISTS events (
	id INT AUTO_INCREMENT PRIMARY KEY,
	date DATE NOT NULL,
	title VARCHAR(255) NOT NULL,
	place VARCHAR(255) NOT NULL
);
`

	_, err = DB.Exec(createContacts)
	if err != nil {
		log.Fatalf("Error creating contacts table: %v", err)
	}
	fmt.Println(" ✅ Contacts table ensured")

	_, err = DB.Exec(createEvents)
	if err != nil {
		log.Fatalf("Error creating events table: %v", err)
	}
	fmt.Println(" ✅ Events table ensured")

}

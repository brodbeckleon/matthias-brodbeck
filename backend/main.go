package main

import (
	"fmt"
	"log"
	"net/http"
)

func enableCORS(w http.ResponseWriter) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
}

func main() {
	InitDB()
	SeedEvents() // ONLY FOR DEVELOPMENT PURPOSES

	http.HandleFunc("/contact", contactHandler)
	http.HandleFunc("/events", eventsHandler)
	http.HandleFunc("/events/add", addEventHandler)

	fmt.Println("🚀 Server running on http://localhost:8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}

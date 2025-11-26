package main

import (
	"encoding/json"
	"log"
	"net/http"
)

func contactHandler(w http.ResponseWriter, r *http.Request) {
	log.Println("Received request:", r.Method, r.URL.Path)

	enableCORS(w)
	if r.Method == http.MethodOptions {
		log.Println("OPTIONS request, returning OK")
		w.WriteHeader(http.StatusOK)
		return
	}

	if r.Method != http.MethodPost {
		log.Println("Invalid method:", r.Method)
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var msg ContactMessage
	err := json.NewDecoder(r.Body).Decode(&msg)
	if err != nil {
		log.Println("Error decoding JSON:", err)
		http.Error(w, "Invalid JSON", http.StatusBadRequest)
		return
	}
	log.Printf("Decoded message: %+v\n", msg)

	_, err = DB.Exec(
		"INSERT INTO contacts (name, email, message) VALUES (?, ?, ?)",
		msg.Name, msg.Email, msg.Message,
	)
	if err != nil {
		log.Println("Database error:", err)
		http.Error(w, "Database error", http.StatusInternalServerError)
		return
	}
	log.Println("Message inserted into database successfully")

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	resp := map[string]string{"status": "ok", "message": "Success"}
	if err := json.NewEncoder(w).Encode(resp); err != nil {
		log.Println("Error encoding JSON response:", err)
	}
	log.Println("Response sent successfully")
}

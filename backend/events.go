package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strings"
)

var events = []Event{
	{Date: "2025-06-30", Title: "Summer Drum Festival", Place: "Osaka City Hall"},
	{Date: "2025-10-14", Title: "Percussion Workshop", Place: "Tokyo Jazz School"},
	{Date: "2025-12-10", Title: "Winter Groove Session", Place: "Kobe Arts Center"},
	{Date: "2026-01-12", Title: "New Year Concert", Place: "Kyoto Concert Hall"},
	{Date: "2026-03-22", Title: "Rhythm of Spring", Place: "Nagoya Dome"},
	{Date: "2026-05-15", Title: "Drum Tales", Place: "Hiroshima Sound Museum"},
	{Date: "2026-09-01", Title: "Autumn Percussion Gala", Place: "Fukuoka Harmony Hall"},
	{Date: "2026-12-05", Title: "End of Year Celebration", Place: "Tokyo Philharmonic"},
}

func eventsHandler(w http.ResponseWriter, r *http.Request) {
	enableCORS(w)

	rows, err := DB.Query("SELECT date, title, place FROM events")
	if err != nil {
		http.Error(w, "Database error", http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	events := []Event{}
	for rows.Next() {
		var e Event
		if err := rows.Scan(&e.Date, &e.Title, &e.Place); err != nil {
			log.Println(err)
			continue
		}
		events = append(events, e)
	}

	json.NewEncoder(w).Encode(events)
}

func addEventHandler(w http.ResponseWriter, r *http.Request) {
	enableCORS(w)

	if r.Method != http.MethodPost {
		http.Error(w, "Only POST allowed", http.StatusMethodNotAllowed)
		return
	}

	var e Event
	if err := json.NewDecoder(r.Body).Decode(&e); err != nil {
		http.Error(w, "Invalid JSON", http.StatusBadRequest)
		return
	}

	_, err := DB.Exec(
		"INSERT INTO events (date, title, place) VALUES (?, ?, ?)",
		e.Date, e.Title, e.Place,
	)

	if err != nil {
		http.Error(w, "Database error", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]string{
		"status": "ok",
	})
}

// ONLY FOR DEVELOPMENT PURPOSES
func SeedEvents() {
	for _, e := range events {
		_, err := DB.Exec(
			"INSERT INTO events (date, title, place) VALUES (?, ?, ?)",
			e.Date, e.Title, e.Place,
		)
		if err != nil {
			// ignore duplicates
			if !strings.Contains(err.Error(), "Duplicate") {
				log.Println("Seed error:", err)
			}
		}
	}
	fmt.Println("🌱 Events seeded")
}

package main

import (
	"encoding/json"
	"net/http"
)

type Event struct {
	Date  string `json:"date"`
	Title string `json:"title"`
	Place string `json:"place"`
}

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
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusOK)
		return
	}

	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(events)
}

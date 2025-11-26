package main

type Event struct {
	Date  string `json:"date"`
	Title string `json:"title"`
	Place string `json:"place"`
}

type ContactMessage struct {
	Name    string `json:"name"`
	Email   string `json:"email"`
	Message string `json:"message"`
}

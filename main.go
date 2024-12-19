package main

import (
	"fmt"
	"html/template"
	"log"
	"net/http"
)

func main() {
	// Initialize the server
	fileServer := http.FileServer(http.Dir("./static"))
	http.Handle("/static/", http.StripPrefix("/static/", fileServer))

	// Handle '/' route
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		// Get the index.html template
		tmpl := template.Must(template.ParseFiles("./templates/index.html"))

		// Show the page to the user
		tmpl.Execute(w, nil)
	})

	// Run the server
	fmt.Printf("Running server on port http://localhost:8080...")
	if err := http.ListenAndServe(":8080", nil); err != nil {
		log.Fatal(err)
	}
}



package main

import (
	"fmt"
	"html/template"
	"log"
	"net/http"
)

func main() {
	// Serve static directory
	http.Handle("/static/", http.StripPrefix("/static/", http.FileServer(http.Dir("./static"))))

	// Serve images
	http.Handle("/images/", http.StripPrefix("/images/", http.FileServer(http.Dir("./images"))))

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



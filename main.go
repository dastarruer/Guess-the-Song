package main

import (
	"fmt"
	"log"
	"net/http"

	"guess-the-song/handlers"
)

func main() {
	// NOTE: All directories must be manually configured to be served to the user, otherwise all content referencing said directories WILL NOT be shown

	// Serve static directory
	http.Handle("/static/", http.StripPrefix("/static/", http.FileServer(http.Dir("./static"))))

	// Serve images
	http.Handle("/images/", http.StripPrefix("/images/", http.FileServer(http.Dir("./images"))))

	// Handle '/' route
	http.HandleFunc("/", handlers.IndexHandler)

	// Run the server
	fmt.Printf("Running server on port http://localhost:8080...")
	if err := http.ListenAndServe(":8080", nil); err != nil {
		log.Fatal(err)
	}
}

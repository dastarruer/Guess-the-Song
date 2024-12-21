package main

import (
	"fmt"
	"guess-the-artist/handlers"
	"log"
	"net/http"
)

func main() {
	// NOTE: All directories must be manually configured to be served to the user, otherwise all content referencing said directories WILL NOT be shown

	// Serve static directory
	http.Handle("/static/", http.StripPrefix("/static/", http.FileServer(http.Dir("./static"))))

	// Serve images
	http.Handle("/images/", http.StripPrefix("/images/", http.FileServer(http.Dir("./images"))))

	// Handle routes
	http.HandleFunc("/", handlers.IndexHandler)
	http.HandleFunc("/auth", handlers.AuthHandler)

	// Run the server
	fmt.Printf("Running server on port http://localhost:8080...")
	if err := http.ListenAndServe(":8080", nil); err != nil {
		log.Fatal(err)
	}
}

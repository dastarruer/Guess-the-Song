package main

import (
	"fmt"
	// "html/template"
	"log"
	"net/http"
)

func main() {
	// Initialize the server
	fileServer := http.FileServer(http.Dir("./templates"))

	// Handle all routes
	http.Handle("/", fileServer)

	// Run the server
	fmt.Printf("Starting server on port 8080...")
	if err := http.ListenAndServe(":8080", nil); err != nil {
		log.Fatal(err)
	}
}

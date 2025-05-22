package main

import (
	"fmt"
	"log"
	"net/http"

	"guess-the-song/handlers"
)

func main() {
	// Serve static directory
	http.Handle("/static/", http.StripPrefix("/static/", http.FileServer(http.Dir("./static"))))

	// Serve images
	http.Handle("/images/", http.StripPrefix("/images/", http.FileServer(http.Dir("./images"))))

	// Handle routes
	http.HandleFunc("/", handlers.IndexHandler)
	http.HandleFunc("/artist", handlers.ArtistHandler)
	http.HandleFunc("/artist/top", handlers.ArtistTopTracksHandler)
	http.HandleFunc("/genres", handlers.GenresHandler)
	http.HandleFunc("/genres/artists", handlers.GenreArtistsHandler)
	http.HandleFunc("/chart", handlers.ChartsHandler)

	// Run the server
	fmt.Printf("Running server on port http://localhost:8080...")
	if err := http.ListenAndServe(":8080", nil); err != nil {
		log.Fatal(err)
	}
}

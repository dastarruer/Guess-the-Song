package handlers

import (
	"context"
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/carlmjohnson/requests"
)

type GenreArtists struct {
	Artists []Artist `json:"data"`
}

func GenreArtistsHandler(w http.ResponseWriter, r *http.Request) {
	idStr := r.URL.Query().Get("id")
	if idStr == "" {
		http.Error(w, "missing artist id", http.StatusBadRequest)
		return
	}

	// Convert it to an integer
	id, err := strconv.Atoi(idStr)
	if err != nil {
		http.Error(w, "invalid artist id", http.StatusBadRequest)
		return
	}

	var artist GenreArtists

	// Get the artist's top tracks
	err = requests.
		URL("https://api.deezer.com").
		Pathf("/genre/%d/artists", id).
		ContentType("application/json").
		ToJSON(&artist).
		Fetch(context.Background())
	if err != nil {
		http.Error(w, "could not connect to jsonplaceholder.typicode.com:", http.StatusInternalServerError)
	}

	// Set the content type to application/json
	w.Header().Set("Content-Type", "application/json")

	// Write the track object as JSON to the response
	if err := json.NewEncoder(w).Encode(artist); err != nil {
		http.Error(w, "could not encode track data to JSON", http.StatusInternalServerError)
		return
	}
}

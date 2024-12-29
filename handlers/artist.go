package handlers

import (
	"context"
	"encoding/json"
	// "fmt"
	"net/http"

	"github.com/carlmjohnson/requests"
)

type Artist struct {
	Tracklist []Track `json:"data"`
}

func ArtistHandler(w http.ResponseWriter, r *http.Request) {
	id := 27
	var artist Artist
	err := requests.
		URL("https://api.deezer.com").
		Pathf("/artist/%d/top", id).
		Param("limit", "50").
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

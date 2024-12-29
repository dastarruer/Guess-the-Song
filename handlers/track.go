package handlers

import (
	"context"
	"encoding/json"
	"net/http"

	"github.com/carlmjohnson/requests"
)

type Album struct {
	Cover string `json:"cover"`
}

type Track struct {
	Title      string `json:"title"`
	PreviewURL string `json:"preview"`
}

func TrackHandler(w http.ResponseWriter, r *http.Request) {
	id := 3135552
	var track Track
	err := requests.
		URL("https://api.deezer.com").
		Pathf("/track/%d", id).
		ContentType("application/json").
		ToJSON(&track).
		Fetch(context.Background())
	if err != nil {
		http.Error(w, "could not connect to jsonplaceholder.typicode.com:", http.StatusInternalServerError)
	}

	// Set the content type to application/json
	w.Header().Set("Content-Type", "application/json")

	// Write the track object as JSON to the response
	if err := json.NewEncoder(w).Encode(track); err != nil {
		http.Error(w, "could not encode track data to JSON", http.StatusInternalServerError)
		return
	}
}

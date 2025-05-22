package handlers

import (
	"context"
	"encoding/json"
	"net/http"

	"github.com/carlmjohnson/requests"
)

type ChartTopTracks struct {
	Tracklist []Track `json:"data"`
}

func ChartsHandler(w http.ResponseWriter, r *http.Request) {
	var tracklist ChartTopTracks;

	// Get the artist's data
	err := requests.
		URL("https://api.deezer.com").
		Pathf("/chart/tracks/tracks").
		Param("limit", "50").
		ContentType("application/json").
		ToJSON(&tracklist).
		Fetch(context.Background())
	if err != nil {
		http.Error(w, "could not connect to jsonplaceholder.typicode.com:", http.StatusInternalServerError)
	}

	// Set the content type to application/json
	w.Header().Set("Content-Type", "application/json")

	// Write the track object as JSON to the response
	if err := json.NewEncoder(w).Encode(tracklist); err != nil {
		http.Error(w, "could not encode track data to JSON", http.StatusInternalServerError)
		return
	}
}

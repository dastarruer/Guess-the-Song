package handlers

import (
	"context"
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/carlmjohnson/requests"
)

type Track struct {
	Title      string `json:"title"`
	PreviewURL string `json:"preview"`
	Album      Album  `json:"album"`
}

type Album struct {
	CoverBig    string `json:"cover_big"`
	CoverMedium string `json:"cover_medium"`
	CoverSmall  string `json:"cover_small"`
}

type ArtistTopTracks struct {
	Tracklist []Track `json:"data"`
}

func ArtistTopTracksHandler(w http.ResponseWriter, r *http.Request) {
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

	var artist ArtistTopTracks
	// Get the artist's top tracks
	err = requests.
		URL("https://api.deezer.com").
		Pathf("/artist/%d/top", id).
		Param("limit", "10").
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

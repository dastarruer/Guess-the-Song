package handlers

import (
	"context"
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/carlmjohnson/requests"
)

type Artist struct {
	Name          string `json:"name"`
	Id            int    `json:"id"`
	PictureSmall  string `json:"picture_small"`
	PictureMedium string `json:"picture_medium"`
	PictureBig    string `json:"picture_big"`
}

func ArtistHandler(w http.ResponseWriter, r *http.Request) {
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

	var artist Artist

	// Get the artist's data
	err = requests.
		URL("https://api.deezer.com").
		Pathf("/artist/%d", id).
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

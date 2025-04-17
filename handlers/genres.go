package handlers

import (
	"context"
	"encoding/json"
	"net/http"

	"github.com/carlmjohnson/requests"
)

type Genre struct {
	Id            int    `json:"id"`
	Name          string `json:"name"`
	PictureBig    string `json:"picture_big"`
	PictureMedium string `json:"picture_medium"`
	PictureSmall  string `json:"picture_small"`
}

type Genres struct {
	Genres []Genre `json:"data"`
}

func GenresHandler(w http.ResponseWriter, r *http.Request) {
	var genres Genres
	err := requests.
		URL("https://api.deezer.com").
		Pathf("/genre").
		ContentType("application/json").
		ToJSON(&genres).
		Fetch(context.Background())
	if err != nil {
		http.Error(w, "could not connect to jsonplaceholder.typicode.com:", http.StatusInternalServerError)
	}

	// Set the content type to application/json
	w.Header().Set("Content-Type", "application/json")

	// Write the track object as JSON to the response
	if err := json.NewEncoder(w).Encode(genres); err != nil {
		http.Error(w, "could not encode track data to JSON", http.StatusInternalServerError)
		return
	}
}

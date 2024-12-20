package handlers

import (
	"encoding/base64"
	"github.com/joho/godotenv"
	"io"
	"log"
	"net/http"
	"net/url"
	"os"
	"strings"
)

func AuthHandler(w http.ResponseWriter, r *http.Request) {
	clientId := getClientId()
	clientSecret := getClientSecret()

	// Base64 encode client_id:client_secret
	authHeader := base64.StdEncoding.EncodeToString([]byte(clientId + ":" + clientSecret))

	// Spotify token URL
	tokenURL := "https://accounts.spotify.com/api/token"

	// Prepare the POST request body with required URL-encoded data
	data := url.Values{}
	data.Set("grant_type", "client_credentials")

	// Create a new POST request
	req, err := http.NewRequest("POST", tokenURL, strings.NewReader(data.Encode()))
	if err != nil {
		http.Error(w, "Failed to create request", http.StatusInternalServerError)
		return
	}

	// Add headers to the request
	req.Header.Add("Authorization", "Basic "+authHeader)
	req.Header.Add("Content-Type", "application/x-www-form-urlencoded")
	req.Header.Add("Accept", "application/json")

	// Send the request
	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		http.Error(w, "Failed to make POST request", http.StatusInternalServerError)
		return
	}
	defer resp.Body.Close()

	// Read and process the response body
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		http.Error(w, "Failed to read response body", http.StatusInternalServerError)
		return
	}

	// Send the response to the frontend
	w.Header().Set("Content-Type", "application/json")
	w.Write(body)
}


func getClientId() string {
	if err := godotenv.Load(); err != nil {
		log.Fatal(err)
	}

	return os.Getenv("CLIENT_ID")
}

func getClientSecret() string {
	if err := godotenv.Load(); err != nil {
		log.Fatal(err)
	}

	return os.Getenv("CLIENT_SECRET")
}

package handlers

import (
	"encoding/base64"
	"encoding/json"
	"io"
	"log"
	"net/http"
	"net/url"
	"os"
	"strings"

	"github.com/joho/godotenv"
)

type AuthResponse struct {
	AccessToken string `json:"access_token"`
	TokenType   string `json:"token_type"`
	ExpiresIn   int    `json:"expires_in"`
}

// AuthHandler handles the authentication process by obtaining an access token
// and sending the Spotify playlist's data to the frontend. It first retrieves
// the access token using the getAccessToken function and then uses the
// sendPlaylistJSON function to send the playlist data as a JSON response.

func AuthHandler(w http.ResponseWriter, r *http.Request) {
	accessToken := getAccessToken(w)

	// Send the playlist's data to the frontend
	sendPlaylistJSON(w, accessToken)
}


// getClientId returns the client ID of the Spotify API as a string, retrieved from the CLIENT_ID environment variable.
func getClientId() string {
	if err := godotenv.Load(); err != nil {
		log.Fatal(err)
	}

	return os.Getenv("CLIENT_ID")
}

// getClientSecret returns the client secret of the Spotify API as a string,
// retrieved from the CLIENT_SECRET environment variable. If loading the
// environment variables fails, the function will log a fatal error.

func getClientSecret() string {
	if err := godotenv.Load(); err != nil {
		log.Fatal(err)
	}

	return os.Getenv("CLIENT_SECRET")
}

// getAccessToken sends a POST request to the Spotify API to obtain an access token using the client ID and client secret. It then extracts the access token from the response and returns it as a string. If any errors occur during the process, it will set the HTTP status code to 500 and return "error".
func getAccessToken(w http.ResponseWriter) string {
	clientId := getClientId()
	clientSecret := getClientSecret()

	// Base64 encode client_id:client_secret as per Spotify's specifications
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
		return "error"
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
		return "error"
	}
	defer resp.Body.Close()

	// Read and process the response body
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		http.Error(w, "Failed to read response body", http.StatusInternalServerError)
		return "error"
	}

	// Convert response to JSON
	var authResponse AuthResponse
	json.Unmarshal(body, &authResponse)

	return authResponse.AccessToken
}

// sendPlaylistJSON sends a GET request to the Spotify API to retrieve the
// Billboard Top 100 playlist data using the provided access token. It then
// writes the data as a JSON response to the provided http.ResponseWriter. If
// any errors occur during the request creation, execution, or response
// processing, an appropriate HTTP error is set in the response.

func sendPlaylistJSON(w http.ResponseWriter, accessToken string) {
	billboardTop100PlaylistID := "6UeSakyzhiEt4NB3UAd6NQ"
	playlistURL := "https://api.spotify.com/v1/playlists/" + billboardTop100PlaylistID

	// Create a GET request
	req, err := http.NewRequest("GET", playlistURL, nil)
	if err != nil {
		http.Error(w, "Failed to create request", http.StatusInternalServerError)
		return
	}

	// Add headers to the request
	req.Header.Add("Authorization", "Bearer "+accessToken)
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

	// Send the JSON
	w.Header().Set("Content-Type", "application/json")
	w.Write(body)
}

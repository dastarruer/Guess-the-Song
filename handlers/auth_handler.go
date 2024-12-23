package handlers

import (
	// "encoding/base64"
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"io/ioutil"
	"log"
	"math/rand"
	"net/http"
	"net/url"
	"os"

	// "strings"
	"time"

	"github.com/joho/godotenv"
)

type AuthResponse struct {
	AccessToken  string `json:"access_token"`
	TokenType    string `json:"token_type"`
	Scope        string `json:"scope"`
	ExpiresIn    int    `json:"expires_in"`
	RefreshToken string `json:"refresh_token"`
}

const redirectURI = "http://localhost:8080"

// AuthHandler handles the authentication process by obtaining an access token
// and sending the Spotify playlist's data to the frontend. It first retrieves
// the access token using the getAccessToken function and then uses the
// sendPlaylistJSON function to send the playlist data as a JSON response, passing in the Billboard Hot 100 playlist ID.

func AuthHandler(w http.ResponseWriter, r *http.Request) {
	// Retrieve the authorization code from the query
	code := r.URL.Query().Get("code")
	if code == "" {
		http.Error(w, "Authorization code not provided", http.StatusBadRequest)
		return
	}

	// Get the access token
	accessToken := getAccessToken(w, code)

	// Send the playlist's data to the frontend
	billboardHot100PlaylistID := "6UeSakyzhiEt4NB3UAd6NQ"
	sendPlaylistJSON(w, accessToken, billboardHot100PlaylistID)
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

// getAccessToken sends a POST request to the Spotify API to obtain an access token using the client ID and client secret.
// If an error occurs, it sets the HTTP status code and writes the error to the response.
func getAccessToken(w http.ResponseWriter, code string) string {
	clientID := getClientId()
	clientSecret := getClientSecret()

	// Spotify token endpoint
	tokenURL := "https://accounts.spotify.com/api/token"

	// Prepare the request body
	data := url.Values{}
	data.Set("grant_type", "authorization_code")
	data.Set("code", code)
	data.Set("redirect_uri", redirectURI)
	data.Set("client_id", clientID)
	data.Set("client_secret", clientSecret)

	// Create a POST request
	req, err := http.NewRequest("POST", tokenURL, bytes.NewBufferString(data.Encode()))
	if err != nil {
		http.Error(w, "Failed to create request: "+err.Error(), http.StatusInternalServerError)
		return ""
	}
	req.Header.Set("Content-Type", "application/x-www-form-urlencoded")

	// Send the request
	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		http.Error(w, "Failed to make request: "+err.Error(), http.StatusInternalServerError)
		return ""
	}
	defer resp.Body.Close()

	// Read and parse the response
	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		http.Error(w, "Failed to read response: "+err.Error(), http.StatusInternalServerError)
		return ""
	}

	if resp.StatusCode != http.StatusOK {
		http.Error(w, fmt.Sprintf("Unexpected status code: %d, response: %s", resp.StatusCode, body), http.StatusInternalServerError)
		return ""
	}

	var tokenResponse AuthResponse
	err = json.Unmarshal(body, &tokenResponse)
	if err != nil {
		http.Error(w, "Failed to parse JSON response: "+err.Error(), http.StatusInternalServerError)
		return ""
	}

	return tokenResponse.AccessToken
}


// sendPlaylistJSON sends a GET request to the Spotify API to retrieve the
// Billboard Top 100 playlist data using the provided access token. It then
// writes the data as a JSON response to the provided http.ResponseWriter. If
// any errors occur during the request creation, execution, or response
// processing, an appropriate HTTP error is set in the response.

func sendPlaylistJSON(w http.ResponseWriter, accessToken string, playlistID string) {
	playlistURL := "https://api.spotify.com/v1/playlists/" + playlistID + "/tracks"

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

func RequestUserAuth(w http.ResponseWriter, r *http.Request) {
	clientID := getClientId()
	responseType := "code"
	state := generateRandomString(16)
	scope := "user-read-private user-read-email"

	// Build the authorization URL
	authURL := "https://accounts.spotify.com/authorize?" + url.Values{
		"client_id":     {clientID},
		"response_type": {responseType},
		"redirect_uri":  {redirectURI},
		"state":         {state},
		"scope":         {scope},
	}.Encode()

	// Redirect the user's browser to Spotify's authorization page
	http.Redirect(w, r, authURL, http.StatusFound)
}

func generateRandomString(length int) string {
	const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
	var seededRand = rand.New(rand.NewSource(time.Now().UnixNano()))

	// Create a string of random characters from the charset
	randomString := make([]byte, length)
	for i := range randomString {
		randomString[i] = charset[seededRand.Intn(len(charset))]
	}
	return string(randomString)
}

package handlers

import (
	// "encoding/base64"
	"bytes"
	"encoding/base64"
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

var accessToken string

func PlaylistHandler(w http.ResponseWriter, r *http.Request) {
	// Send the playlist's data to the frontend
	billboardHot100PlaylistID := "6UeSakyzhiEt4NB3UAd6NQ"
	sendPlaylistJSON(w, accessToken, billboardHot100PlaylistID)
}

func getClientId() string {
	if err := godotenv.Load(); err != nil {
		log.Fatal(err)
	}

	return os.Getenv("CLIENT_ID")
}

func TokenHandler(w http.ResponseWriter, r *http.Request) {
	// Retrieve the authorization code from the query
	code := r.URL.Query().Get("code")

	// Get the access token
	accessToken = getAccessToken(w, code)

	response := map[string]interface{}{
		"access_token": accessToken,
	}

	// Convert the response to JSON
	jsonResponse, err := json.Marshal(response)
	if err != nil {
		http.Error(w, "Failed to encode JSON response: "+err.Error(), http.StatusInternalServerError)
		return
	}
	// Send the JSON response to the frontend
	w.Header().Set("Content-Type", "application/json")
	w.Write(jsonResponse)
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

func getClientSecret() string {
	if err := godotenv.Load(); err != nil {
		log.Fatal(err)
	}

	return os.Getenv("CLIENT_SECRET")
}

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

	credentials := clientID + ":" + clientSecret
	encodedCredentials := "Basic " + base64.StdEncoding.EncodeToString([]byte(credentials))
	req.Header.Set("Authorization", encodedCredentials)

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

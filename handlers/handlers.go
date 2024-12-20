package handlers

import (
	// "github.com/joho/godotenv"
	"html/template"
	"net/http"
	// "os"
)

func IndexHandler(w http.ResponseWriter, r *http.Request) {
	// Get the index.html template
	tmpl := template.Must(template.ParseFiles("./templates/index.html"))

	// Show the page to the user
	tmpl.Execute(w, nil)
}

// func getClientSecret() string {
// 	if err := godotenv.Load(); err != nil {
// 		log.Fatal(err)
// 	}

// 	return os.Getenv("CLIENT_SECRET")
// }

package handlers

import (
	"html/template"
	"net/http"
)

func IndexHandler(w http.ResponseWriter, r *http.Request) {
	// Get the index.html template
	tmpl := template.Must(template.ParseFiles("./templates/index.html"))

	// Show the page to the user
	tmpl.Execute(w, nil)
}

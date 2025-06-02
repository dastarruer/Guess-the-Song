package main

import (
	"fmt"
	"net/http"
	"os"
	"path/filepath"

	. "github.com/tbxark/g4vercel"
)

func Handler(w http.ResponseWriter, r *http.Request) {
	server := New()

	server.Use(Recovery(func(err interface{}, c *Context) {
		if httpError, ok := err.(HttpError); ok {
			c.JSON(httpError.Status, H{"message": httpError.Error()})
		} else {
			c.JSON(500, H{"message": fmt.Sprintf("%s", err)})
		}
	}))

	server.GET("/", func(c *Context) {
		// Use c.Resp (http.ResponseWriter) and c.Req (*http.Request)
		path := filepath.Join("static", "index.html")
		if _, err := os.Stat(path); os.IsNotExist(err) {
			c.JSON(404, H{"message": "index.html not found"})
			return
		}
		http.ServeFile(c.Resp, c.Req, path)
	})

	server.Handle(w, r)
}

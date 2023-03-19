package main

import (
	"log"

	"net/http"

	"github.com/gorilla/mux"
	"github.com/rs/cors"
)

func main() {
	route := mux.NewRouter()

	// Add routes to router
	s := route.PathPrefix("/api").Subrouter() //Base Path
	// Routes
	s.HandleFunc("/createGrade", createGrade).Methods("POST")
	s.HandleFunc("/getGrades", getGrades).Methods("GET")
	s.HandleFunc("/getGrade/{id}", getGradeByID).Methods("GET")
	s.HandleFunc("/updateGrade/{id}", updateGrade).Methods("PUT")
	s.HandleFunc("/deleteGrade", deleteGrade).Methods("DELETE")
	
	// Setup CORS
	c := cors.New(cors.Options{
		AllowedOrigins: []string{"http://localhost:3000"},
		AllowedMethods: []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders: []string{"Content-Type", "Authorization"},
		AllowCredentials: true,
	})
	handler := c.Handler(route)

	log.Fatal(http.ListenAndServe(":8000", handler)) // Run Server
}

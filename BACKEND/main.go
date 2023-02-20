package main

import (
	"log"

	"net/http"

	"github.com/gorilla/mux"
)

func main() {
	route := mux.NewRouter()
	s := route.PathPrefix("/api").Subrouter() //Base Path
	//Routes
	s.HandleFunc("/createGrade", createGrade).Methods("POST")
	s.HandleFunc("/getGrades", getGrades).Methods("GET")
	log.Fatal(http.ListenAndServe(":8000", s)) // Run Server
}
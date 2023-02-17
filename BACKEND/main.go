package main

import (
	"context"
	"fmt"
	"log"

	"go.mongodb.org/mongo-driver/mongo"

	"net/http"

	"github.com/gorilla/mux"
)

var (
	GradesCollection *mongo.Collection
	Ctx              = context.TODO()
)

func main() {
	route := mux.NewRouter()
	s := route.PathPrefix("/api").Subrouter() //Base Path
	//Routes
	s.HandleFunc("/createGrade", createGrade).Methods("POST")
	s.HandleFunc("/getAllGrades", getGrade).Methods("GET")
	s.HandleFunc("/updateGrade", updateGrade).Methods("PUT")
	s.HandleFunc("/deleteGrade/{id}", deleteGrade).Methods("DELETE")
	log.Fatal(http.ListenAndServe(":8000", s)) // Run Server
}

type Grade struct {
	Name string `bson:"name"`
	Mark int    `bson:"mark"`
}

func CreateGrade(g Grade) (string, error) {
	result, err := GradesCollection.InsertOne(Ctx, g)
	if err != nil {
		return "0", err
	}
	return fmt.Sprintf("%v", result.InsertedID), err
}

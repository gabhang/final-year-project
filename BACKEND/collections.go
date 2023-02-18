package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
)

type Student struct {
	Name string `bson:"name"`
	Mark int `bson:"mark"`
}

// access database collection and returns *mongo.Client
var gradeCollection = db().Database("students").Collection("grades")

func createGrade(w http.ResponseWriter, r *http.Request) {

	// add Content-type
	w.Header().Set("Content-Type", "application/json")

	var student Student
	err := json.NewDecoder(r.Body).Decode(&student) // get data from request body 
	if err != nil {
		fmt.Print(err)
	}
	insertResult, err := gradeCollection.InsertOne(context.TODO(), student) // insert data to database
	if err != nil {
		log.Fatal(err)
	}

	// print/return output/result/error
	fmt.Println("Created grade: ", insertResult)
	json.NewEncoder(w).Encode(insertResult.InsertedID) 

}
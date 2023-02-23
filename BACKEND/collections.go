package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type Student struct {
	Name string `bson:"name"`
	Mark int `bson:"mark"`
}

// access database collection and returns *mongo.Client
var gradeCollection = db().Database("students").Collection("grades")

func createGrade(w http.ResponseWriter, r *http.Request) {

	// add Content-type
	// tells the client making the HTTP request that the response body is encoded in the JSON format.
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

func getGrades(w http.ResponseWriter, r *http.Request) {
	
	// add Content-type
	w.Header().Set("Content-Type", "application/json")
	
	// primitive package for BSON data
	var results []primitive.M // .M = map

	// returns a *mongo.Cursor that acts as a pointer to find/get documents/results from the database collection
	cur, err := gradeCollection.Find(context.TODO(), bson.D{{}}) 
	if err != nil {
		fmt.Println(err)
	}
	for cur.Next(context.TODO()) {

		// primitive package for BSON data
		var elem primitive.M // .M = map
		err := cur.Decode(&elem)
		if err != nil {
			log.Fatal(err)
		}

		// appending each document/result to results array
		results = append(results, elem) 
	}

	// close cursors to avoid resource leaks and ensure efficient use of resources
	cur.Close(context.TODO())
	json.NewEncoder(w).Encode(results)
}

func updateGrade(w http.ResponseWriter, r *http.Request) {

	// add Content-type
	w.Header().Set("Content-Type", "application/json")

	type updateBody struct {
		Name string `bson:"name"` // match name
		Mark int `bson:"mark"` // modify mark
	}
	var body updateBody
	e := json.NewDecoder(r.Body).Decode(&body)
	if e != nil {
		fmt.Print(e)
	}
	// D: document
	filter := bson.D{{"name", body.Name}} // converting name to BSON
	
	after := options.After
	returnOpt := options.FindOneAndUpdateOptions{
		ReturnDocument: &after,
	}
	update := bson.D{{"$set", bson.D{{"mark", body.Mark}}}}
	updateResult := gradeCollection.FindOneAndUpdate(context.TODO(), filter, update, &returnOpt)

	var result primitive.M // map

	// use _ as blank identifier as Decode only returns error if it fails
	_ = updateResult.Decode(&result)

	// encode the result value as a JSON object and write it to the HTTP response,
	// allowing the client that made the request to consume the data in a format it understands
	json.NewEncoder(w).Encode(result)
}
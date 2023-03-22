package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"

	"github.com/gorilla/mux"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Student struct {
	StudentNumber string             `bson:"studentNumber"`
	Name          string             `bson:"name"`
	Grade         string        `bson:"grade"`
	Year          string        `bson:"year"`
	Class         string        `bson:"class"`
}

type GetStudent struct {
	ID            primitive.ObjectID `bson:"_id"`
	StudentNumber string             `bson:"studentNumber"`
	Name          string             `bson:"name"`
	Grade         string        `bson:"grade"`
	Year          string        `bson:"year"`
	Class         string        `bson:"class"`
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

func getGradeByID(w http.ResponseWriter, r *http.Request) {

	// Get ID from URL params
	params := mux.Vars(r)
	id := params["id"]

	// Parse ObjectID from the ID string
	objID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		// Handle error
		w.WriteHeader(http.StatusBadRequest)
		fmt.Fprintf(w, "Invalid student ID: %v", err)
		return
	}

	// Find student with specified ID
	var student GetStudent

	err = gradeCollection.FindOne(context.Background(), bson.M{"_id": objID}).Decode(&student)
	if err != nil {
		// Handle error
		w.WriteHeader(http.StatusNotFound)
		return
	}

	// Return student data as JSON
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(student)
}

func updateGrade(w http.ResponseWriter, r *http.Request) {

	// Get ID from URL params
	params := mux.Vars(r)
	id := params["id"]

	// Decode JSON request body into updateStudent struct
	var updateStudent Student
	_ = json.NewDecoder(r.Body).Decode(&updateStudent)

	// Parse ObjectID from the ID string
	objID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		// Handle error
		w.WriteHeader(http.StatusBadRequest)
		fmt.Fprintf(w, "Invalid student ID: %v", err)
		return
	}

	// Update student with matching ID in the database
	filter := bson.M{"_id": objID}
	update := bson.M{"$set": updateStudent}
	result, err := gradeCollection.UpdateOne(context.Background(), filter, update)
	if err != nil {
		log.Fatal(err)
	}
	fmt.Printf("Updated %v documents\n", result.ModifiedCount)

	// Send updated student back in response.
	// encode the result value as a JSON object and write it to the HTTP response,
	// allowing the client that made the request to consume the data in a format it understands
	json.NewEncoder(w).Encode(updateStudent)
}

func deleteGrade(w http.ResponseWriter, r *http.Request) {

	// Get ID from URL params
	params := mux.Vars(r)
	id := params["id"]

    // extract the student ID from the parameters
    objID, err := primitive.ObjectIDFromHex(id)
    if err != nil {
        http.Error(w, "Invalid student ID", http.StatusBadRequest)
        return
    }

    // delete the student with the given ID
    result, err := gradeCollection.DeleteOne(context.TODO(), bson.M{"_id": objID})
    if err != nil {
        http.Error(w, "Failed to delete student", http.StatusInternalServerError)
        return
    }

    // check if a document was deleted
    if result.DeletedCount == 0 {
        http.Error(w, "Student not found", http.StatusNotFound)
        return
    }

    // return a success message
    w.WriteHeader(http.StatusOK)
    fmt.Fprintf(w, "Student deleted successfully")
}

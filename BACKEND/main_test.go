package main

import (
	"testing"
	"context"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"go.mongodb.org/mongo-driver/bson"
	"github.com/stretchr/testify/assert"
)

func TestCRUDOperations(t *testing.T) {

	// Initialize MongoDB connection
	client, err := mongo.NewClient(options.Client().ApplyURI("mongodb+srv://gabhang:gabrielfyp@cluster0.g0aphtm.mongodb.net/?retryWrites=true&w=majority"))
	if err != nil {
		t.Fatal(err)
	}
	err = client.Connect(context.Background())
	if err != nil {
		t.Fatal(err)
	}

	// Call test functions for CRUD operations
	testCreateGrade(t, client)
	testGetGrades(t, client)
	// testUpdateGrade(t, client)
	// testDeleteGrade(t, client)
}

func testCreateGrade(t *testing.T, client *mongo.Client) {

	// Access grade collection
	gradeCollection := client.Database("students").Collection("grades")

	// Create new student grade
	student := Student{Name: "John", Mark: 99}
	result, err := gradeCollection.InsertOne(context.Background(), student)
	if err != nil {
		t.Fatal(err)
	}

	// Check if the student was created
	if result.InsertedID == nil {
		t.Fatal("Failed to create student grade")
	}
}

func testGetGrades(t *testing.T, client *mongo.Client) {
	
	// Access grade collection
	gradeCollection := client.Database("students").Collection("grades")

	studentGrades := []interface{}{
        bson.M{"name": "Jane", "mark": 45},
        bson.M{"name": "Joe", "mark": 10},
	}

	// Insert some test data
    _, err := gradeCollection.InsertMany(context.Background(), studentGrades)
    if err != nil {
        t.Fatal(err)
    }

	var results []bson.M // .M = map
	cur, err := gradeCollection.Find(context.TODO(), bson.M{}) 
	if err != nil {
		t.Fatal(err)
	}
	for cur.Next(context.TODO()) {

		// primitive package for BSON data
		var elem bson.M // .M = map
		err := cur.Decode(&elem)
		if err != nil {
			t.Fatal(err)
		}

		// appending each document/result to results array
		results = append(results, elem) 
	}

	// close cursors to avoid resource leaks and ensure efficient use of resources
	cur.Close(context.TODO())

	// Verify that all documents are returned
    expected := []bson.M{
        bson.M{"name": "John", "mark": 99},
        bson.M{"name": "Jane", "mark": 45},
        bson.M{"name": "Joe", "mark": 10},
    }

    assert.Equal(t, len(expected), len(results))
}

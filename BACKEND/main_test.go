package main

import (
	"testing"
	"context"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
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
	// testGetGrades(t, client)
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
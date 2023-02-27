package main

import (
	"testing"
	"context"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func TestCRUDOperations(t *testing.T) {

	// Initialize MongoDB connection
	client, err := mongo.NewClient(options.Client().ApplyURI("mongodb://localhost:27017"))
	if err != nil {
		t.Fatal(err)
	}
	err = client.Connect(context.Background())
	if err != nil {
		t.Fatal(err)
	}

	// Call test functions for CRUD operations
	// testCreateGrade(t, client)
	// testGetGrades(t, client)
	// testUpdateGrade(t, client)
	// testDeleteGrade(t, client)
}
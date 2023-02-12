package main

import (
	"context"
	"fmt"
	"log"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var (
	GradesCollection  *mongo.Collection
	Ctx = context.TODO()
)

func main() {
	clientOptions := options.Client().ApplyURI("mongodb://localhost:27017") // Connect to //MongoDB
	client, err := mongo.Connect(context.TODO(), clientOptions)
	if err != nil {
		log.Fatal(err)
	}
	// Check the connection
	err = client.Ping(context.TODO(), nil)
	if err != nil {
		log.Fatal(err)
	} else {
		fmt.Println("Connected to MongoDB!") // output connection successful message
	}
	
	db := client.Database("students")
	GradesCollection = db.Collection("grades")
}

type Grade struct {
	Name string	`bson:"name"`
	Mark int `bson:"mark"`
}

func CreateGrade(g Grade) (string, error) {
	result, err := GradesCollection.InsertOne(Ctx, g)
	if err != nil {
		return "0", err
	}
	return fmt.Sprintf("%v", result.InsertedID), err
}

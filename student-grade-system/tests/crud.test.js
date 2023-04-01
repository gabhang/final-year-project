const mongoose = require("mongoose");
const request = require("supertest");

const app = require("../BACKEND/server");

require("dotenv").config();

/* Connecting to the database before each test. */
beforeEach(async () => {
  await mongoose.connect("mongodb+srv://gabhang:gabrielfyp@cluster0.g0aphtm.mongodb.net/?retryWrites=true&w=majority", { useNewUrlParser: true });
});

/* Closing database connection after each test. */
afterEach(async () => {
  await mongoose.connection.close();
});

/* Close server after done listening/running all tests */
afterAll(async () => {
  await app.close()
})

// Define a test suite to test CRUD functionalities of student grades
describe('CRUD Functionality', () => {
  // Initialize testId variable to store document ID during creation
  // to test other functionalities
  let testId = '';

  // Test Create function
  it('should create a new student', async () => {
    const response = await request(app)
      .post('/createGrade')
      .send({
        // Test data
        studentNumber: 'T001',
        name: 'Test',
        grade: 1,
        year: '1',
        class: '1'
      });
    expect(response.statusCode).toEqual(200); // Expect no errors
    testId = response.body.data._id; // Store testId when created
    expect(response.body.message).toEqual('Student Grade Added');  // Expect response message to show successful creation
  });

  // Test Read all function
  it('should get all student', async () => {
    const response = await request(app).get('/getGrades'); 
    expect(response.statusCode).toEqual(200); // Expect no errors
    expect(response.body.length).toBeGreaterThan(0); // Expect body >0 (initial = 0)
  });

  // Test Read specific function
  it('should get a specific student', async () => {
    const response = await request(app).get(`/getGrade/${testId}`);
    expect(response.statusCode).toEqual(200); // Expect no errors
    expect(response.body._id).toEqual(testId); // Expect response.testId = testId
  });

  // Test Update function
  it('should update a specific student', async () => {
    const response = await request(app)
      .put(`/updateGrade/${testId}`)
      // Pass over update body
      .send({
        grade: 100
      });
    expect(response.statusCode).toEqual(200); // Expect no errors
    expect(response.body.grade).toEqual(100); // Expect response.grade to be updated
  });

  // Test Delete function
  it('should delete a specific student', async () => {
    const response = await request(app).delete(`/deleteGrade/${testId}`);
    expect(response.statusCode).toEqual(200); // Expect no errors
    expect(response.body.deletedCount).toEqual(1); // Expect document to be deleted (=1)
  });
});

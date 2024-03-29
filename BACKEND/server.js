const express = require('express')
const app = express()

// Changed port from 3000 to 4000 so that its not running on the same port as the app
const port = process.env.PORT || 4000

// Including body parser (Middleware)
const bodyParser = require('body-parser')

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

// Including cors (Cross Origin Resource Sharing - for Security)
const cors = require('cors')

// Using cors
app.use(cors())
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
    next()
})

// Configuration for sending build and static files for deployment
const path = require('path')
app.use(express.static(path.join(__dirname, '../build')))
app.use('/static', express.static(path.join(__dirname, '../build//static')))

// Including Mongoosejs package
const mongoose = require('mongoose')

// Set up connection string for database  
const mongoConnection = 'mongodb+srv://gabhang:gabrielfyp@cluster0.g0aphtm.mongodb.net/students?retryWrites=true&w=majority'
mongoose.connect(mongoConnection, { useNewUrlParser: true })

// schema for database
const Schema = mongoose.Schema;
let studentGradeSchema = new Schema({
    studentNumber: { type: String, required: true },
    name: { type: String, required: true },
    grade: { type: Number, required: true },
    year: { type: String, required: true },
    class: { type: String, required: true }
});

// create model for database for interaction
let StudentGradeModel = mongoose.model("grades", studentGradeSchema)

// post request to create new SG
app.post('/api/createGrade', async (req, res) => {
    const data = await StudentGradeModel.create({
        studentNumber: req.body.studentNumber,
        name: req.body.name,
        grade: req.body.grade,
        year: req.body.year,
        class: req.body.class
    })
    res.status(200).send({data: data, message: 'Student Grade Added'});
})

// get request from /getGrades and response with json
app.get('/api/getGrades', async (req, res) => {
    const data = await StudentGradeModel.find()
    res.status(200).send(data);
})

// Listen for a get request and will return a SG which has the id specified after /update/:id
app.get('/api/getGrade/:id', async (req, res) => {
    const data = await StudentGradeModel.findOne({ _id: req.params.id })
    res.status(200).send(data);
})

// update SG with specific id
app.put('/api/updateGrade/:id', async (req, res) => {
    // find product with that id and update from database
    const data = await StudentGradeModel.findByIdAndUpdate(req.params.id, req.body, { new: true }) // return updated
    res.status(200).send(data);
})

// delete SG with specific id
app.delete('/api/deleteGrade/:id', async (req, res) => {
    // delete record with that specific id (id associated with delete button)
    const data = await StudentGradeModel.deleteOne({ _id: req.params.id })
    res.status(200).send(data);
})

// Server app listening on port (4000)
const server = app.listen(port, () => {
    console.log('Listening at port:' + port)
  })
  
module.exports = server // export server to close after running tests
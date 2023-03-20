import React from 'react'
import { Container } from 'react-bootstrap'
import axios from 'axios'

export class CreateSG extends React.Component {

    constructor() {
        super()
        // Bindings
        this.handleCreate = this.handleCreate.bind(this)
        this.onChangeStudentNumber = this.onChangeStudentNumber.bind(this)
        this.onChangeName = this.onChangeName.bind(this)
        this.onChangeGrade = this.onChangeGrade.bind(this)
        this.onChangeYear = this.onChangeYear.bind(this)
        this.onChangeClass = this.onChangeClass.bind(this)
        this.state = {
            studentNumber: '',
            name: '',
            grade: '',
            year: '',
            class: ''
        }
    }

    handleCreate(event) {
        // Alert the user that the form is being submitted
        alert("Student Name: " + this.state.name + "\nStudent grade information has been created");
        event.preventDefault(); // prevent crashing on reload

        // Create newSG object
        const newSG = {
            studentNumber: this.state.studentNumber,
            name: this.state.name,
            grade: this.state.grade,
            year: this.state.year,
            class: this.state.class
        }

        // Sending post request to the server
        axios.post('http://localhost:8000/api/createGrade', newSG) // send newUser object to server
            .then((res) => {
                console.log(newSG)
                // back to listings
                window.location = '/'
            })
            .catch((err) => {
                console.log(err); // error to console
            });

        // set state to empty for the next student
        this.setState({           
            studentNumber: '',
            name: '',
            grade: '',
            year: '',
            class: ''
        })
    }

    // will set studentNumber value in state when input changed
    onChangeStudentNumber(event) {
        this.setState({
            studentNumber: event.target.value
        })
    }

    // will set name value in state when input changed
    onChangeName(event) {
        this.setState({
            name: event.target.value
        })
    }

    // will set grade value in state when input changed
    onChangeGrade(event) {
        this.setState({
            grade: event.target.value
        })
    }

    // Setting the year
    onChangeYear(event) {
        this.setState({
            year: event.target.value
        })
    }

    // Set state of class
    onChangeClass(event) {
        this.setState({
            class: event.target.value
        })
    }

    render() {
        return(
            <div>
                <Container>
                    {/* create create SG form */}
                    <form onSubmit={this.handleCreate}>
                        <h3>Add Student!</h3>

                        {/* input student number */}
                        <div className="form-group">
                            <label>Student Number</label>
                            <input type="text"
                                className="form-control"
                                placeholder="Add Student Number"
                                value={this.state.studentNumber}
                                onChange={this.onChangeStudentNumber}
                            />
                        </div>

                        {/* Input student name */}
                        <div className="form-group">
                            <label>Student Name</label>
                            <input type="text"
                                className="form-control"
                                placeholder="Enter name here"
                                value={this.state.name}
                                onChange={this.onChangeName}
                            />
                        </div>

                        {/* Input grade */}
                        <div className="form-group">
                            <label>Grade</label>
                            <input type="number"
                                className="form-control"
                                placeholder="%"
                                value={this.state.grade}
                                onChange={this.onChangeGrade}
                            />
                        </div>

                        {/* select year */}
                        <div className="form-group">
                            <label>Year</label>
                            <select name="year" className="form-control"
                                 onChange={this.onChangeYear}>
                                <option value="1">1st Year</option>
                                <option value="2">2nd Year</option>
                                <option value="3">3rd Year</option>
                            </select>
                        </div>

                        {/* select class */}
                        <div className="form-group">
                            <label>Class</label>
                            <select name="class" className="form-control"
                                 onChange={this.onChangeClass}>
                                <option value="1">Class 1</option>
                                <option value="2">Class 2</option>
                                <option value="3">Class 3</option>
                            </select>
                        </div>

                        <button type="submit" className="btn btn-lg btn-dark btn-block">Add Student</button>
                    </form>
                </Container>
            </div>
        )
    }
}
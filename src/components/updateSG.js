import React from 'react'
import { Container } from 'react-bootstrap'
import axios from 'axios'

export class UpdateSG extends React.Component {

    constructor() {
        super();
        this.id = window.location.pathname.substring(8)
        // Bindings
        this.handleUpdate = this.handleUpdate.bind(this);
        this.onChangeName = this.onChangeName.bind(this);
        this.onChangeGrade = this.onChangeGrade.bind(this);
        this.onChangeYear = this.onChangeYear.bind(this);
        this.onChangeClass = this.onChangeClass.bind(this);
        this.state = {
            _id: '',     
            studentNumber: '',
            name: '',
            grade: '',
            year: '',
            class: ''
        }
    }

    componentDidMount() {
        // Axios request to retrieve data from database
        axios.get('/api/getGrade/' + this.id)
            .then(response => {
                this.setState({
                    _id: response.data._id,
                    studentNumber: response.data.studentNumber,
                    name: response.data.name,
                    grade: response.data.grade,
                    year: response.data.year,
                    class: response.data.class
                })
            })
            .catch((error) => {
                console.log(error)
            })
    }

    handleUpdate(event) {
        // Alert the user that the form is being submitted
        alert("Student Name: " + this.state.name + "\nStudent grade information has been edited");
        event.preventDefault(); // prevent crashing on reload

        // Create updateSG object for sending info to server
        const updateSG = {     
            studentNumber: this.state.studentNumber,
            name: this.state.name,
            grade: this.state.grade,
            year: this.state.year,
            class: this.state.class
        }

        // Sending put request to the server to update details
        axios.put('/api/updateGrade/' + this.state._id, updateSG) // send updated object to server
            .then((res) => { 
                // back to listings
                window.location='/'
            })
            .catch((err) => {
                console.log(err); // error to console
            });
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

    // Set the year of the student
    onChangeYear(event) {
        this.setState({
            year: event.target.value
        })
    }

    // Set the class of the student
    onChangeClass(event) {
        this.setState({
            class: event.target.value
        })
    }

    render() {
        return(
            <div>
                <Container>
                    {/* create edit student info form */}
                    <form onSubmit={this.handleUpdate}>
                        <h3>Edit Student</h3>

                        {/* Student Number */}
                        <div className="form-group">
                            <label>Student Number</label>
                            <input type="text"
                                className="form-control"
                                value={this.state.studentNumber}
                                disabled
                            />
                        </div>

                        {/* Input Student Name */}
                        <div className="form-group">
                            <label>Student Name</label>
                            <input type="text"
                                className="form-control"
                                placeholder="Enter title here"
                                value={this.state.name}
                                onChange={this.onChangeName}
                            />
                        </div>

                        {/* Input for Grade */}
                        <div className="form-group">
                            <label>Student Grade</label>
                            <input type="number"
                                className="form-control"
                                placeholder="%"
                                value={this.state.grade}
                                onChange={this.onChangeGrade}
                            />
                        </div>

                        {/* Input for Year */}
                        <div className="form-group">
                            <label>Year</label>
                            <select name="year" className="form-control"
                                value={this.state.year}
                                 onChange={this.onChangeYear}>
                                <option value="1">1st Year</option>
                                <option value="2">2nd Year</option>
                                <option value="3">3rd Year</option>
                            </select>
                        </div>

                        {/* Input for Class */}
                        <div className="form-group">
                            <label>Class</label>
                            <select name="class" className="form-control"
                                value={this.state.class}
                                 onChange={this.onChangeClass}>
                                <option value="1">Class 1</option>
                                <option value="2">Class 2</option>
                                <option value="3">Class 3</option>
                            </select>
                        </div>                      

                        <button type="submit" className="btn btn-lg btn-dark btn-block">Update Student Grade</button>
                    </form>
                </Container>
            </div>
        )
    }
}
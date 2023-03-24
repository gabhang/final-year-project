import React from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export class Listings extends React.Component {

    state = {
        studentGrades: [],
        filteredStudentGrades: [],
    }

    componentDidMount() {
        axios.get('http://localhost:8000/api/getGrades')
            .then((response) => { // If successful - Set state to response
                this.setState({ studentGrades: response.data, filteredStudentGrades: response.data}) // update state
            }) 
            .catch((error) => { // If error
                console.log(error);
            })
    }

    handleDelete(id) {
        const confirmDelete = window.confirm("Are you sure you want to delete this student?");
        if (confirmDelete) {
            axios.delete('http://localhost:8000/api/deleteGrade/' + id)
            .then((res) => {
                window.location.reload(); // Refresh the page to reflect the updated data
            })
            .catch((error) => {
                console.log(error);
            })
        }
    };

    // filter data using initial response state and set filteredStudentGrades with filteredData
    filterData = (e) => {
        // if selectedIndex from dropdownmenu is between 2 to 4 (inclusive), filter by class in year 1
        if (e.target.selectedIndex >= 2 && e.target.selectedIndex <= 4) {
            var filteredData = this.state.studentGrades.filter((student) => {
                return student.year === "1" && student.class === e.target.value
            })
        }
        // else if selectedIndex from dropdownmenu is between 6 to 8 (inclusive), filter by class in year 2
        else if (e.target.selectedIndex >= 6 && e.target.selectedIndex <= 8) {
            var filteredData = this.state.studentGrades.filter((student) => {
                return student.year === "2" && student.class === e.target.value
            })
        }
        // else if selectedIndex from dropdownmenu is between 10 to 12 (inclusive), filter by class in year 3
        else if (e.target.selectedIndex >= 10 && e.target.selectedIndex <= 12) {
            var filteredData = this.state.studentGrades.filter((student) => {
                return student.year === "3" && student.class === e.target.value
            })
        }
        // else show all student
        else {
            filteredData = this.state.studentGrades
        }

        // set state with filtered data
        this.setState({
            ...this.state,
            filteredStudentGrades: filteredData
        })

        console.log(filteredData)
    }

    render() {
        return (
            <div>
                <h1>Data from MongoDB</h1>
                {this.state.studentGrades != null ?
                    // React.Fragment to group elements into 1 to avoid jsx error
                    <React.Fragment>
                        <select onChange={this.filterData}>
                            <option value="All">Filter By Class</option>
                            <option disabled>────── Year 1 ──────</option>
                            <option value="1">Class 1</option>
                            <option value="2">Class 2</option>
                            <option value="3">Class 3</option>
                            <option disabled>────── Year 2 ──────</option>
                            <option value="1">Class 1</option>
                            <option value="2">Class 2</option>
                            <option value="3">Class 3</option>
                            <option disabled>────── Year 3 ──────</option>
                            <option value="1">Class 1</option>
                            <option value="2">Class 2</option>
                            <option value="3">Class 3</option>
                    </select>
                        {this.state.filteredStudentGrades.length != 0 ?
                            <table className='listings'>
                                <thead>
                                    <tr>
                                        <th>Student Number</th>
                                        <th>Name</th>
                                        <th>Grade</th>
                                        <th>Year</th>
                                        <th>Class</th>
                                        <th>Edit</th>
                                        <th>Delete</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.filteredStudentGrades.map(student => (
                                        <tr key={student._id}>
                                            <td>{student.studentNumber}</td>
                                            <td>{student.name}</td>
                                            <td>{student.grade}</td>
                                            <td>{student.year}</td>
                                            <td>{student.class}</td>
                                            <td><Link to={"/update/" + student._id} className="btn btn-primary">Edit</Link></td>
                                            <td><button className="btn btn-danger" onClick={() => this.handleDelete(student._id)}>Delete</button></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        : <p>No data in this class...</p>
                        }
                    </React.Fragment>
                : <p>No data...</p>
                }
            </div>
        );
    }
}
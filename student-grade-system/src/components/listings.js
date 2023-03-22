import React from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export class Listings extends React.Component {

    state = {
        studentGrades: [],
    }

    componentDidMount() {
        axios.get('http://localhost:8000/api/getGrades')
            .then((response) => { // If successful - Set state to response
                this.setState({ studentGrades: response.data}) // update state
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

    render() {
        return (
            <div>
                <h1>Data from MongoDB</h1>
                {this.state.studentGrades != null ?
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
                            {this.state.studentGrades.map(studentGrades => (
                                <tr key={studentGrades._id}>
                                    <td>{studentGrades.studentNumber}</td>
                                    <td>{studentGrades.name}</td>
                                    <td>{studentGrades.grade}</td>
                                    <td>{studentGrades.year}</td>
                                    <td>{studentGrades.class}</td>
                                    <td><Link to={"/update/" + studentGrades._id} className="btn btn-primary">Edit</Link></td>
                                    <td><button className="btn btn-danger" onClick={() => this.handleDelete(studentGrades._id)}>Delete</button></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                : <p>No data...</p>
                }
            </div>
        );
    }
}
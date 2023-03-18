import React from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export class Listings extends React.Component {

    componentDidMount() {
        axios.get('http://localhost:8000/api/getGrades')
            .then((response) => { // If successful - Set state to response
                this.setState({ studentGrades: response.data}) // update state
            }) 
            .catch((error) => { // If error
                console.log(error);
            })
    }

    state = {
        studentGrades: []
    }

    handleEdit = (id) => {
        console.log("Edit")
    };

    handleDelete = (id) => {
        console.log("Delete")
    };

    render() {
        return (
            <div>
                <h1>Data from MongoDB</h1>
                {this.state.studentGrades.length > 0 ?
                    <table className='listings'>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Grade</th>
                                <th>Edit</th>
                                <th>Delete</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.studentGrades.map(studentGrades => (
                                <tr key={studentGrades._id}>
                                    <td>{studentGrades.name}</td>
                                    <td>{studentGrades.mark}</td>
                                    <td><Link to={"/edit/" + studentGrades._id} className="btn btn-primary">Edit</Link></td>
                                    <td><button>Delete</button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                : <p>Loading data...</p>
                }
            </div>
        );
    }
}
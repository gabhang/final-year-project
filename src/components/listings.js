import React from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export class Listings extends React.Component {

    state = {
        studentGrades: [], // initial state from database
        filteredStudentGrades: [], // after filtering
        currentSortedColumn: ''
    }

    componentDidMount() {
        axios.get('/api/getGrades')
            .then((response) => { // If successful - Set state to response
                this.setState({
                    studentGrades: response.data,
                    filteredStudentGrades: response.data
                }); // update state
            }) 
            .catch((error) => { // If error
                console.log(error);
            })
    }

    handleDelete(id) {
        const confirmDelete = window.confirm("Are you sure you want to delete this student?");
        if (confirmDelete) {
            axios.delete('/api/deleteGrade/' + id)
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
        let filteredData
        // if selectedIndex from dropdownmenu is between 2 to 4 (inclusive), filter by class in year 1
        if (e.target.selectedIndex >= 2 && e.target.selectedIndex <= 4) {
            filteredData = this.state.studentGrades.filter((student) => {
                return student.year === "1" && student.class === e.target.value
            })
        }
        // else if selectedIndex from dropdownmenu is between 6 to 8 (inclusive), filter by class in year 2
        else if (e.target.selectedIndex >= 6 && e.target.selectedIndex <= 8) {
            filteredData = this.state.studentGrades.filter((student) => {
                return student.year === "2" && student.class === e.target.value
            })
        }
        // else if selectedIndex from dropdownmenu is between 10 to 12 (inclusive), filter by class in year 3
        else if (e.target.selectedIndex >= 10 && e.target.selectedIndex <= 12) {
            filteredData = this.state.studentGrades.filter((student) => {
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
    }

    // sort data using filteredStudentGrades state
    handleSort = (column) => {
        // check if the clicked column is the current sort column or not
        const newSortColumn = column === this.state.currentSortedColumn ? null : column;
    
        // create a copy of the filtered data to sort
        let sortedData = [...this.state.filteredStudentGrades];
        // sort data by the clicked column if it's a new sort column
        if (newSortColumn) {
            sortedData.sort((a, b) => {
              return a[newSortColumn] < b[newSortColumn] ? -1 : a[newSortColumn] > b[newSortColumn] ? 1 : 0;
            });
        }       
    
        // update the state with the sorted data and new sort column
        this.setState({
            filteredStudentGrades: sortedData,
            currentSortedColumn: newSortColumn
        });
    }

    render() {
        return (
            <div>
                <h1>Student Grade Listings</h1>
                {this.state.studentGrades != null ?
                    // React.Fragment to group elements into 1 to avoid jsx error
                    <React.Fragment>
                        <select className='filter' onChange={this.filterData}>
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
                        {this.state.filteredStudentGrades.length !== 0 ?
                            <table className='listings'>
                                <thead>
                                    <tr>
                                    <th className='sortHeader' onClick={() => this.handleSort('studentNumber')}>Student Number</th>
                                    <th className='sortHeader' onClick={() => this.handleSort('name')}>Name</th>
                                    <th className='sortHeader' onClick={() => this.handleSort('grade')}>Grade</th>
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
                <Link to={"/create"} className="btn btn-primary add">Add student</Link>
            </div>
        );
    }
}
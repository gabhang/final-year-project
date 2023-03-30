import './App.css';
import { Navbar, Nav } from 'react-bootstrap'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import { Listings } from './components/listings'
import { CreateSG } from './components/createSG'
import { UpdateSG } from './components/updateSG'

function App() {
  return (
    <Router>
        <div className="App">
          {/* Navigation bar for the site */}
          <Navbar sticky="top" bg="light" variant="light">
            <Navbar.Brand href="/"><img src="atu-logo-green.png" width="100" alt='logo'></img></Navbar.Brand>
            <Nav className="ml-auto">
              <Nav.Link href="/">Listings</Nav.Link>
              <Nav.Link href="/create">Add Student</Nav.Link>
            </Nav>
          </Navbar>

          {/* Tabs on the navbar are routed to different components using Routes */}
          <Routes>
            <Route path='/' element={< Listings />} exact />
            <Route path='/create' element={< CreateSG />} />
            <Route path='/update/:id' element={< UpdateSG />} />
          </Routes>
        </div>
      </Router>
  );
}

export default App;

import { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from './components/Header.jsx'
import { BrowserRouter, Route, Routes } from 'react-router';
import { Col, Container, Row } from 'react-bootstrap';
import Footer from './components/Footer.jsx';
import Home from './pages/Home.jsx';
import MySidebar from './components/MySidebar.jsx';
import Restaurant from './pages/Restaurant.jsx';



function App() {


  return (
    <BrowserRouter>
      <Header />
      <Container>
        <Row>
          <Col md = {9}>
            
            <Routes>

              <Route path='/' element={<Home />} />

              <Route path='/restaurants' element={<Restaurant />}/>

            

            </Routes>
          </Col>

          <Col md = {3}>
            <MySidebar />

          
          </Col>
          
          

        </Row>

        



      </Container>

      <Footer />

      
    

    </BrowserRouter>
  )
}

export default App;

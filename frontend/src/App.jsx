import { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from './components/Header.jsx'
import { BrowserRouter, Route, Routes } from 'react-router';
import { Col, Container, Row } from 'react-bootstrap';
import Footer from './components/Footer.jsx';
import Home from './pages/Home.jsx';
import MySidebar from './components/MySidebar.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import RestaurantList from './pages/RestaurantList.jsx';
import RestaurantDetail from './pages/RestaurantDetail.jsx';



function App() {


  return (
    <BrowserRouter>
      <Header />
      <Container>
        <Row>
          <Col md={9}>

            <Routes>

              <Route path="/login" element={<Login />} />

              <Route path="/register" element={<Register />} />

              <Route path='/' element={<Home />} />

              <Route path="/restaurants" element={<RestaurantList />} />

              <Route path="/restaurants/:id" element={<RestaurantDetail />} />

            </Routes>




          </Col>

          <Col md={3}>
            <MySidebar />


          </Col>



        </Row>





      </Container>

      <Footer />




    </BrowserRouter>
  )
}

export default App;

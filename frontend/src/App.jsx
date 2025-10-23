import { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/global.css'
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
import AddRestaurant from './pages/AddRestaurant.jsx';
import AdminRestaurants from './pages/AdminRestaurants.jsx';



function App() {


  return (
    <>
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

              <Route path="/admin/restaurants" element={<AdminRestaurants />} />

              <Route path="/add-restaurant" element={<AddRestaurant />} />

            </Routes>




          </Col>

          <Col md={3}>
            <MySidebar />


          </Col>



        </Row>





      </Container>

      <Footer />

      </>

  )
}

export default App;

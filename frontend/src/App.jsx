import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/global.css';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import MySidebar from './components/MySidebar.jsx';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import RestaurantList from './pages/RestaurantList.jsx';
import RestaurantDetail from './pages/RestaurantDetail.jsx';
import AddRestaurant from './pages/AddRestaurant.jsx';
import AdminRestaurants from './pages/AdminRestaurants.jsx';
import { Routes, Route } from 'react-router-dom';
import Profile from './pages/Profile.jsx';

function App() {
  return (
    <>
      <Header />

      <div className="layout-container">
        <aside className="sidebar-container">
          <MySidebar />
        </aside>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/restaurants" element={<RestaurantList />} />
            <Route path="/restaurants/:id" element={<RestaurantDetail />} />
            <Route path="/admin/restaurants" element={<AdminRestaurants />} />
            <Route path="/add-restaurant" element={<AddRestaurant />} />
          </Routes>
        </main>
      </div>

      <Footer />
    </>
  );
}

export default App;
import './App.css';
import Navbar from "./components/Navbar.js"
import Footer from "./components/Footer";
import Breadcrumbs from "./components/Breadcrumbs";
import TopTenPlayers from "./pages/TopTenPlayers.js"
import Home from "./pages/Home.js"
import Login from "./pages/Login.js"
import Register from "./pages/Register.js"
import Kviz from "./pages/Kviz.js"
import { Route, Routes } from "react-router-dom";
import AdminPlayers from './pages/AdminPlayers.js';

function App() {
  return (
    <>
      <Navbar />
      <Breadcrumbs />
      <div className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/kviz" element={<Kviz />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/top-ten-players" element={<TopTenPlayers />} />
          <Route path="/admin/players" element={<AdminPlayers />} />
        </Routes>
      </div>
      <Footer />
   </>
  );
}


export default App;

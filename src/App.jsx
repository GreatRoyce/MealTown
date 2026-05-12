import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import "./App.css";

import Nav from "./components/nav";
import Home from "./pages/home";
import Rider from "./pages/rider";
import Orders from "./pages/orders";
import Profile from "./pages/profile";
import Login from "./pages/login";
import Cart from "./pages/cart";
import Register from "./pages/register";
import NotFound from "./pages/notfound";

function App() {
  return (
    <Router>
      <Nav />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/rider" element={<Rider />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/cart"
          element={<Cart onClose={() => window.history.back()} />}
        />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;

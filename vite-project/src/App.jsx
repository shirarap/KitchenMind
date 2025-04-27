import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Products from "./pages/Products";
import AddProduct from "./pages/AddProduct";
import UpdateProduct from "./pages/UpdateProduct";
import Home from "./pages/Home"; // ➡️ ייבוא של הדף החדש
import NotFound from "./pages/NotFound";

function App() {
  const token = localStorage.getItem("token");

  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        {/* דף הבית החדש */}
        <Route path="/" element={<Home />} />

        {/* דפי התחברות והרשמה */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* דפי מוצרים */}
        <Route path="/products" element={token ? <Products /> : <Navigate to="/login" />} />
        <Route path="/add-product" element={token ? <AddProduct /> : <Navigate to="/login" />} />
        <Route path="/update-product/:id" element={token ? <UpdateProduct /> : <Navigate to="/login" />} />

        {/* דף שגיאה */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

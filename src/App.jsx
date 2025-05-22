import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserData } from "./features/auth/authSlice";

import Home from "./pages/Home";
import InventoryPage from "./pages/InventoryPage";
import ShoppingListPage from "./pages/ShoppingListPage";
import About from './pages/About';
import Navbar from "./components/Navbar";

const ProtectedRoute = ({ children }) => {
  const { user, token, loading } = useSelector((state) => state.auth);

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>טוען...</div>;
  }

  if (!user && !token) {
    return <Navigate to="/" replace />;
  }

  return children;
};

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchUserData());
  }, [dispatch]);

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/inventory" element={
          <ProtectedRoute>
            <InventoryPage />
          </ProtectedRoute>
        } />
        <Route path="/shopping-list" element={
          <ProtectedRoute>
            <ShoppingListPage />
          </ProtectedRoute>
        } />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;

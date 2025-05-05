import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import InventoryPage from "./pages/InventoryPage";
import ShoppingListPage from "./pages/ShoppingListPage";
import NotFound from "./pages/NotFound";
import Navbar from "./components/Navbar";
import About from './pages/About'; // וודא שהנתיב נכון

/**
 * רכיב ראשי של האפליקציה
 */
const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/inventory" element={<InventoryPage />} />
        <Route path="/shopping-list" element={<ShoppingListPage />} />
        <Route path="/about" element={<About />} /> {/* דף אודות */}

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default App;

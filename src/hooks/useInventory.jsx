import React, { useState, useEffect } from "react";

const useInventory = (userId) => { // העברת מזהה המשתמש לפונקציה
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    quantity: "",
    expiryDate: "",
      category: "", 

  });

  // טעינת המוצרים מהשרת עבור המשתמש
  useEffect(() => {
    fetch(`http://localhost:3000/api/${userId}`)
      .then((res) => res.json())
      .then((data) => setProducts(data)) // עדכון המוצרים
      .catch((err) => console.error("שגיאה בטעינה:", err));
  }, [userId]); // הטעינה תתבצע מחדש אם המשתמש ישתנה

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleAdd = () => {
    if (!formData.name || !formData.quantity) return;

    const product = {
      name: formData.name,
      quantity: Number(formData.quantity),
      expirationDate: formData.expiryDate || null,
      category: formData.category,
    };

    // שליחת בקשה לשרת להוספת מוצר למשתמש
    fetch(`http://localhost:3000/api/${userId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(product),
    })
      .then((res) => res.json())
      .then((newProduct) => {
        setProducts((prevProducts) => [...prevProducts, newProduct]); // עדכון המוצרים ב־React
      })
      .catch((err) => console.error("שגיאה בהוספה:", err));

  setFormData({ name: "", quantity: "", expiryDate: "", category: "" });
  // איפוס הטופס לאחר הוספה
  };

  const handleDelete = (id) => {
    fetch(`http://localhost:3000/api/${userId}/${id}`, {
      method: "DELETE",
    })
      .then(() => {
        setProducts((prevProducts) => prevProducts.filter((product) => product.id !== id)); // עדכון המוצרים
      })
      .catch((err) => console.error("שגיאה במחיקה:", err));
  };

  return {
    products,
    handleAdd,
    handleDelete,
    formData,
    handleChange,
  };
};

export default useInventory;

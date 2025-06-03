
import React, { useEffect, useState } from "react";
import axios from "axios";

const RecipeSuggestions = () => {
  const [recipes, setRecipes] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const fetchRecipesFromInventory = async () => {
      try {
        const ingRes = await axios.get("http://localhost:3000/api/products/ingredients", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const ingredients = ingRes.data.ingredients;
        if (!ingredients || ingredients.length === 0) {
          setError("אין מצרכים במלאי שלך לצורך חיפוש מתכונים.");
          setLoading(false);
          return;
        }

        const recipeRes = await axios.get("http://localhost:3000/api/recipes/byIngredients", {
          params: { ingredients: ingredients.join(",") },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        setRecipes(recipeRes.data);
        setLoading(false);
      } catch (err) {
        console.error("שגיאה בשליפת מתכונים:", err);
        setError("אירעה שגיאה בשליפת מתכונים");
        setLoading(false);
      }
    };

    fetchRecipesFromInventory();
  }, []);

  const fetchRecipeDetails = async (id) => {
    try {
      const res = await axios.get(`https://api.spoonacular.com/recipes/${id}/information`, {
        params: {
          apiKey: import.meta.env.VITE_SPOONACULAR_API_KEY, // שימוש ב-Vite
        },
      });
      setSelectedRecipe(res.data);
      setModalOpen(true);
    } catch (err) {
      console.error("שגיאה בשליפת פרטי מתכון:", err);
    }
  };

  return (
    <div>
      <h2>מתכונים מהמצרכים שלך!</h2>
      {loading && <p>טוען מתכונים...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {!loading && !error && recipes.length === 0 && <p>לא נמצאו מתכונים מתאימים 😞</p>}

      <ul>
        {recipes.map((recipe) => (
          <li key={recipe.id} style={{ marginBottom: "1rem" }}>
            <strong>{recipe.title}</strong><br />
            {recipe.image && (
              <img
                src={recipe.image}
                alt={recipe.title}
                width="100"
                style={{ cursor: "pointer" }}
                onClick={() => fetchRecipeDetails(recipe.id)}
              />
            )}
          </li>
        ))}
      </ul>

      {modalOpen && selectedRecipe && (
        <div style={modalOverlay}>
          <div style={modalContent}>
            <h3>{selectedRecipe.title}</h3>
            <img src={selectedRecipe.image} alt={selectedRecipe.title} width="200" />
            <h4>רכיבים:</h4>
            <ul style={{ textAlign: "right" }}>
              {selectedRecipe.extendedIngredients.map((ing) => (
                <li key={ing.id}>{ing.original}</li>
              ))}
            </ul>
            <h4>הוראות הכנה:</h4>
            <div dangerouslySetInnerHTML={{ __html: selectedRecipe.instructions || "אין הוראות זמינות" }} />
            <br />
            <button onClick={() => setModalOpen(false)}>סגור</button>
          </div>
        </div>
      )}
    </div>
  );
};

const modalOverlay = {
  position: "fixed",
  top: 0, left: 0, right: 0, bottom: 0,
  backgroundColor: "rgba(0,0,0,0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 999,
};

const modalContent = {
  backgroundColor: "white",
  padding: "2rem",
  borderRadius: "10px",
  maxHeight: "80vh",
  overflowY: "auto",
  textAlign: "right",
};

export default RecipeSuggestions;

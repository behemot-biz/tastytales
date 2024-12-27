import React, { useEffect, useState } from "react";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { useParams } from "react-router-dom";
import { axiosReq } from "../../api/axiosDefaults";
import Recipe from "./Recipe";
import IngredientCreateForm from "./IngredientCreateForm";

const RecipePage = () => {
  const { id: recipeId } = useParams();
  const [recipe, setRecipe] = useState(null); // Store recipe details
  const [ingredients, setIngredients] = useState([]); // Store ingredients

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const { data } = await axiosReq.get(`/recipes/${recipeId}`);
        setRecipe(data); // Save the recipe object
        setIngredients(data.recipe_ingredients || []); // Save ingredients
      } catch (err) {
        console.error("Error fetching recipe:", err);
      }
    };

    fetchRecipe();
  }, [recipeId]);

  if (!recipe) {
    return <p>Loading recipe...</p>; // Handle loading state
  }

  const isOwner = recipe.is_owner; // Assume backend provides `is_owner`

  return (
    <Row>
      <Col lg={8}>
        {/* Display Recipe Details */}

        <Recipe {...recipe} setRecipes={setRecipe} recipePage />
      </Col>

      {isOwner && (
        <Col lg={4}>
          {/* Render Ingredient Form */}
          <IngredientCreateForm
            recipeId={recipeId}
            // ingredients={ingredients}
            setIngredients={setIngredients}
          />
        </Col>
      )}
    </Row>
  );
};

export default RecipePage;

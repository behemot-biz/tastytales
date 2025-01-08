import React, { useState, useEffect } from "react";
import { useLocation, useHistory } from "react-router-dom";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";

import { axiosRes } from "../../api/axiosDefaults";

import Recipe from "./Recipe";

import styles from "../../styles/IngredientManager.module.css";
import btnStyles from "../../styles/Button.module.css";

/**
 * Form component to manage ingredients for a recipe.
 * Allows the user to add, edit, or delete ingredients associated with a specific recipe.
 * Displays a list of stored ingredients and integrates with the Recipe component for a preview.
 *
 * Features:
 * - Add a new ingredient with quantity, measure, and name.
 * - Edit existing ingredients.
 * - Delete ingredients from the recipe.
 * - Preview the recipe details alongside the ingredient manager.
 *
 * State Management:
 * - Manages local state for form data, errors, and stored ingredients.
 * - Tracks edit mode to update existing ingredients.
 *
 * Usage:
 * This component requires `location.state.recipeId` to function
 * since it is loaded after user added new recipe.
 */

const IngredientCreateForm = () => {
  const location = useLocation();
  const history = useHistory();
  const recipeId = location.state?.recipeId;

  const [formData, setFormData] = useState({
    ingredient: "",
    quantity: "",
    measure: "",
  });
  const [storedIngredients, setStoredIngredients] = useState([]);
  const [recipeData, setRecipeData] = useState(null); // State to store recipe details
  const [errors, setErrors] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);

  const { ingredient, quantity, measure } = formData;

  // Fetch recipe details to get stored ingredients and recipe data
  useEffect(() => {
    const fetchRecipeDetails = async () => {
      try {
        const { data } = await axiosRes.get(`/recipes/${recipeId}/`);
        setStoredIngredients(data.recipe_ingredients || []);
        setRecipeData(data); // Store the full recipe data
      } catch (err) {
        console.error("Error fetching recipe details:", err);
      }
    };
    fetchRecipeDetails();
  }, [recipeId]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (editMode) {
      try {
        const { data } = await axiosRes.put(`/ingredients/${editId}/`, {
          recipe: recipeId,
          ...formData,
        });
        setStoredIngredients((prev) =>
          prev.map((ing) => (ing.id === editId ? data : ing))
        );
        resetForm();
      } catch (err) {
        setErrors(err.response?.data || {});
      }
    } else {
      try {
        const { data } = await axiosRes.post("/ingredients/", {
          recipe: recipeId,
          ...formData,
        });
        setStoredIngredients((prev) => [...prev, data]);
        resetForm();
      } catch (err) {
        setErrors(err.response?.data || {});
      }
    }
  };

  const handleEdit = (ingredient) => {
    setFormData({
      ingredient: ingredient.ingredient,
      quantity: ingredient.quantity,
      measure: ingredient.measure,
    });
    setEditMode(true);
    setEditId(ingredient.id);
  };

  const handleDelete = async (id) => {
    try {
      await axiosRes.delete(`/ingredients/${id}/`);
      setStoredIngredients((prev) => prev.filter((ing) => ing.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const resetForm = () => {
    setFormData({ ingredient: "", quantity: "", measure: "" });
    setEditMode(false);
    setEditId(null);
    setErrors({});
  };

  const handleDone = () => {
    history.push(`/recipes/${recipeId}`);
  };

  if (!recipeId) {
    console.error("Recipe ID is missing.");
    return <div>Error: Recipe ID is required to add ingredients.</div>;
  }

  return (
    <div>
      {/* Display the Recipe component as a preview */}
      {recipeData && (
        <Recipe
          {...recipeData}
          setRecipe={setRecipeData}
          setIngredients={setStoredIngredients}
          ingredients={storedIngredients}
          recipesPage={false}
        />
      )}
      <Container className={styles.Ingredient}>
        <Row className="py-2  p-lg-3 ">
          <Col md={7} lg={8} className="d-none d-md-block p-0">
            <h5 className="pb-3">
              {editMode ? "Edit Ingredient" : "Add Ingredient"}
            </h5>

            <Form onSubmit={handleSubmit}>
              <div className={styles.FormRow}>
                <Form.Group>
                  <Form.Label className={styles.FormLabel}>Quantity</Form.Label>
                  <Form.Control
                    type="text"
                    name="quantity"
                    value={quantity}
                    onChange={handleChange}
                    placeholder="e.g., 500"
                    isInvalid={!!errors.quantity} // Bootstrap validation
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.quantity?.join(" ")}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group>
                  <Form.Label className={styles.FormLabel}>Measure</Form.Label>
                  <Form.Control
                    type="text"
                    name="measure"
                    value={measure}
                    onChange={handleChange}
                    placeholder="e.g., g, cups"
                    isInvalid={!!errors.measure} // Bootstrap validation
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.measure?.join(" ")}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group>
                  <Form.Label className={styles.FormLabel}>
                    Ingredient
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="ingredient"
                    value={ingredient}
                    onChange={handleChange}
                    placeholder="e.g., Tomato"
                    isInvalid={!!errors.ingredient} // Bootstrap validation
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.ingredient?.join(" ")}
                  </Form.Control.Feedback>
                </Form.Group>

                <div className={styles.ButtonContainer}>
                  <Button
                    type="submit"
                    aria-label="Save"
                    className={`${styles.Button} ${styles.AddButton}`}
                  >
                    {editMode ? (
                      <i className="bi bi-check-lg"></i>
                    ) : (
                      <i className="bi bi-plus-lg"></i>
                    )}
                  </Button>
                  {editMode && (
                    <Button
                      aria-label="Cancel"
                      onClick={resetForm}
                      className={`${styles.Button} ${styles.CancelButton}`}
                    >
                      <i className="bi bi-x-lg"></i>
                    </Button>
                  )}
                </div>
              </div>
            </Form>

            <ul className={styles.IngredientList}>
              {storedIngredients.map((item) => (
                <li key={item.id} className={styles.IngredientItem}>
                  <span className={styles.IngredientText}>
                    {item.quantity} {item.measure} of {item.ingredient}
                  </span>
                  <div className={styles.ActionButtons}>
                    <Button
                      aria-label="Edit"
                      onClick={() => handleEdit(item)}
                      className={`${styles.Button} ${styles.ActionButton} ${styles.EditButton}`}
                    >
                      <i className="bi bi-pencil-square"></i>
                    </Button>
                    <Button
                      aria-label="Delete"
                      onClick={() => handleDelete(item.id)}
                      className={`${styles.Button} ${styles.ActionButton} ${styles.DeleteButton}`}
                    >
                      <i className="bi bi-trash"></i>
                    </Button>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-3 text-center">
              <Button
                aria-label="Done, go to recipe"
                className={`${btnStyles.Button} ${btnStyles.Black}`}
                onClick={handleDone}
              >
                Done, Go to Recipe
              </Button>
            </div>
          </Col>
        </Row>
        <div></div>
      </Container>
    </div>
  );
};

export default IngredientCreateForm;

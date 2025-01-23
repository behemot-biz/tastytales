import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useCurrentUser } from "../../contexts/CurrentUserContext";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import { axiosRes } from "../../api/axiosDefaults";

import Recipe from "./Recipe";

import styles from "../../styles/IngredientManager.module.css";
import btnStyles from "../../styles/Button.module.css";

/**
 * This component allows users to manage ingredients for a specific recipe.
 * Users can add, edit, delete ingredients, and view a preview of the recipe.
 *
 * Features:
 * - Fetches recipe details and pre-populates existing ingredients.
 * - Provides form controls to add or edit ingredients with validation feedback.
 * - Allows users to delete ingredients from the recipe.
 * - Displays a preview of the recipe alongside the ingredient management form.
 *
 */

const IngredientCreateForm = () => {
  const { recipeId } = useParams();

  const history = useHistory();
  const currentUser = useCurrentUser();

  const [formData, setFormData] = useState({
    ingredient: "",
    quantity: "",
    measure: "",
  });
  const [storedIngredients, setStoredIngredients] = useState([]);
  const [recipeData, setRecipeData] = useState(null);
  const [errors, setErrors] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);

  const { ingredient, quantity, measure } = formData;

  useEffect(() => {
    const fetchRecipeDetails = async () => {
      if (!recipeId) return;

      try {
        const { data } = await axiosRes.get(`/recipes/${recipeId}/`);
        setStoredIngredients(data.recipe_ingredients || []);
        setRecipeData(data);
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
    history.push(
      `/cookbook?owner__profile=${currentUser?.profile_id}&status=pending_publish&status=published`
    );
  };

  if (!recipeId) {
    console.error("Recipe ID is missing.");
    return (
      <div className="text-center mt-5">
        <p>Error: Recipe ID is required to add ingredients.</p>
        <Button
          onClick={() => history.push("/recipes")}
          className={btnStyles.Button}
        >
          Go Back to Recipes
        </Button>
      </div>
    );
  }

  return (
    <div>
      <Row className="py-2 p-lg-3">
        <Col className={`${styles.CustCard} p-3`}>
          <h5 className="pb-3">
            {editMode ? "Edit Ingredient" : "Add Ingredient"}
          </h5>

          <Form onSubmit={handleSubmit}>
            <div className={styles.FormRow}>
              <Row>
                <Col md={4}>
                  <Form.Group>
                    <Form.Label className={styles.FormLabel}>
                      Quantity
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="quantity"
                      value={quantity}
                      onChange={handleChange}
                      placeholder="Quantity"
                      isInvalid={!!errors.quantity}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.quantity?.join(" ")}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group>
                    <Form.Label className={styles.FormLabel}>
                      Measure
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="measure"
                      value={measure}
                      onChange={handleChange}
                      placeholder="Measure"
                      isInvalid={!!errors.measure}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.measure?.join(" ")}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group>
                    <Form.Label className={styles.FormLabel}>
                      Ingredient
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="ingredient"
                      value={ingredient}
                      onChange={handleChange}
                      placeholder="Ingredient"
                      isInvalid={!!errors.ingredient}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.ingredient?.join(" ")}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>

              <Row className="mt-n4">
                <Col xs={12} className={`${styles.ButtonContainer}`}>
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
                </Col>
              </Row>
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
              Done, Go to Cookbook
            </Button>
          </div>
        </Col>
      </Row>

      <Row className="py-2 p-lg-3">
        <Col className={`${styles.CustCard} p-3`}>
          <p className={styles.PreviewHeader}>Recipe Preview</p>
          {recipeData && (
            <Recipe
              {...recipeData}
              setRecipe={setRecipeData}
              setIngredients={setStoredIngredients}
              ingredients={storedIngredients}
              recipesPage={false}
            />
          )}
        </Col>
      </Row>
    </div>
  );
};

export default IngredientCreateForm;

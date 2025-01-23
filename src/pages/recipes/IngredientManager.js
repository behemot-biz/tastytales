import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal"; // Import Modal from react-bootstrap

import { axiosRes } from "../../api/axiosDefaults";

import styles from "../../styles/IngredientManager.module.css";
/**
 * This component allows users to manage ingredients for a specific recipe.
 * Users can add, edit, delete ingredients, and view a preview of the recipe.
 *
 * Features:
 * - Fetches recipe details and pre-populates existing ingredients.
 * - Provides form controls to add or edit ingredients with validation feedback.
 * - Allows users to delete ingredients from the recipe.
 * - Displays a preview of the recipe alongside the ingredient management form.
 */

const IngredientManager = ({ recipeId, ingredients, setIngredients }) => {
  const [formData, setFormData] = useState({
    ingredient: "",
    quantity: "",
    measure: "",
  });
  const [errors, setErrors] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false); // Modal visibility
  const [deleteId, setDeleteId] = useState(null); // ID to delete

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (editMode) {
      // Edit existing ingredient
      try {
        const { data } = await axiosRes.put(`/ingredients/${editId}/`, {
          recipe: recipeId,
          ...formData,
        });
        setIngredients((prev) =>
          prev.map((ing) => (ing.id === editId ? data : ing))
        );
        resetForm();
      } catch (err) {
        setErrors(err.response?.data || {});
      }
    } else {
      // Add new ingredient
      try {
        const { data } = await axiosRes.post("/ingredients/", {
          recipe: recipeId,
          ...formData,
        });
        setIngredients((prev) => [...prev, data]);
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

  const handleShowConfirm = (id) => {
    setDeleteId(id);
    setShowConfirm(true);
  };

  const handleCloseConfirm = () => {
    setShowConfirm(false);
    setDeleteId(null);
  };

  const handleDelete = async () => {
    if (deleteId) {
      try {
        await axiosRes.delete(`/ingredients/${deleteId}/`);
        setIngredients((prev) => prev.filter((ing) => ing.id !== deleteId));
        handleCloseConfirm();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const resetForm = () => {
    setFormData({ ingredient: "", quantity: "", measure: "" });
    setEditMode(false);
    setEditId(null);
    setErrors({});
  };

  return (
    <div>
      <div className={styles.FormRow}>
        <Form.Group className={`${styles.CustomInput25}`}>
          <Form.Label className={styles.FormLabel}>Quantity</Form.Label>
          <Form.Control
            type="text"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            placeholder="Quantity"
            isInvalid={!!errors.quantity}
          />
          <Form.Control.Feedback type="invalid">
            {errors.quantity?.join(" ")}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className={` ${styles.CustomInput25}`}>
          <Form.Label className={styles.FormLabel}>Measure</Form.Label>
          <Form.Control
            type="text"
            name="measure"
            value={formData.measure}
            onChange={handleChange}
            placeholder="Measure"
            isInvalid={!!errors.measure}
          />
          <Form.Control.Feedback type="invalid">
            {errors.measure?.join(" ")}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className={` ${styles.CustomInput50}`}>
          <Form.Label className={styles.FormLabel}>Ingredient</Form.Label>
          <Form.Control
            type="text"
            name="ingredient"
            value={formData.ingredient}
            onChange={handleChange}
            placeholder="Ingredient"
            isInvalid={!!errors.ingredient}
          />
          <Form.Control.Feedback type="invalid">
            {errors.ingredient?.join(" ")}
          </Form.Control.Feedback>
        </Form.Group>
        <div className={styles.ButtonContainer}>
          <Button
            onClick={handleSubmit}
            className={`${styles.Button} ${styles.AddButton}`}
            aria-label="Add new ingredient"
          >
            {editMode ? (
              <i className="bi bi-check-lg"></i>
            ) : (
              <i className="bi bi-plus-lg"></i>
            )}
          </Button>

          {editMode && (
            <Button
              onClick={resetForm}
              className={`${styles.Button} ${styles.CancelButton}`}
            >
              <i className="bi bi-x-lg"></i>
            </Button>
          )}
        </div>
      </div>

      <ul className={styles.IngredientList}>
        {ingredients.map((ingredient) => (
          <li key={ingredient.id} className={styles.IngredientItem}>
            <span className={styles.IngredientText}>
              {ingredient.quantity} {ingredient.measure} {ingredient.ingredient}
            </span>
            <div className={styles.ActionButtons}>
              <Button
                onClick={() => handleEdit(ingredient)}
                className={`${styles.Button} ${styles.ActionButton} ${styles.EditButton}`}
                aria-label={`Edit ingredient: ${ingredient.ingredient}`}
              >
                <i className="bi bi-pencil-square"></i>
              </Button>
              <Button
                onClick={() => handleShowConfirm(ingredient.id)}
                className={`${styles.Button} ${styles.ActionButton} ${styles.DeleteButton}`}
                aria-label={`Delete ingredient: ${ingredient.ingredient}`}
              >
                <i className="bi bi-trash"></i>
              </Button>
            </div>
          </li>
        ))}
      </ul>

      {/* Confirmation Modal */}
      <Modal show={showConfirm} onHide={handleCloseConfirm} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this ingredient? This action cannot be
          undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseConfirm}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default IngredientManager;

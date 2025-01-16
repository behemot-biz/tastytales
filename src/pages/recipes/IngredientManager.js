import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

import { axiosRes } from "../../api/axiosDefaults";

import styles from "../../styles/IngredientManager.module.css";

const IngredientManager = ({ recipeId, ingredients, setIngredients }) => {
  const [formData, setFormData] = useState({
    ingredient: "",
    quantity: "",
    measure: "",
  });
  const [errors, setErrors] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);

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

  const handleDelete = async (id) => {
    try {
      await axiosRes.delete(`/ingredients/${id}/`);
      setIngredients((prev) => prev.filter((ing) => ing.id !== id));
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

  return (
    <div>

        <div className={styles.FormRow}>
          <Form.Group className={`${styles.CustomInput25}`}>
            <Form.Label className={styles.FormLabel}>Qty</Form.Label>
            <Form.Control
              type="text"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              placeholder="e.g., 500"
              isInvalid={!!errors.quantity} // Bootstrap validation
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
              placeholder="e.g., g, cups"
              isInvalid={!!errors.measure} // Bootstrap validation
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
              placeholder="e.g., Tomato"
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
              {ingredient.quantity} {ingredient.measure} of{" "}
              {ingredient.ingredient}
            </span>
            <div className={styles.ActionButtons}>
              <Button
                size="sm"
                onClick={() => handleEdit(ingredient)}
                // className={`${btnStyles.Button} ${btnStyles.Black}`}
                className={`${styles.Button} ${styles.ActionButton} ${styles.EditButton}`}
              >
                <i className="bi bi-pencil-square"></i>
              </Button>
              <Button
                // variant="danger"
                // size="sm"
                onClick={() => handleDelete(ingredient.id)}
                className={`${styles.Button} ${styles.ActionButton} ${styles.DeleteButton}`}
              >
                <i className="bi bi-trash"></i>
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default IngredientManager;

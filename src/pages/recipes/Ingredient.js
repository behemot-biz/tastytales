import React, { useState } from "react";

import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";

import { axiosRes } from "../../api/axiosDefaults";

import styles from "../../styles/Ingredient.module.css";

/**
 * Component to display and optionally edit/delete an ingredient.
 * Provides an editable view for owners, enabling updates to ingredient details or removal.
 *
 * Props:
 * - ingredient (object): Ingredient data including name, quantity, and measure.
 * - setIngredients (function): Function to update the ingredient list state.
 * - recipeId (number): ID of the associated recipe.
 * - isOwner (boolean): Indicates if the user is the owner of the recipe.
 * - editable (boolean): Indicates if the ingredient can be edited or deleted.
 */

const Ingredient = ({
  ingredient,
  setIngredients,
  recipeId,
  isOwner,
  editable,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    ingredient: ingredient.ingredient,
    quantity: ingredient.quantity,
    measure: ingredient.measure,
  });
  const [errors, setErrors] = useState({});

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setFormData({
      ingredient: ingredient.ingredient,
      quantity: ingredient.quantity,
      measure: ingredient.measure,
    });
  };

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSave = async () => {
    try {
      const { data } = await axiosRes.put(`/ingredients/${ingredient.id}/`, {
        recipe: recipeId,
        ...formData,
      });
      setIngredients((prev) =>
        prev.map((ing) => (ing.id === ingredient.id ? data : ing))
      );
      setIsEditing(false);
    } catch (err) {
      setErrors(err.response?.data || {});
    }
  };

  const handleDelete = async () => {
    try {
      await axiosRes.delete(`/ingredients/${ingredient.id}/`);
      setIngredients((prev) => prev.filter((ing) => ing.id !== ingredient.id));
    } catch (err) {
      // console.log(err);
    }
  };

  return (
    <li className={styles.IngredientList}>
      {isEditing ? (
        <div>
          <Form.Group>
            <Form.Label>Ingredient</Form.Label>
            <Form.Control
              type="text"
              name="ingredient"
              value={formData.ingredient}
              onChange={handleChange}
            />
          </Form.Group>
          {errors?.ingredient?.map((message, idx) => (
            <Alert key={idx} variant="warning">
              {message}
            </Alert>
          ))}

          <Form.Group>
            <Form.Label>Quantity</Form.Label>
            <Form.Control
              type="text"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
            />
          </Form.Group>
          {errors?.quantity?.map((message, idx) => (
            <Alert key={idx} variant="warning">
              {message}
            </Alert>
          ))}

          <Form.Group>
            <Form.Label>Measure</Form.Label>
            <Form.Control
              type="text"
              name="measure"
              value={formData.measure}
              onChange={handleChange}
            />
          </Form.Group>
          {errors?.measure?.map((message, idx) => (
            <Alert key={idx} variant="warning">
              {message}
            </Alert>
          ))}

          <Button variant="success" onClick={handleSave}>
            Save
          </Button>
          <Button variant="secondary" onClick={handleCancelEdit}>
            Cancel
          </Button>
        </div>
      ) : (
        <div>
          <span>{`${ingredient.quantity} ${ingredient.measure} of ${ingredient.ingredient}`}</span>
          {isOwner && editable && (
            <>
              <Button variant="warning" className="m-2" size="sm" onClick={handleEditClick}>
                Edit
              </Button>
              <Button variant="danger" className="m-2" size="sm" onClick={handleDelete}>
                Delete
              </Button>
              </>
          )}
        </div>
      )}
    </li>
  );
};

export default Ingredient;

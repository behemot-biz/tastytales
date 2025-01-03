import React, { useState } from "react";

import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";

import { axiosRes } from "../../api/axiosDefaults";

import styles from "../../styles/Ingredient.module.css";

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
            <div>
              <Button variant="warning" size="sm" onClick={handleEditClick}>
                Edit
              </Button>
              <Button variant="danger" size="sm" onClick={handleDelete}>
                Delete
              </Button>
            </div>
          )}
        </div>
      )}
    </li>
  );
};

export default Ingredient;

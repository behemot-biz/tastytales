import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";
import { axiosRes } from "../../api/axiosDefaults";

const IngredientCreateForm = ({ recipeId, setIngredients }) => {
  const [ingredientData, setIngredientData] = useState({
    ingredient: "",
    quantity: "",
    measure: "",
  });
  const [errors, setErrors] = useState({});
  const { ingredient, quantity, measure } = ingredientData;

  const handleChange = (event) => {
    setIngredientData({
      ...ingredientData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async () => {
    try {
      const { data } = await axiosRes.post("/ingredients/", {
        recipe: recipeId,
        ...ingredientData,
      });
      setIngredients((prev) => [...prev, data]); // Update ingredients list
      setIngredientData({ ingredient: "", quantity: "", measure: "" }); // Reset form
    } catch (err) {
      setErrors(err.response?.data || {});
    }
  };

  return (
    <div>
      <h5>Add Ingredient</h5>
      <Form.Group>
        <Form.Label>Ingredient</Form.Label>
        <Form.Control
          type="text"
          name="ingredient"
          value={ingredient}
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
          value={quantity}
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
          value={measure}
          onChange={handleChange}
        />
      </Form.Group>
      {errors?.measure?.map((message, idx) => (
        <Alert key={idx} variant="warning">
          {message}
        </Alert>
      ))}

      <Button onClick={handleSubmit}>Add Ingredient</Button>
    </div>
  );
};

export default IngredientCreateForm;

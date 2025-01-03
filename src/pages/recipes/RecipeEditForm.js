import React, { useEffect, useRef, useState } from "react";
import { useHistory, useParams } from "react-router-dom";

import { axiosReq } from "../../api/axiosDefaults";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Alert from "react-bootstrap/Alert";
import Image from "react-bootstrap/Image";

import IngredientCreateForm from "./IngredientCreateForm";
import Ingredient from "./Ingredient";

import styles from "../../styles/RecipeCreateEditForm.module.css";
import appStyles from "../../App.module.css";
import btnStyles from "../../styles/Button.module.css";

function RecipeEditForm() {
  const [errors, setErrors] = useState({});
  const [recipeData, setRecipeData] = useState({
    recipe_name: "",
    intro: "",
    instruction: "",
    image: "",
  });
  const [ingredients, setIngredients] = useState([]);

  const { recipe_name, intro, instruction, image } = recipeData;

  const imageInput = useRef(null);
  const history = useHistory();
  const { id: recipeId } = useParams();

  useEffect(() => {
    const handleMount = async () => {
      try {
        const { data } = await axiosReq.get(`/recipes/${recipeId}/`);
        const {
          recipe_name,
          intro,
          instruction,
          image,
          is_owner,
          recipe_ingredients,
        } = data;

        if (is_owner) {
          setRecipeData({ recipe_name, intro, instruction, image });
          setIngredients(recipe_ingredients || []);
        } else {
          history.push("/");
        }
      } catch (err) {
        // console.log(err);
      }
    };
    handleMount();
  }, [history, recipeId]);

  const handleChange = (event) => {
    setRecipeData({
      ...recipeData,
      [event.target.name]: event.target.value,
    });
  };

  const handleChangeImage = (event) => {
    if (event.target.files.length) {
      URL.revokeObjectURL(image);
      setRecipeData({
        ...recipeData,
        image: URL.createObjectURL(event.target.files[0]),
      });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();

    formData.append("recipe_name", recipe_name);
    formData.append("intro", intro);
    formData.append("instruction", instruction);
    if (imageInput?.current.files[0]) {
      formData.append("image", imageInput.current.files[0]);
    }

    try {
      await axiosReq.put(`/recipes/${recipeId}/`, formData);
      history.push(`/recipes/${recipeId}`);
    } catch (err) {
      // console.log(err);
      if (err.response?.status !== 401) {
        setErrors(err.response?.data);
      }
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Row>
        <Col md={7} lg={8}>
          <Container
            className={`${appStyles.Content} ${styles.Container} d-flex flex-column justify-content-center`}
          >
            <Form.Group className="text-center">
              <figure>
                <Image className={appStyles.Image} src={image} rounded />
              </figure>
              <div>
                <Form.Label
                  className={`${btnStyles.Button} ${btnStyles.Blue} btn`}
                  htmlFor="image-upload"
                >
                  Change image
                </Form.Label>
              </div>
              <Form.File
                id="image-upload"
                accept="image/*"
                onChange={handleChangeImage}
                ref={imageInput}
              />
            </Form.Group>
            {errors?.image?.map((message, idx) => (
              <Alert variant="warning" key={idx}>
                {message}
              </Alert>
            ))}

            <Form.Group>
              <Form.Label>Recipe Name</Form.Label>
              <Form.Control
                type="text"
                name="recipe_name"
                value={recipe_name}
                onChange={handleChange}
              />
            </Form.Group>
            {errors?.recipe_name?.map((message, idx) => (
              <Alert variant="warning" key={idx}>
                {message}
              </Alert>
            ))}

            <Form.Group>
              <Form.Label>Recipe Introduction</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                name="intro"
                value={intro}
                onChange={handleChange}
              />
            </Form.Group>
            {errors?.intro?.map((message, idx) => (
              <Alert variant="warning" key={idx}>
                {message}
              </Alert>
            ))}

            <Form.Group>
              <Form.Label>Cooking Instruction</Form.Label>
              <Form.Control
                as="textarea"
                rows={9}
                name="instruction"
                value={instruction}
                onChange={handleChange}
              />
            </Form.Group>
            {errors?.instruction?.map((message, idx) => (
              <Alert variant="warning" key={idx}>
                {message}
              </Alert>
            ))}

            <Button
              className={`${btnStyles.Button} ${btnStyles.Blue}`}
              onClick={() => history.push(`/recipes/${recipeId}`)}
            >
              cancel
            </Button>
            <Button
              className={`${btnStyles.Button} ${btnStyles.Blue}`}
              type="submit"
            >
              save
            </Button>
          </Container>

          <h5>Ingredients</h5>
          <ul>
            {ingredients.map((ingredient) => (
              <Ingredient
                key={ingredient.id}
                ingredient={ingredient}
                setIngredients={setIngredients}
                recipeId={recipeId}
                isOwner={ingredient.is_owner}
                editable={true}
              />
            ))}
          </ul>
          <IngredientCreateForm
            recipeId={recipeId}
            setIngredients={setIngredients}
          />
        </Col>
      </Row>
    </Form>
  );
}

export default RecipeEditForm;

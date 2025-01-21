import React, { useRef, useState } from "react";
import { useHistory } from "react-router-dom";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Alert from "react-bootstrap/Alert";
import Image from "react-bootstrap/Image";

import { axiosReq } from "../../api/axiosDefaults";
import { useRedirect } from "../../hooks/useRedirect";

import Asset from "../../components/Asset";
import Upload from "../../assets/upload.png";

import styles from "../../styles/RecipeCreateEditForm.module.css";
import appStyles from "../../App.module.css";
import btnStyles from "../../styles/Button.module.css";

/**
 * Form component to create a new recipe.
 * Allows the user to input recipe details such as name, introduction, instruction, and upload an image.
 * Submits the data to the API to create a new recipe entry.
 *
 * Features:
 * - Redirects to `IngredientCreateForm` upon successful recipe creation to manage ingredients.
 * - Handles image upload and preview before submission.
 * - Provides validation feedback for input fields.
 *
 * State Management:
 * - Tracks recipe details in `recipeData`.
 * - Manages validation errors in `errors`.
 */

function RecipeCreateForm() {
  useRedirect("loggedOut");
  const [errors, setErrors] = useState({});

  const [recipeData, setRecipeData] = useState({
    recipe_name: "",
    intro: "",
    instruction: "",
    image: "",
  });
  const { recipe_name, intro, instruction, image } = recipeData;

  const imageInput = useRef(null);
  const history = useHistory();

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
    formData.append("image", imageInput.current.files[0]);

    try {
      const { data } = await axiosReq.post("/recipes/", formData);
      history.push({
        pathname: "/ingredients/create",
        state: { recipeId: data.id },
      });
    } catch (err) {
      // console.log(err);
      if (err.response?.status !== 401) {
        setErrors(err.response?.data);
      }
    }
  };

  const textFields = (
    <div className="text-center">
      <Form.Group>
        <Form.Label>Recipe Name</Form.Label>
        <Form.Control
          type="text"
          name="recipe_name"
          value={recipe_name}
          onChange={handleChange}
          placeholder="Recipe name"
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
          placeholder="Give your recipe a short introduction"
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
          placeholder="Descripe how to prepare and cook your recipe"
        />
      </Form.Group>
      {errors?.instruction?.map((message, idx) => (
        <Alert variant="warning" key={idx}>
          {message}
        </Alert>
      ))}

      <Button
        className={`${btnStyles.Button} ${btnStyles.Black}`}
        onClick={() => history.goBack()}
      >
        cancel
      </Button>
      <Button
        className={`${btnStyles.Button} ${btnStyles.Black}`}
        type="submit"
      >
        add ingredients
      </Button>
    </div>
  );

  return (
    <Form onSubmit={handleSubmit}>
      <Row>
        <Col className="py-2 p-0 p-md-2" md={7} lg={8}>
          <Container
            className={`${appStyles.Content} ${styles.Container} d-flex flex-column justify-content-center`}
          >
            <Form.Group className="text-center">
              {image ? (
                <>
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
                </>
              ) : (
                <Form.Label
                  className="d-flex justify-content-center"
                  htmlFor="image-upload"
                >
                  <Asset src={Upload} message="Click to upload recipe image" />
                </Form.Label>
              )}
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
            <div className="d-md-none">{textFields}</div>
          </Container>
        </Col>
        <Col md={5} lg={4} className="d-none d-md-block p-0 p-md-2">
          <Container className={appStyles.Content}>{textFields}</Container>
        </Col>
      </Row>
    </Form>
  );
}

export default RecipeCreateForm;

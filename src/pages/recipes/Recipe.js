import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import styles from "../../styles/Recipe.module.css";
import Card from "react-bootstrap/Card";
import Media from "react-bootstrap/Media";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import Avatar from "../../components/Avatar";
import { axiosRes, axiosReq } from "../../api/axiosDefaults";
import { MoreDropdown } from "../../components/MoreDropdown";
import Ingredient from "./Ingredient";

const Recipe = (props) => {
  const {
    id,
    owner,
    profile_id,
    profile_image,
    comments_count,
    likes_count,
    like_id,
    recipe_name,
    intro,
    instruction,
    image,
    updated_at,
    recipePage,
    setRecipes,
  } = props;
  const currentUser = useCurrentUser();
  const isOwner = currentUser?.username === owner;
  const history = useHistory();
  const [ingredients, setIngredients] = useState([]);

    // Fetch recipe and ingredients
    useEffect(() => {
      const fetchRecipe = async () => {
        try {
          const { data } = await axiosReq.get(`/recipes/${id}`);
          setIngredients(data.recipe_ingredients || []); // Extract ingredients from the recipe object
        } catch (err) {
          console.error("Error fetching recipe:", err);
        }
      };
  
      fetchRecipe();
    }, [id]);

  const handleEdit = () => {
    history.push(`/recipes/${id}/edit`);
  };

  const handleDelete = async () => {
    try {
      await axiosRes.delete(`/recipes/${id}/`);
      history.push("/recipes");
    } catch (err) {
      console.error("Error deleting recipe:", err);
    }
  };
  
  const handleLike = async () => {
    try {
      const { data } = await axiosRes.post("/likes/", { recipe: id });
      setRecipes((prevRecipes) => ({
        ...prevRecipes,
        results: prevRecipes.results.map((recipe) => {
          return recipe.id === id
            ? { ...recipe, likes_count: recipe.likes_count + 1, like_id: data.id }
            : recipe;
        }),
      }));
    } catch (err) {
      console.log(err);
    }
  };
  const handleUnlike = async () => {
    try {
      await axiosRes.delete(`/likes/${like_id}/`);
      setRecipes((prevRecipes) => ({
        ...prevRecipes,
        results: prevRecipes.results.map((recipe) => {
          return recipe.id === id
            ? { ...recipe, likes_count: recipe.likes_count - 1, like_id: null }
            : recipe;
        }),
      }));
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <Card className={styles.Recipe}>
      <Card.Body>
        <Media className="align-items-center justify-content-between">
          <Link to={`/profiles/${profile_id}`}>
            <Avatar src={profile_image} height={55} />
            {owner}
          </Link>
          <div className="d-flex align-items-center">
            <span>{updated_at}</span>
            {isOwner && recipePage && (
              <MoreDropdown
                handleEdit={handleEdit}
                handleDelete={handleDelete}
              />
            )}
          </div>
        </Media>
      </Card.Body>
      <Link to={`/recipes/${id}`}>
        <Card.Img className={styles.RecipeCardImg} src={image} alt={recipe_name} />
      </Link>
      <Card.Body>
        {recipe_name && (
          <Card.Title className="text-left">{recipe_name}</Card.Title>
        )}
        {intro && (
          <Card.Text
            className="text-left pb-4"
            style={{ whiteSpace: "pre-wrap" }}
          >
            {intro}
          </Card.Text>
        )}
        <Row>
          <Col>
          <Card.Title className="text-left">Ingredients</Card.Title>
            <ul className={styles.IngredientList}>
              {ingredients.map((ingredient) => (
                <Ingredient
                  key={ingredient.id}
                  ingredient={ingredient}
                  setIngredients={setIngredients}
                  recipeId={id}
                  isOwner={ingredient.is_owner}
                  editable={false}
                />
              ))}
            </ul>
          </Col>
          <Col>
            <Card.Title className="text-left">Instruction</Card.Title>
            <Card.Text className="text-left" style={{ whiteSpace: "pre-wrap" }}>
              {instruction}
            </Card.Text>
          </Col>
        </Row>

        <div className={styles.PostBar}>
          {isOwner ? (
            <OverlayTrigger
              placement="top"
              overlay={<Tooltip>You can't like your own recipe!</Tooltip>}
            >
              <i className="far fa-heart" />
            </OverlayTrigger>
          ) : like_id ? (
            <span onClick={handleUnlike}>
              <i className={`fas fa-heart ${styles.Heart}`} />
            </span>
          ) : currentUser ? (
            <span onClick={handleLike}>
              <i className={`far fa-heart ${styles.HeartOutline}`} />
            </span>
          ) : (
            <OverlayTrigger
              placement="top"
              overlay={<Tooltip>Log in to like recipes!</Tooltip>}
            >
              <i className="far fa-heart" />
            </OverlayTrigger>
          )}
          {likes_count}
          <Link to={`/recipes/${id}`}>
            <i className="far fa-comments" />
          </Link>
          {comments_count}
        </div>
      </Card.Body>
    </Card>
  );
};

export default Recipe;

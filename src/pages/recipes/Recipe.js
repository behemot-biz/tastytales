import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";

import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Media from "react-bootstrap/Media";
import Row from "react-bootstrap/Row";
import Tab from "react-bootstrap/Tab";
import Nav from "react-bootstrap/Nav";

import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";

import { useCurrentUser } from "../../contexts/CurrentUserContext";
import { axiosRes } from "../../api/axiosDefaults";
import { capitalizeFirstLetter } from "../../utils/utils";

import Avatar from "../../components/Avatar";
import Ingredient from "./Ingredient";

import styles from "../../styles/Recipe.module.css";
import btnStyles from "../../styles/Button.module.css";

/**
 * Component to display detailed information about a recipe.
 * Includes functionality for viewing recipe details, liking/unliking,
 * and editing/deleting (if the user is the owner).
 * Shows associated ingredients and allows interaction with them.
 */

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
    ingredients,
    setIngredients,
    recipeId,
  } = props;

  const currentUser = useCurrentUser();
  const is_owner = currentUser?.username === owner;
  const history = useHistory();

  const [activeTab, setActiveTab] = useState("ingredients");

  const handleEdit = () => {
    history.push(`/recipes/${id}/edit`);
  };

  const handleLike = async () => {
    try {
      const { data } = await axiosRes.post("/likes/", { recipe: id });
      setRecipes((prevRecipes) => ({
        ...prevRecipes,
        results: prevRecipes.results.map((recipe) => {
          return recipe.id === id
            ? {
                ...recipe,
                likes_count: recipe.likes_count + 1,
                like_id: data.id,
              }
            : recipe;
        }),
      }));
    } catch (err) {
      // console.log(err);
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
      // console.log(err);
    }
  };

  const iconField = (
    <>
      <div className="align-items-center justify-content-between">
        {is_owner ? (
          <OverlayTrigger
            placement="top"
            overlay={<Tooltip>You can't like your own recipe!</Tooltip>}
          >
            <i className="bi bi-heart" />
          </OverlayTrigger>
        ) : like_id ? (
          <span onClick={handleUnlike}>
            <i className={`bi bi-heart-fill ${styles.Heart}`} />
          </span>
        ) : currentUser ? (
          <span onClick={handleLike}>
            <i className={`bi bi-heart ${styles.HeartOutline}`} />
          </span>
        ) : (
          <OverlayTrigger
            placement="top"
            overlay={<Tooltip>Log in to like recipes!</Tooltip>}
          >
            <i className="bi bi-heart" />
          </OverlayTrigger>
        )}
        {likes_count}
        <Link to={`/recipes/${id}`} aria-label={`View recipe ${recipe_name}`}>
          <i className="bi bi-chat" />
        </Link>
        {comments_count}

        {is_owner && recipePage && (
          <OverlayTrigger
            placement="top"
            overlay={<Tooltip>Edit Recipe</Tooltip>}
          >
            <button
              className={`${btnStyles.IconButton} ${styles.EditBtn}`}
              onClick={handleEdit}
              aria-label="Edit Recipe"
            >
              <i className="bi-pencil-square text-dark" />
            </button>
          </OverlayTrigger>
        )}
      </div>
    </>
  );

  const avatarField = (
    <>
      <Media className="align-items-center justify-content-between ml-n1">
        <Link to={`/profiles/${profile_id}`}>
          <Avatar src={profile_image} height={100} />
          {owner ? capitalizeFirstLetter(owner) : "Loading..."}
        </Link>
        <div className="d-flex align-items-center">
          <span>{updated_at}</span>
        </div>
      </Media>
    </>
  );

  return (
    <>
      <Container className={styles.Recipe}>
        <Row className="d-none d-lg-flex p-0 pb-3">
          {/* Big Screen Layout */}
          <Col lg={4} className="p-0">
            <div className="text-center">
              <img
                src={image}
                alt={recipe_name}
                className={`${styles.RecipeCardImg} img-fluid`}
                loading="lazy"
              />
            </div>

            <div className={`${styles.CustCard} mt-4 px-4 py-3`}>
              <p className={styles.RecipeHeadline}>Ingredients</p>
              <ul className={styles.IngredientList}>
                {ingredients.map((ingredient) => (
                  <Ingredient
                    key={ingredient.id}
                    ingredient={ingredient}
                    setIngredients={setIngredients}
                    recipeId={recipeId}
                  />
                ))}
              </ul>
            </div>
          </Col>

          <Col lg={8} className="px-4">
            <div className={`${styles.CustCard} px-4 py-3`}>
              <h1>{recipe_name}</h1>
              {iconField}
              <p className="lead">{intro}</p>
            </div>
            <div className={`${styles.CustCard} mt-4 px-4 py-3`}>
              <p className={styles.RecipeHeadline}>Instruction</p>
              <p>{instruction}</p>
              {avatarField}
            </div>
          </Col>
        </Row>

        {/* Small Screen Layout */}
        <Row className={`${styles.CustCard} d-lg-none pb-3`}>
          <Col sm={12} className="p-0">
            <div className="text-center">
              <img
                src={image}
                alt={recipe_name}
                className={`${styles.RecipeCardImg} img-fluid`}
                loading="lazy"
              />
            </div>
            {iconField}
          </Col>

          <Col sm={12} className="py-3">
            <h1>{recipe_name}</h1>
            <p>{intro}</p>
          </Col>

          <Col sm={12} className="py-3">
            <Tab.Container
              id="customTabs"
              activeKey={activeTab}
              onSelect={(selectedTab) => setActiveTab(selectedTab)}
            >
              <Nav>
                <Nav.Item>
                  <Nav.Link
                    className={`${styles.NavLink} ${
                      activeTab === "ingredients" ? styles.NavLinkActive : ""
                    } p-0 mr-3`}
                    eventKey="ingredients"
                  >
                    Ingredients
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link
                    className={`${styles.NavLink} ${
                      activeTab === "instruction" ? styles.NavLinkActive : ""
                    } p-0`}
                    eventKey="instruction"
                  >
                    Instructions
                  </Nav.Link>
                </Nav.Item>
              </Nav>

              <Tab.Content className="py-3">
                <Tab.Pane eventKey="ingredients">
                  <ul className={styles.IngredientList}>
                    {ingredients.map((ingredient) => (
                      <Ingredient
                        key={ingredient.id}
                        ingredient={ingredient}
                        setIngredients={setIngredients}
                        recipeId={recipeId}
                        is_owner={ingredient.is_owner}
                        editable={false}
                      />
                    ))}
                  </ul>
                </Tab.Pane>
                <Tab.Pane eventKey="instruction">
                  <p>{instruction}</p>
                </Tab.Pane>
              </Tab.Content>
            </Tab.Container>
          </Col>

          <Col sm={12}>{avatarField}</Col>
        </Row>
      </Container>
    </>
  );
};

export default Recipe;

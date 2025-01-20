import React from "react";
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
    status,
  } = props;
  const currentUser = useCurrentUser();
  const is_owner = currentUser?.username === owner;

  const history = useHistory();

  const handlePublish = async () => {
    try {
      await axiosRes.patch(`/recipes/${id}/`, { status: "published" });
      setRecipes((prevRecipes) => ({
        ...prevRecipes,
        results: prevRecipes.results.map((recipe) =>
          recipe.id === id ? { ...recipe, status: "published" } : recipe
        ),
      }));
    } catch (err) {
      console.log(err);
    }
  };

  const handleUnPublish = async () => {
    try {
      await axiosRes.patch(`/recipes/${id}/`, { status: "pending_publish" });
      setRecipes((prevRecipes) => ({
        ...prevRecipes,
        results: prevRecipes.results.map((recipe) =>
          recipe.id === id ? { ...recipe, status: "pending_publish" } : recipe
        ),
      }));
    } catch (err) {
      console.log(err);
    }
  };

  const handlePreDelete = async () => {
    try {
      await axiosRes.patch(`/recipes/${id}/`, { status: "pending_delete" });
      setRecipes((prevRecipes) => ({
        ...prevRecipes,
        results: prevRecipes.results.map((recipe) =>
          recipe.id === id ? { ...recipe, status: "pending_delete" } : recipe
        ),
      }));
    } catch (err) {
      console.log(err);
    }
  };

  const handleDelete = async () => {
    try {
      await axiosRes.delete(`/recipes/${id}/`);
      history.go(0);
    } catch (err) {
      // console.log(err);
    }
  };

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
      {/* icons */}
      <div className="align-items-center justify-content-between">
        {is_owner ? (
          <OverlayTrigger
            placement="top"
            overlay={<Tooltip>You can&apos;t like your own recipe!</Tooltip>}
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
        <Link to={`/recipes/${id}`}>
          <i className="bi bi-chat" />
        </Link>
        {comments_count}

        {is_owner && recipePage && (
          <OverlayTrigger
            placement="top"
            overlay={<Tooltip>Edit Recipe</Tooltip>}
          >
            <span
              className={styles.EditBtn}
              onClick={handleEdit}
              aria-label="edit"
            >
              <i className="bi-pencil-square text-dark" />
            </span>
          </OverlayTrigger>
        )}
        {is_owner &&
          recipePage &&
          (status === "published" || status === "pending_publish") && (
            <OverlayTrigger
              placement="top"
              overlay={<Tooltip>Mark Recipe for deletion</Tooltip>}
            >
              <span
                className={styles.EditBtn}
                onClick={handlePreDelete}
                aria-label="mark for deletion"
              >
                <i className={`${styles.IconTextWarning} bi bi-trash`} />
              </span>
            </OverlayTrigger>
          )}
        {is_owner && recipePage && status === "pending_delete" && (
          <>
            <OverlayTrigger
              placement="top"
              overlay={<Tooltip>Delete recipe</Tooltip>}
            >
              <span
                className={styles.EditBtn}
                onClick={handleDelete}
                aria-label="delete recipe"
              >
                <i className="bi bi-trash text-danger" />
              </span>
            </OverlayTrigger>

            <OverlayTrigger
              placement="top"
              overlay={<Tooltip>Undelete recipe</Tooltip>}
            >
              <span
                className={styles.EditBtn}
                onClick={handleUnPublish}
                aria-label="undelete recipe"
              >
                <i className="bi bi-cloud-download text-success" />
              </span>
            </OverlayTrigger>
          </>
        )}
        {is_owner && recipePage && status === "pending_publish" && (
          <OverlayTrigger
            placement="top"
            overlay={<Tooltip>Publish Recipe</Tooltip>}
          >
            <span
              className={styles.EditBtn}
              onClick={handlePublish}
              aria-label="publish recipe"
            >
              <i className="bi  bi-cloud-upload text-dark" />
            </span>
          </OverlayTrigger>
        )}
        {is_owner && recipePage && status === "published" && (
          <OverlayTrigger
            placement="top"
            overlay={<Tooltip>Unpublish Recipe</Tooltip>}
          >
            <span
              className={styles.EditBtn}
              onClick={handleUnPublish}
              aria-label="unpublish recipe"
            >
              <i
                className={`${styles.IconTextWarning} bi bi-cloud-download `}
              />
            </span>
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
        {/* Big Screen Layout */}
        <Row className="d-none d-lg-flex p-0 pb-3">
          <Col lg={4} className=" p-0">
            <div className="text-center">
              <img
                src={image}
                alt={recipe_name}
                className={`${styles.RecipeCardImg} img-fluid`}
                loading="lazy"
              />
            </div>

            <div className={`${styles.CustCard} mt-4 px-4 py-3`}>
              <h3>Ingredients</h3>
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
              <p className="lead text-muted">{intro}</p>
            </div>
            <div className={`${styles.CustCard} mt-4 px-4 py-3`}>
              <h3>Instruction</h3>
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
          </Col>

          <Col sm={12} className="py-3">
            <h1>{recipe_name}</h1>
            {iconField}
            <p>{intro}</p>
          </Col>

          <Col sm={12} className="py-3">
            <Tab.Container id="customTabs" defaultActiveKey="ingredients">
              <Nav>
                <Nav.Item>
                  <Nav.Link
                    className={`${styles.NavLink} p-0 mr-3`}
                    eventKey="ingredients"
                  >
                    Ingredients
                  </Nav.Link>
                </Nav.Item>

                <Nav.Item>
                  <Nav.Link
                    className={`${styles.NavLink} p-0`}
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

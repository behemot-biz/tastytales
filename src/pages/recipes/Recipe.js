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
import CommentCreateForm from "../comments/CommentCreateForm";
import { MoreDropdown } from "../../components/MoreDropdown";
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
    recipesPage,
    setRecipes,
    ingredients,
    setIngredients,
    recipeId,
  } = props;
  const currentUser = useCurrentUser();
  const isOwner = currentUser?.username === owner;
  const is_owner = currentUser?.username === owner;
  
  const history = useHistory();

  console.log("recipePage:", recipesPage);

  const handleEdit = () => {
    history.push(`/recipes/${id}/edit`);
  };

  const handleDelete = async () => {
    try {
      await axiosRes.delete(`/recipes/${id}/`);
      history.push("/recipes");
      // history.goBack();

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
  const iconFields = (
    <>

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
        <div className={styles.TmpSlask}>
      {isOwner && recipesPage && (
        <MoreDropdown handleEdit={handleEdit} handleDelete={handleDelete} />
      )}
      </div>


    </>
  );
  const avatarFields = (
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
                    isOwner={ingredient.is_owner}
                    editable={false}
                  />
                ))}
              </ul>
            </div>
          </Col>

          <Col lg={8} className="px-4">
          <div className={`${styles.CustCard} px-4 py-3`}>
            <h1>{recipe_name}</h1>
            <p className="lead text-muted">{intro}</p>
            {iconFields}
            </div>
            <div className={`${styles.CustCard} mt-4 px-4 py-3`}> 
            <h3 >Instruction</h3>
            <p>{instruction}</p>
            
            {avatarFields}
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
                        isOwner={ingredient.is_owner}
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

          <Col sm={12}>
           {avatarFields}
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Recipe;

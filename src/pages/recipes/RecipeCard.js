import React from "react";
import { Link, useHistory } from "react-router-dom";

import Card from "react-bootstrap/Card";
import Media from "react-bootstrap/Media";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";

import { useCurrentUser } from "../../contexts/CurrentUserContext";
import { axiosRes } from "../../api/axiosDefaults";
import { truncateText, capitalizeFirstLetter } from "../../utils/utils";

import { CardEditDropdown } from "../../components/MoreDropdown";
import Avatar from "../../components/Avatar";


import styles from "../../styles/RecipeCard.module.css";

/**
 * Component to display a summary card for a recipe.
 * Includes recipe name, image, brief introduction, and stats like likes and comments.
 * Allows liking/unliking and navigation to the recipe details page.
 */

const RecipeCard = (props) => {
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
    image,
    updated_at,
    recipesPage,
    setRecipes,
  } = props;

  const currentUser = useCurrentUser();
  const is_owner = currentUser?.username === owner;
  const history = useHistory();

  const handleEdit = () => {
    history.push(`/recipes/${id}/edit`);
  };

  const handleDelete = async () => {
    try {
      await axiosRes.delete(`/recipes/${id}/`);
      history.goBack();
    } catch (err) {
      // console.log(err);
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

  return (
    <Card className={styles.RecipeCard}>
      <Link to={`/recipes/${id}`}>
        <Card.Img src={image} className={styles.CardImg} alt={recipe_name} />
      </Link>
      <Card.Body>
        {recipe_name && (
          <Card.Title className="text-left">{recipe_name}</Card.Title>
        )}
        {intro && (
          <Card.Text className="text-left">{truncateText(intro, 50)}</Card.Text>
        )}
      </Card.Body>

      <Card.Body>
        <Media
          className={`${styles.AvatarText} align-items-center justify-content-between`}
        >
          <Link to={`/profiles/${profile_id}`}>
            <Avatar src={profile_image} height={35} margin="0 4px 0 0" />
            {capitalizeFirstLetter(owner)}
          </Link>
          <div className="d-flex align-items-center">
            <span>{updated_at}</span>
            
          </div>
        </Media>
        <div className={styles.PostBar}>
          {is_owner ? (
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
         
          {is_owner && recipesPage && (
            <CardEditDropdown
              className={styles.EditBtn}
              handleEdit={handleEdit}
              handleDelete={handleDelete}
            />
          )}
          
        </div>
      </Card.Body>
    </Card>
  );
};

export default RecipeCard;

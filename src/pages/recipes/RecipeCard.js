import React from "react";
import { Link, useHistory } from "react-router-dom";

import Card from "react-bootstrap/Card";
import Media from "react-bootstrap/Media";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";

import { useCurrentUser } from "../../contexts/CurrentUserContext";

import { axiosRes } from "../../api/axiosDefaults";
import { truncateText, capitalizeFirstLetter } from "../../utils/utils";

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
    cookbookPage,
    setRecipes,
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
  console.log("like_id ", like_id);
  console.log("likes_count ", likes_count);

  return (
    <Card className={styles.RecipeCard}>
      <Link to={`/recipes/${id}`}>
        <div className={styles.ImageWrapper}>
          <Card.Img src={image} className={styles.CardImg} alt={recipe_name} />
          {status && cookbookPage && (
            <span className={styles.StatusPill}>{status}</span>
          )}
        </div>
      </Link>
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

        {is_owner && (recipesPage || cookbookPage) && (
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
          cookbookPage &&
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
        {is_owner && cookbookPage && status === "pending_delete" && (
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
        {is_owner && cookbookPage && status === "pending_publish" && (
          <OverlayTrigger
            placement="top"
            overlay={<Tooltip>Publish recipe</Tooltip>}
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
        {is_owner && cookbookPage && status === "published" && (
          <OverlayTrigger
            placement="top"
            overlay={<Tooltip>Unpublish recipe</Tooltip>}
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

      {/* Main Content */}
      <Card.Body className={styles.CardBody}>
        {recipe_name && (
          <Card.Title className="text-left">{recipe_name}</Card.Title>
        )}
        {intro && (
          <Card.Text className="text-left">{truncateText(intro, 75)}</Card.Text>
        )}
      </Card.Body>

      {/* PostBar aligned at the bottom */}
      <Media
        className={`${styles.AvatarText} px-2 pb-3 align-items-center justify-content-between`}
      >
        <Link to={`/profiles/${profile_id}`}>
          <Avatar src={profile_image} height={35} margin="0 4px 0 0" />
          {capitalizeFirstLetter(owner)}
        </Link>
        <div className="d-flex align-items-center">
          <span>{updated_at}</span>
        </div>
      </Media>
    </Card>
  );
};

export default RecipeCard;

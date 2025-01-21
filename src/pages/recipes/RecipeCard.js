import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";

import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Media from "react-bootstrap/Media";
import Modal from "react-bootstrap/Modal";
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
  const [showDeleteModal, setShowDeleteModal] = useState(false);
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

  const handleDelete = async () => {
    try {
      await axiosRes.delete(`/recipes/${id}/`);
      history.go(0);
    } catch (err) {
      console.log(err);
    } finally {
      setShowDeleteModal(false); // Close the modal
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

  return (
    <>
      <Card className={styles.RecipeCard}>
        <Link to={`/recipes/${id}`}>
          <div className={styles.ImageWrapper}>
            <Card.Img
              src={image}
              className={styles.CardImg}
              alt={recipe_name}
            />
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
          {is_owner && cookbookPage && (
            <>
              <OverlayTrigger
                placement="top"
                overlay={<Tooltip>Delete recipe</Tooltip>}
              >
                <span
                  className={styles.EditBtn}
                  onClick={() => setShowDeleteModal(true)}
                  aria-label="delete recipe"
                >
                  <i className="bi bi-trash text-dark" />
                </span>
              </OverlayTrigger>
            </>
          )}
          {is_owner && cookbookPage && status === "pending_publish" && (
            <OverlayTrigger
              placement="top"
              overlay={<Tooltip>Publish Recipe</Tooltip>}
            >
              <span
                className={styles.EditBtn}
                onClick={handlePublish}
                aria-label="publish recipe"
              >
                <i className="bi bi-box-arrow-in-up text-dark" />
              </span>
            </OverlayTrigger>
          )}
          {is_owner && cookbookPage && status === "published" && (
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
                  className="bi bi-box-arrow-in-down text-dark"
                  // className={`${styles.IconTextWarning} bi box-arrow-in-down`}
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
            <Card.Text className="text-left">
              {truncateText(intro, 75)}
            </Card.Text>
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

      {/* Delete Confirmation Modal */}
      <Modal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this recipe? This action cannot be
          undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default RecipeCard;

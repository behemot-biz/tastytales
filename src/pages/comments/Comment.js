import React, { useState } from "react";
import { Link } from "react-router-dom";

import Media from "react-bootstrap/Media";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

import { axiosReq } from "../../api/axiosDefaults";
import { useCurrentUser } from "../../contexts/CurrentUserContext";

import Avatar from "../../components/Avatar";
import CommentEditForm from "./CommentEditForm";

import styles from "../../styles/Comment.module.css";

/**
 * Component to display an individual comment.
 * Allows the owner to edit or delete their comments via icons.
 */

const Comment = (props) => {
  const {
    profile_id,
    profile_image,
    owner,
    updated_at,
    content,
    id,
    setRecipe,
    setComments,
  } = props;

  const [showEditForm, setShowEditForm] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const currentUser = useCurrentUser();
  const is_owner = currentUser?.username === owner;

  const handleDelete = async () => {
    try {
      await axiosReq.delete(`/comments/${id}/`);
      setRecipe((prevRecipe) => ({
        results: [
          {
            ...prevRecipe.results[0],
            comments_count: prevRecipe.results[0].comments_count - 1,
          },
        ],
      }));

      setComments((prevComments) => ({
        results: prevComments.results.filter((comment) => comment.id !== id),
      }));
      setShowDeleteModal(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <hr />
      <Media>
        <Link to={`/profiles/${profile_id}`}>
          <Avatar src={profile_image} />
        </Link>
        <Media.Body className="align-self-center ml-2">
          <span className={styles.Owner}>{owner}</span>
          <span className={styles.Date}>{updated_at}</span>
          {showEditForm ? (
            <CommentEditForm
              id={id}
              profile_id={profile_id}
              content={content}
              profileImage={profile_image}
              setComments={setComments}
              setShowEditForm={setShowEditForm}
            />
          ) : (
            <p>{content}</p>
          )}
        </Media.Body>

        {/* Icons for Edit and Delete */}
        {is_owner && !showEditForm && (
          <div className={styles.ActionIcons}>
            <i
              className={`bi bi-trash ${styles.DeleteIcon}`}
              onClick={() => setShowDeleteModal(true)}
            />
            <i
              className={`bi bi-pencil-square ${styles.EditIcon}`}
              onClick={() => setShowEditForm(true)}
            />
          </div>
        )}
      </Media>

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
          Are you sure you want to delete this comment? This action cannot be
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

export default Comment;

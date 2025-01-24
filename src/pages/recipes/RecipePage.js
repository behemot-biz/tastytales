import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { useHistory } from "react-router-dom";

import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import InfiniteScroll from "react-infinite-scroll-component";

import { useCurrentUser } from "../../contexts/CurrentUserContext";

import { axiosReq } from "../../api/axiosDefaults";
import { fetchMoreData } from "../../utils/utils";

import Asset from "../../components/Asset";
import Comment from "../comments/Comment";
import CommentCreateForm from "../comments/CommentCreateForm";
import PopularProfiles from "../profiles/PopularProfiles";
import Recipe from "./Recipe";

import appStyles from "../../App.module.css";

/**
 * Component to display a detailed view of a specific recipe.
 * Shows recipe details, associated ingredients, and comments.
 * Allows the owner to add ingredients and users to comment on the recipe.
 */

function RecipePage() {
  const history = useHistory();
  const { id } = useParams();
  const [recipe, setRecipe] = useState({ results: [] });
  const [ingredients, setIngredients] = useState([]);

  const currentUser = useCurrentUser();
  const profile_image = currentUser?.profile_image;
  const [comments, setComments] = useState({ results: [] });
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    const handleMount = async () => {
      try {
        const [{ data: recipe }, { data: comments }] = await Promise.all([
          axiosReq.get(`/recipes/${id}`),
          axiosReq.get(`/comments/?recipe=${id}`),
        ]);
        setRecipe({ results: [recipe] });
        setIngredients(recipe.recipe_ingredients || []);
        setComments(comments);
        setHasLoaded(true);
      } catch (err) {
        if (err.response?.status === 404 || err.response?.status === 400) {
          history.push("/404");
        }
      }
    };

    handleMount();
  }, [id, history]);

  if (!hasLoaded) {
    return (
      <Container className={appStyles.Content}>
        <Asset spinner />
      </Container>
    );
  }

  return (
    <Row className="h-100">
      <Col className="py-2 p-0 p-lg-2" lg={12}>
        <PopularProfiles mobile />
        <Recipe
          {...recipe.results[0]}
          setRecipes={setRecipe}
          setIngredients={setIngredients}
          ingredients={ingredients}
          recipePage
        />
        <PopularProfiles horizontal />
        <Container className={appStyles.Content}>
          {currentUser ? (
            <CommentCreateForm
              profile_id={currentUser.profile_id}
              profileImage={profile_image}
              recipe={id}
              setRecipe={setRecipe}
              setComments={setComments}
            />
          ) : comments.results.length ? (
            "Comments"
          ) : null}
          {comments.results.length ? (
            <InfiniteScroll
              dataLength={comments.results.length}
              loader={<Asset spinner />}
              hasMore={!!comments.next}
              next={() => fetchMoreData(comments, setComments)}
            >
              {comments.results.map((comment) => (
                <Comment
                  key={comment.id}
                  {...comment}
                  setRecipe={setRecipe}
                  setComments={setComments}
                />
              ))}
            </InfiniteScroll>
          ) : currentUser ? (
            <span>No comments, leave a comment</span>
          ) : (
            <span>No comments</span>
          )}
        </Container>
      </Col>
    </Row>
  );
}

export default RecipePage;

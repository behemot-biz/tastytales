import React, { useEffect, useState } from "react";
import { useParams } from "react-router";

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
import IngredientCreateForm from "./IngredientCreateForm";
import PopularProfiles from "../profiles/PopularProfiles";
import Recipe from "./Recipe";

import appStyles from "../../App.module.css";


function RecipePage() {
  const { id } = useParams();
  const [recipe, setRecipe] = useState({ results: [] });
  const [ingredients, setIngredients] = useState([]);

  const currentUser = useCurrentUser();
  const isOwner = currentUser?.username === recipe.results[0]?.owner;
  const profile_image = currentUser?.profile_image;
  const [comments, setComments] = useState({ results: [] });

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
      } catch (err) {
        // console.log(err);
      }
    };

    handleMount();
  }, [id]);

  return (
    <Row className="h-100">
      <Col className="py-2 p-0 p-lg-2" lg={8}>
        <PopularProfiles mobile />
        <Recipe
          {...recipe.results[0]}
          setRecipe={setRecipe}
          setIngredients={setIngredients}
          ingredients={ingredients}
          recipePage
        />
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
              children={comments.results.map((comment) => (
                <Comment
                  key={comment.id}
                  {...comment}
                  setRecipe={setRecipe}
                  setComments={setComments}
                />
              ))}
              dataLength={comments.results.length}
              loader={<Asset spinner />}
              hasMore={!!comments.next}
              next={() => fetchMoreData(comments, setComments)}
            />
          ) : currentUser ? (
            <span>No comments, leave a comment</span>
          ) : (
            <span>No comments</span>
          )}
        </Container>
      </Col>
      <Col lg={4} className="d-none d-lg-block p-0 p-lg-2">
        <PopularProfiles />
        {isOwner && (
          <IngredientCreateForm recipeId={id} setIngredients={setIngredients} />
        )}
      </Col>
    </Row>
  );
}

export default RecipePage;

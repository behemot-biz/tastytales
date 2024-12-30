import React, { useEffect, useState } from "react";

import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";

import appStyles from "../../App.module.css";
import { useParams } from "react-router";
import { axiosReq } from "../../api/axiosDefaults";
import Recipe from "./Recipe";

import CommentCreateForm from "../comments/CommentCreateForm";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import IngredientCreateForm from "./IngredientCreateForm";

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
        const [{ data: recipe }] = await Promise.all([
          axiosReq.get(`/recipes/${id}`),
        ]);
        setRecipe({ results: [recipe] });
        setIngredients(recipe.recipe_ingredients || []);
        // console.log('MY INGREDS: ', recipe.recipe_ingredients);
      } catch (err) {
        console.log(err);
      }
    };

    handleMount();
  }, [id]);

  return (
    <Row className="h-100">
      <Col className="py-2 p-0 p-lg-2" lg={8}>
        <p>Top Chefs for mobile</p>
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
        </Container>
      </Col>
      <Col lg={4} className="d-none d-lg-block p-0 p-lg-2">
        Top Chefs for desktop
        {isOwner && (
          <IngredientCreateForm recipeId={id} setIngredients={setIngredients} />
        )}

      </Col>
    </Row>
  );
}

export default RecipePage;
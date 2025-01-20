import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import InfiniteScroll from "react-infinite-scroll-component";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import { axiosReq } from "../../api/axiosDefaults";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import { useRedirect } from "../../hooks/useRedirect";
import { fetchMoreData } from "../../utils/utils";

import RecipeCard from "./RecipeCard";
import Asset from "../../components/Asset";

import NoResults from "../../assets/no-results.png";
import appStyles from "../../App.module.css";
import styles from "../../styles/RecipesPage.module.css";

const CookbookPage = ({ message }) => {
  useRedirect("loggedOut");
  const [recipes, setRecipes] = useState({ results: [] });
  const [hasLoaded, setHasLoaded] = useState(false);
  const { pathname } = useLocation();

  const currentUser = useCurrentUser();

  useEffect(() => {
    const fetchRecipes = async () => {
      if (!currentUser) return; // Ensure the user is logged in

      try {
        const { data } = await axiosReq.get(
          `/recipes/?owner__profile=${currentUser.profile_id}&status=pending_publish&status=pending_delete&status=published`
        );
        setRecipes(data);
        setHasLoaded(true);
      } catch (err) {
        console.log(err);
      }
    };

    setHasLoaded(false);
    fetchRecipes();
  }, [pathname, currentUser]); // Re-fetch when pathname or user changes

  return (
    <Row className="h-100">
      <Col className="py-2 p-0 p-lg-2" lg={8}>
        <Container className={styles.slask}>
          <h1>My Cookbook</h1>
        </Container>
        <div>
          {hasLoaded ? (
            <>
              {recipes.results.length ? (
                <InfiniteScroll
                  className={styles.CardsContainer}
                  {...recipes.results.map((recipe) => (
                    <RecipeCard
                      key={recipe.id}
                      {...recipe}
                      setRecipes={setRecipes}
                      cookbookPage
                    />
                  ))}
                  dataLength={recipes.results.length}
                  loader={<Asset spinner />}
                  hasMore={!!recipes.next}
                  next={() => fetchMoreData(recipes, setRecipes)}
                />
              ) : (
                <Container className={appStyles.Content}>
                  {/* <Asset message={message || "No recipes found."} /> */}
                  <Asset src={NoResults} message={message} />
                </Container>
              )}
            </>
          ) : (
            <Container className={appStyles.Content}>
              <Asset spinner />
            </Container>
          )}
        </div>
      </Col>
      <Col md={4} className="d-none d-lg-block p-0 p-lg-2">
        {/* Optional Sidebar or Additional Content */}
      </Col>
    </Row>
  );
};

export default CookbookPage;

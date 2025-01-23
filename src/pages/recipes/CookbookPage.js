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

/**
 * Displays a list of recipes created by the currently logged-in user.
 * The page supports infinite scrolling and handles recipes with different statuses,
 * including pending and published.
 *
 * Features:
 * - Fetches recipes owned by the logged-in user.
 * - Supports infinite scrolling for better user experience.
 * - Displays a loading spinner while fetching data.
 * - Shows a custom message or "No recipes found" when no data is available.
 *
 * Props:
 * - message (string): Custom message to display when no recipes are found.
 */

const CookbookPage = ({ message }) => {
  useRedirect("loggedOut");
  const [recipes, setRecipes] = useState({ results: [] });
  const [hasLoaded, setHasLoaded] = useState(false);
  const { pathname } = useLocation();

  const currentUser = useCurrentUser();

  useEffect(() => {
    const fetchRecipes = async () => {
      if (!currentUser) return;

      try {
        const { data } = await axiosReq.get(
          `/recipes/?owner__profile=${currentUser.profile_id}&status=pending_publish&&status=published`
        );
        setRecipes(data);
        setHasLoaded(true);
      } catch (err) {
        console.log(err);
      }
    };

    setHasLoaded(false);
    fetchRecipes();
  }, [pathname, currentUser]);

  return (
    <Row className="h-100">
      <Col className="py-2 p-0 p-lg-2" lg={12}>
        <div>
          {hasLoaded ? (
            <>
              {recipes.results.length ? (
                <InfiniteScroll
                  className={styles.CardsContainer}
                  dataLength={recipes.results.length}
                  loader={<Asset spinner />}
                  hasMore={!!recipes.next}
                  next={() => fetchMoreData(recipes, setRecipes)}
                >
                  {recipes.results.map((recipe) => (
                    <RecipeCard
                      key={recipe.id}
                      {...recipe}
                      setRecipes={setRecipes}
                      cookbookPage
                    />
                  ))}
                </InfiniteScroll>
              ) : (
                <Container className={appStyles.Content}>
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
    </Row>
  );
};

export default CookbookPage;

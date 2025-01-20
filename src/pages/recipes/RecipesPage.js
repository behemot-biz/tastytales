import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom/cjs/react-router-dom";

import InfiniteScroll from "react-infinite-scroll-component";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";

import { axiosReq } from "../../api/axiosDefaults";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import { fetchMoreData } from "../../utils/utils";

import Asset from "../../components/Asset";
import PopularProfiles from "../profiles/PopularProfiles";
import RecipeCard from "./RecipeCard";

import NoResults from "../../assets/no-results.png";
import appStyles from "../../App.module.css";
import styles from "../../styles/RecipesPage.module.css";

/**
 * Component to display a paginated list of recipes.
 * Includes a search bar and infinite scroll functionality for dynamically loading recipes.
 */

function RecipesPage({ message, filter = "" }) {
  const [recipes, setRecipes] = useState({ results: [] });
  const [hasLoaded, setHasLoaded] = useState(false);
  const { pathname } = useLocation();

  const [query, setQuery] = useState("");

  const currentUser = useCurrentUser();

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const { data } = await axiosReq.get(
          `/recipes/?${filter}search=${query}`
        );
        setRecipes(data);
        setHasLoaded(true);
      } catch (err) {
        // console.log(err);
      }
    };
    setHasLoaded(false);
    const timer = setTimeout(() => {
      fetchRecipes();
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, [filter, query, pathname, currentUser]);

  return (
    <Row className="h-100">
      <Col className="py-2 p-0 p-lg-2" lg={8}>
        <PopularProfiles mobile />

        <i className={`fas fa-search ${styles.SearchIcon}`} />
        <Form
          className={styles.SearchBar}
          onSubmit={(event) => event.preventDefault()}
        >
          <Form.Control
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            type="text"
            className="mr-sm-2"
            placeholder="Search recipes"
          />
        </Form>

        <div className={styles.CardsContainer}>
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
                      recipesPage
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
      <Col md={4} className="d-none d-lg-block p-0 p-lg-2">
        <PopularProfiles />
      </Col>
    </Row>
  );
}

export default RecipesPage;

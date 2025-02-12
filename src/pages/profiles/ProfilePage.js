import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { useHistory } from "react-router-dom";

import InfiniteScroll from "react-infinite-scroll-component";

import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Image from "react-bootstrap/Image";

import { useCurrentUser } from "../../contexts/CurrentUserContext";
import {
  useProfileData,
  useSetProfileData,
} from "../../contexts/ProfileDataContext";
import { axiosReq } from "../../api/axiosDefaults";
import { fetchMoreData } from "../../utils/utils";

import Asset from "../../components/Asset";
import NoResults from "../../assets/no-results.png";
import PopularProfiles from "./PopularProfiles";
import RecipeCard from "../recipes/RecipeCard";

import styles from "../../styles/ProfilePage.module.css";
import appStyles from "../../App.module.css";
import btnStyles from "../../styles/Button.module.css";

/**
 * Component to display a user's profile and their recipes.
 * Includes follow/unfollow functionality and a list of the user's
 * recipes with infinite scrolling.
 */

function ProfilePage() {
  const history = useHistory();
  const [hasLoaded, setHasLoaded] = useState(false);
  const [profileRecipes, setProfileRecipes] = useState({ results: [] });

  const currentUser = useCurrentUser();
  const { id } = useParams();

  const { setProfileData, handleFollow, handleUnfollow } = useSetProfileData();
  const { pageProfile } = useProfileData();

  const [profile] = pageProfile.results;
  const is_owner = currentUser?.username === profile?.owner;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [{ data: pageProfile }, { data: profileRecipes }] =
          await Promise.all([
            axiosReq.get(`/profiles/${id}/`),
            axiosReq.get(`/recipes/?owner__profile=${id}`),
          ]);
        setProfileData((prevState) => ({
          ...prevState,
          pageProfile: { results: [pageProfile] },
        }));
        setProfileRecipes(profileRecipes);
        setHasLoaded(true);
      } catch (err) {
        // console.log(err);
        if (err.response?.status === 404 || err.response?.status === 400) {
          history.push("/404");
        }
      }
    };
    fetchData();
  }, [id, setProfileData, history]);

  const mainProfile = (
    <>
      <Row noGutters className="px-3 text-center">
        <Col lg={3} className="text-lg-left">
          <Image
            className={styles.ProfileImage}
            roundedCircle
            src={profile?.image}
            alt={`${profile?.owner}'s avatar image`}
          />
        </Col>
        <Col lg={6}>
          <h3 className="m-2">{profile?.owner}</h3>
          <Row className="justify-content-center no-gutters">
            <Col xs={3} className="my-2">
              <div>{profile?.recipes_count}</div>
              <div>Recipes</div>
            </Col>
            <Col xs={3} className="my-2">
              <div>{profile?.followers_count}</div>
              <div>followers</div>
            </Col>
            <Col xs={3} className="my-2">
              <div>{profile?.following_count}</div>
              <div>following</div>
            </Col>
          </Row>
        </Col>
        <Col lg={3} className="text-lg-right">
          {currentUser &&
            !is_owner &&
            (profile?.following_id ? (
              <Button
                className={`${btnStyles.Button} ${btnStyles.BlackOutline}`}
                onClick={() => handleUnfollow(profile)}
              >
                unfollow
              </Button>
            ) : (
              <Button
                className={`${btnStyles.Button} ${btnStyles.Black}`}
                onClick={() => handleFollow(profile)}
              >
                follow
              </Button>
            ))}
        </Col>
        {profile?.content && <Col className="p-3">{profile.content}</Col>}
      </Row>
    </>
  );

  const mainProfileRecipes = (
    <>
      <hr />
      <p className="text-center">{profile?.owner}'s Recipes</p>
      <hr />

      {profileRecipes.results.length ? (
        <InfiniteScroll
          className={styles.CardsContainer}
          dataLength={profileRecipes.results.length}
          loader={<Asset spinner />}
          hasMore={!!profileRecipes.next}
          next={() => fetchMoreData(profileRecipes, setProfileRecipes)}
        >
          {profileRecipes.results.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              {...recipe}
              setRecipes={setProfileRecipes}
              recipesPage
            />
          ))}
        </InfiniteScroll>
      ) : (
        <Asset
          src={NoResults}
          message={`No results found, ${profile?.owner} hasn't created any recipes.`}
        />
      )}
    </>
  );

  return (
    <Row>
      <Col className="py-2 p-0 p-lg-2" lg={8}>
        <PopularProfiles mobile />
        <Container className={appStyles.Content}>
          {hasLoaded ? (
            <>
              {mainProfile}
              {mainProfileRecipes}
            </>
          ) : (
            <Asset spinner />
          )}
        </Container>
      </Col>
      <Col lg={4} className="d-none d-lg-block p-0 p-lg-2">
        <PopularProfiles />
      </Col>
    </Row>
  );
}

export default ProfilePage;

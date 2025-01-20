import React from "react";

import Container from "react-bootstrap/Container";
import appStyles from "../../App.module.css";

import { useProfileData } from "../../contexts/ProfileDataContext";

import Asset from "../../components/Asset";
import Profile from "./Profile";

/**
 * Component to display a list of popular profiles.
 *
 * Props:
 * - mobile (boolean): Determines if the component is displayed in a mobile-friendly layout.
 * - horizontal (boolean): Determines if the component is displayed in a horizontal layout.
 */

const PopularProfiles = ({ mobile = false, horizontal = false }) => {
  const { popularProfiles } = useProfileData();

  return (
    <Container
      className={`${appStyles.Content} ${
        mobile && "d-lg-none text-center mb-3"
      } ${horizontal && "d-none d-lg-block text-center mb-3"}`}
    >
      {popularProfiles.results.length ? (
        <>
          <h5 className="text-center">Top Chefs</h5>
          {mobile ? (
            // Mobile Layout (default on small screens)
            <div className="d-flex justify-content-around">
              {popularProfiles.results.slice(0, 4).map((profile) => (
                <Profile key={profile.id} profile={profile} mobile />
              ))}
            </div>
          ) : horizontal ? (
            // Horizontal Layout for large screens, similar to mobile but 5 profiles
            <div className="d-flex justify-content-around">
              {popularProfiles.results.slice(0, 5).map((profile) => (
                <Profile key={profile.id} profile={profile} mobile />
              ))}
            </div>
          ) : (
            // Default "as is" vertical layout
            popularProfiles.results.map((profile) => (
              <Profile key={profile.id} profile={profile} />
            ))
          )}
        </>
      ) : (
        <Asset spinner />
      )}
    </Container>
  );
};

export default PopularProfiles;

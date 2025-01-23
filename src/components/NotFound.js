import React from "react";
import NoResults from "../assets/no-results.png";
import styles from "../styles/NotFound.module.css";
import Asset from "./Asset";

/**
 * This component displays a user-friendly message and an image when a user navigates
 * to a page that does not exist (404 error).
 *
 * Features:
 * - Displays an illustration with a message indicating the page does not exist.
 * - Uses the `Asset` component to handle image rendering and messaging.
 */

const NotFound = () => {
  return (
    <div className={styles.NotFound}>
      <Asset
        src={NoResults}
        message={`Sorry, the page you're looking for doesn't exist`}
      />
    </div>
  );
};

export default NotFound;

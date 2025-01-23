import React from "react";
import Spinner from "react-bootstrap/Spinner";
import styles from "../styles/Asset.module.css";

/**
 * This reusable component is used to display assets such as a loading spinner,
 * an image, and/or a message. It provides a clean and centralized way to show
 * visual indicators or placeholders for loading states, empty data, or other content.
 *
 * Props:
 * - `spinner` (boolean): If true, displays a loading spinner.
 * - `src` (string): The source URL of the image to be displayed.
 * - `message` (string): A text message to be displayed below the spinner or image.
 */

const Asset = ({ spinner, src, message }) => {
  return (
    <div className={`${styles.Asset} p-4`}>
      {spinner && <Spinner animation="border" />}
      {src && <img src={src} alt={message} />}
      {message && <p className="mt-4">{message}</p>}
    </div>
  );
};

export default Asset;

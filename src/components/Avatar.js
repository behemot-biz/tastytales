import React from "react";
import styles from "../styles/Avatar.module.css";

/**
 * This component renders a circular avatar image with an optional accompanying text.
 * It is commonly used to display user profile images or similar visual elements in the UI.
 *
 * Props:
 * - `src` (string): The source URL of the avatar image. This is required for displaying the avatar.
 * - `height` (number, optional): The height and width (in pixels) of the avatar. Defaults to 45px.
 * - `text` (string, optional): Optional text to be displayed next to the avatar.
 */

const Avatar = ({ src, height = 45, text }) => {
  return (
    <span>
      <img
        className={styles.Avatar}
        src={src}
        height={height}
        width={height}
        alt="avatar"
      />
      {text}
    </span>
  );
};

export default Avatar;

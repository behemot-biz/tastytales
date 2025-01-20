import React from "react";

import styles from "../../styles/Ingredient.module.css";

/**
 * Component to display ingredients for a recipe.
 * Provides an editable view for owners, enabling updates to ingredient details or removal.
 *
 * Props:
 * - ingredient (object): Ingredient data including name, quantity, and measure.
 */

const Ingredient = ({ ingredient }) => {
  return (
    <li className={styles.IngredientList}>
      <div>
        <span>{`${ingredient.quantity} ${ingredient.measure} ${ingredient.ingredient}`}</span>
      </div>
    </li>
  );
};

export default Ingredient;

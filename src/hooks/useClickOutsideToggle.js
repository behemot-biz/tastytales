import { useEffect, useRef, useState } from "react";

/**
 * A custom React hook to manage the toggle state of an element, such as a dropdown menu,
 * and close it when a user clicks outside of it.
 *
 * Features:
 * - Tracks the toggle state (`expanded`) of an element.
 * - Provides a function (`setExpanded`) to update the toggle state manually.
 * - Detects clicks outside a referenced element and automatically closes the element if open.
 */

const useClickOutsideToggle = () => {
  const [expanded, setExpanded] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      const dropdownToggle = event.target.closest(".dropdown-toggle");
      const dropdownMenu = event.target.closest(".dropdown-menu");

      // Ignore clicks on dropdown toggles or dropdown menus
      if (dropdownToggle || dropdownMenu) {
        return;
      }

      if (ref.current && !ref.current.contains(event.target)) {
        setExpanded(false);
      }
    };

    document.addEventListener("mouseup", handleClickOutside);
    return () => {
      document.removeEventListener("mouseup", handleClickOutside);
    };
  }, [ref]);

  return { expanded, setExpanded, ref };
};

export default useClickOutsideToggle;

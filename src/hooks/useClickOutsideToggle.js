import { useEffect, useRef, useState } from "react";

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

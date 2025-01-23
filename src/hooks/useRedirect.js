import axios from "axios";
import { useEffect } from "react";
import { useHistory } from "react-router";

/**
 * A custom React hook to handle user redirection based on their authentication status.
 * This hook ensures that users are redirected appropriately depending on whether they are logged in or logged out.
 *
 * Features:
 * - Sends a token refresh request to verify the user's authentication status.
 * - Redirects logged-in users to the homepage if required.
 * - Redirects logged-out users to the homepage if required.
 */

export const useRedirect = (userAuthStatus) => {
  const history = useHistory();

  useEffect(() => {
    const handleMount = async () => {
      try {
        await axios.post("/dj-rest-auth/token/refresh/");
        // if user is logged in, the code below will run
        if (userAuthStatus === "loggedIn") {
          history.push("/");
        }
      } catch (err) {
        // if user is not logged in, the code below will run
        if (userAuthStatus === "loggedOut") {
          history.push("/");
        }
      }
    };

    handleMount();
  }, [history, userAuthStatus]);
};

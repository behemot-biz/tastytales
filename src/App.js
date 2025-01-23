import { Route, Switch } from "react-router-dom";

import Container from "react-bootstrap/Container";
import NavBar from "./components/NavBar";

import { useCurrentUser } from "./contexts/CurrentUserContext";
import "./api/axiosDefaults";

import SignUpForm from "./pages/auth/SignUpForm";
import SignInForm from "./pages/auth/SignInForm";
import RecipeCreateForm from "./pages/recipes/RecipeCreateForm";

import RecipePage from "./pages/recipes/RecipePage";
import RecipesPage from "./pages/recipes/RecipesPage";
import RecipeEditForm from "./pages/recipes/RecipeEditForm";
import ProfilePage from "./pages/profiles/ProfilePage";
import UsernameForm from "./pages/profiles/UsernameForm";
import UserPasswordForm from "./pages/profiles/UserPasswordForm";
import ProfileEditForm from "./pages/profiles/ProfileEditForm";
import CookbookPage from "./pages/recipes/CookbookPage";
import IngredientCreateForm from "./pages/recipes/IngredientCreateForm";
import NotFound from "./components/NotFound";

import styles from "./App.module.css";
/**
 * * Main application component that defines the structure, navigation, and routing of the app.
 * Includes various pages and components for managing user authentication, recipes, profiles, and more.
 *
 * Features:
 * - Navigation bar displayed across all pages.
 * - Routes for public and private content, including user authentication, recipe management, and profile settings.
 * - Dynamic routing based on the current user's profile and preferences.
 * - Error handling via a custom 404 Not Found page.
 */

function App() {
  const currentUser = useCurrentUser();
  const profile_id = currentUser?.profile_id || "";

  return (
    <div className={styles.App}>
      <NavBar />
      <Container className={styles.Main}>
        <Switch>
          <Route
            exact
            path="/"
            render={() => (
              <RecipesPage message="No results found. Adjust the search keyword." />
            )}
          />
          <Route
            exact
            path="/feed"
            render={() => (
              <RecipesPage
                message="No results found. Adjust the search keyword or follow a user."
                filter={`owner__followed__owner__profile=${profile_id}&`}
              />
            )}
          />
          <Route
            exact
            path="/liked"
            render={() => (
              <RecipesPage
                message="No results found. Adjust the search keyword or like a recipe."
                filter={`likes__owner__profile=${profile_id}&ordering=-likes__created_at&`}
              />
            )}
          />
          <Route exact path="/signin" render={() => <SignInForm />} />
          <Route exact path="/signup" render={() => <SignUpForm />} />
          <Route
            exact
            path="/recipes/create"
            render={() => <RecipeCreateForm />}
          />
          <Route
            exact
            path="/ingredients/create/:recipeId"
            render={() => <IngredientCreateForm />}
          />
          <Route
            exact
            path="/cookbook"
            render={() => (
              <CookbookPage
                message="No results found. Create a recipe."
                filter={`owner__profile=${profile_id}&status=pending_publish&status=published`}
              />
            )}
          />
          <Route exact path="/recipes/:id" render={() => <RecipePage />} />
          <Route
            exact
            path="/recipes/:id/edit"
            render={() => <RecipeEditForm />}
          />
          <Route exact path="/profiles/:id" render={() => <ProfilePage />} />
          <Route
            exact
            path="/profiles/:id/edit/username"
            render={() => <UsernameForm />}
          />
          <Route
            exact
            path="/profiles/:id/edit/password"
            render={() => <UserPasswordForm />}
          />
          <Route
            exact
            path="/profiles/:id/edit"
            render={() => <ProfileEditForm />}
          />
          <Route exact path="/404" render={() => <NotFound />} />

          <Route render={() => <NotFound />} />
        </Switch>
      </Container>
    </div>
  );
}

export default App;

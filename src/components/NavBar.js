import React from "react";
import { useHistory } from "react-router-dom";
import { NavLink } from "react-router-dom/cjs/react-router-dom";

import axios from "axios";

import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";

import {
  useCurrentUser,
  useSetCurrentUser,
} from "../contexts/CurrentUserContext";

import { removeTokenTimestamp } from "../utils/utils";

import Avatar from "./Avatar";
import logo from "../assets/tt-logo-small.webp";
import useClickOutsideToggle from "../hooks/useClickOutsideToggle";

import styles from "../styles/NavBar.module.css";

/**
 * A responsive navigation bar for the TastyTales application.
 * Displays links to various pages and adjusts based on the user's authentication state.
 *
 * Features:
 * - Displays different navigation menus for logged-in and logged-out users.
 * - Integrates with React Router for navigation.
 * - Allows users to sign out and redirects to the homepage upon logout.
 * - Includes a dropdown menu for profile-related actions when the user is logged in.
 * - Toggles the navigation menu on smaller screens using React-Bootstrap's Navbar.
 */

const NavBar = () => {
  const currentUser = useCurrentUser();
  const setCurrentUser = useSetCurrentUser();

  const history = useHistory();
  const { expanded, setExpanded, ref } = useClickOutsideToggle();

  const handleSignOut = async () => {
    try {
      await axios.post("/dj-rest-auth/logout/");
      setCurrentUser(null);
      removeTokenTimestamp();
      history.push("/");
    } catch (err) {}
  };

  const loggedInMenu = (
    <>
      <NavLink
        className={`${styles.NavLink} ${styles.HeadSpace}`}
        activeClassName={styles.Active}
        to="/recipes/create"
      >
        Add recipe
      </NavLink>
      <NavLink
        className={`${styles.NavLink} ${styles.HeadSpace}`}
        activeClassName={styles.Active}
        to="/cookbook"
      >
        My Cookbook
      </NavLink>
      <NavLink
        className={`${styles.NavLink} ${styles.HeadSpace}`}
        activeClassName={styles.Active}
        to="/feed"
      >
        Recipes
      </NavLink>
      <NavLink
        className={`${styles.NavLink} ${styles.HeadSpace}`}
        activeClassName={styles.Active}
        to="/liked"
      >
        Liked
      </NavLink>

      <NavDropdown
        bsPrefix={styles.CustomDropdown}
        className={styles.NavLink}
        id="nav-dropdown"
        title={
          <Avatar
            src={currentUser?.profile_image}
            text={currentUser?.username}
            height={40}
          />
        }
      >
        <NavDropdown.Item
          bsPrefix={styles.CustomDropdownItem}
          as={NavLink}
          to={`/profiles/${currentUser?.profile_id}`}
          exact
        >
          Profile page
        </NavDropdown.Item>
        <NavDropdown.Divider />
        <NavDropdown.Item
          bsPrefix={styles.CustomDropdownItem}
          as={NavLink}
          to={`/profiles/${currentUser?.profile_id}/edit`}
          exact
        >
          Edit profile
        </NavDropdown.Item>
        <NavDropdown.Item
          bsPrefix={styles.CustomDropdownItem}
          as={NavLink}
          to={`/profiles/${currentUser?.profile_id}/edit/username`}
          exact
        >
          Change username
        </NavDropdown.Item>
        <NavDropdown.Item
          bsPrefix={styles.CustomDropdownItem}
          as={NavLink}
          to={`/profiles/${currentUser?.profile_id}/edit/password`}
          exact
        >
          Change password
        </NavDropdown.Item>

        <NavDropdown.Divider />
        <NavDropdown.Item
          bsPrefix={styles.CustomDropdownItem}
          to="/"
          onClick={handleSignOut}
        >
          Sign out
        </NavDropdown.Item>
      </NavDropdown>
    </>
  );
  const loggedOutMenu = (
    <>
      <NavLink
        className={`${styles.NavLink} ${styles.HeadSpace}`}
        activeClassName={styles.Active}
        to="/signup"
      >
        Sign up
      </NavLink>

      <NavLink
        className={`${styles.NavLink} ${styles.HeadSpace}`}
        activeClassName={styles.Active}
        to="/signin"
      >
        Sign in
      </NavLink>
    </>
  );
  return (
    <Navbar
      expanded={expanded}
      className={styles.NavBar}
      expand="lg"
      fixed="top"
    >
      <Container>
        <NavLink to="/">
          <img src={logo} alt="logo" height="45" className="mr-2" />
          <Navbar.Brand>TastyTales</Navbar.Brand>
        </NavLink>
        <Navbar.Toggle
          ref={ref}
          onClick={() => setExpanded(!expanded)}
          aria-controls="basic-navbar-nav"
        />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ml-auto text-left">
            <NavLink
              exact
              className={`${styles.NavLink} ${styles.HeadSpace}`}
              activeClassName={styles.Active}
              to="/"
            >
              Home
            </NavLink>
            {currentUser ? loggedInMenu : loggedOutMenu}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;

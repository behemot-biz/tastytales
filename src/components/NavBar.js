import React from "react";
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
import useClickOutsideToggle from "../hooks/useClickOutsideToggle";

import styles from "../styles/NavBar.module.css";

const NavBar = () => {
  const currentUser = useCurrentUser();
  const setCurrentUser = useSetCurrentUser();
  const { expanded, setExpanded, ref } = useClickOutsideToggle();

  const handleSignOut = async () => {
    try {
      await axios.post("/dj-rest-auth/logout/");
      setCurrentUser(null);
      removeTokenTimestamp();
    } catch (err) {}
  };

  const addRecipeMenu = (
    <NavLink
      className={styles.NavLink}
      activeClassName={styles.Active}
      to="/recipes/create"
    >
      Add recipe
    </NavLink>
  );

  const loggedInMenu = (
    <>
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
        className={styles.NavLink}
        activeClassName={styles.Active}
        to="/signin"
      >
        Sign in
      </NavLink>
      <NavLink
        className={styles.NavLink}
        activeClassName={styles.Active}
        to="/signup"
      >
        Sign up
      </NavLink>
    </>
  );
  return (
    <Navbar
      expanded={expanded}
      className={styles.NavBar}
      expand="md"
      fixed="top"
    >
      <Container>
        <NavLink to="/">
          <Navbar.Brand>TastyTales</Navbar.Brand>
        </NavLink>
        {currentUser && addRecipeMenu}
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

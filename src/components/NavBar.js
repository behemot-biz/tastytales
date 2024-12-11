import React, { useContext } from 'react'
import { Navbar, Container, Nav } from 'react-bootstrap';
import styles from '../styles/NavBar.module.css';
import { NavLink } from 'react-router-dom/cjs/react-router-dom';
import { CurrentUserContext } from '../App';

const NavBar = () => {
    const currentUser = useContext(CurrentUserContext)
    const loggedInIcons = <>{currentUser?.username}</>;
    const loggedOutIcons = (
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
    <Navbar className={styles.NavBar} expand="md" fixed="top">
      <Container>
        <NavLink to="/">
          <Navbar.Brand>TastyTales</Navbar.Brand>
        </NavLink>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ml-auto text-left">
            <NavLink
              exact
              className={styles.NavLink}
              activeClassName={styles.Active}
              to="/"
            >
              Home
            </NavLink>
            {currentUser ? loggedInIcons : loggedOutIcons}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavBar
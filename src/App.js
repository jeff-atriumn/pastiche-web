import React, { useState, useEffect } from "react";
// import Navbar from "react-bootstrap/Navbar";
import { Link } from "react-router-dom";
import { Auth } from "aws-amplify";
// import Nav from "react-bootstrap/Nav";
import Footer from "./components/Footers/Footer.js";

import { useHistory } from "react-router-dom";

import {
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  NavbarBrand,
  Navbar,
  Nav,
  Container,
} from "reactstrap";

import "./App.css";
import Routes from "./Routes";
import { AppContext } from "./libs/contextLib";
import { onError } from "./libs/errorLib";

function App() {
  const [isAuthenticated, userHasAuthenticated] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(true);
  const [navbarColor, setNavbarColor] = React.useState(" navbar-transparent");
  const [collapseOpen, setCollapseOpen] = React.useState(false);
  const history = useHistory();

  useEffect(() => {
    onLoad();
    const updateNavbarColor = () => {
      if (
        document.documentElement.scrollTop > 499 ||
        document.body.scrollTop > 499
      ) {
        setNavbarColor("");
      } else if (
        document.documentElement.scrollTop < 500 ||
        document.body.scrollTop < 500
      ) {
        setNavbarColor(" navbar-transparent");
      }
    };
    window.addEventListener("scroll", updateNavbarColor);
    return function cleanup() {
      window.removeEventListener("scroll", updateNavbarColor);
    };
  }, []);

  async function onLoad() {
    try {
      await Auth.currentSession();
      userHasAuthenticated(true);
    } catch (e) {
      if (e !== "No current user") {
        onError(e);
      }
    }

    setIsAuthenticating(false);
  }

  async function handleLogout() {
    await Auth.signOut();

    userHasAuthenticated(false);

    history.push("/login");
  }

  return (
    !isAuthenticating && (
      <div className="page-header header-filter" filter-color="blue">
        <div
          className="page-header-image"
          style={{
            backgroundImage:
              "url(" + require("./assets/img/login.jpg").default + ")",
          }}
        ></div>
        <div className="App container py-3">
          <Navbar
            className={"fixed-top" + navbarColor}
            color="white"
            expand="lg"
          >
            <Container>
              <UncontrolledDropdown className="button-dropdown">
                <DropdownToggle
                  caret
                  tag="a"
                  data-toggle="dropdown"
                  href="#pablo"
                  id="navbarDropdown"
                  onClick={(e) => e.preventDefault()}
                >
                  <span className="button-bar"></span>
                  <span className="button-bar"></span>
                  <span className="button-bar"></span>
                </DropdownToggle>
                <DropdownMenu aria-labelledby="navbarDropdown">
                  <DropdownItem header>Atriumn</DropdownItem>
                  <DropdownItem
                    href="#pablo"
                    onClick={(e) => e.preventDefault()}
                  >
                    Featured Snapshots
                  </DropdownItem>
                  <DropdownItem
                    href="#pablo"
                    onClick={(e) => e.preventDefault()}
                  >
                    All Snapshots
                  </DropdownItem>
                  <DropdownItem divider></DropdownItem>
                  <DropdownItem
                    href="#pablo"
                    onClick={(e) => e.preventDefault()}
                  >
                    My Snapshots
                  </DropdownItem>
                  <DropdownItem
                    href="#pablo"
                    onClick={(e) => e.preventDefault()}
                  >
                    My Profile
                  </DropdownItem>
                  <DropdownItem divider></DropdownItem>
                  <DropdownItem
                    href="#pablo"
                    onClick={(e) => e.preventDefault()}
                  >
                    Settings
                  </DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>
              <div className="navbar-translate">
                <NavbarBrand to="/" tag={Link} id="navbar-brand">
                  Atriumn
                </NavbarBrand>
                <button
                  onClick={() => {
                    document.documentElement.classList.toggle("nav-open");
                    setCollapseOpen(!collapseOpen);
                  }}
                  aria-expanded={collapseOpen}
                  className="navbar-toggler"
                >
                  <span className="navbar-toggler-bar top-bar"></span>
                  <span className="navbar-toggler-bar middle-bar"></span>
                  <span className="navbar-toggler-bar bottom-bar"></span>
                </button>
              </div>
              <Nav>
                {isAuthenticated ? (
                  <>
                    <div className="navbar-translate">
                      <Link onClick={handleLogout}>Logout</Link>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="navbar-translate">
                      <Link to="/signup">Sign Up</Link>
                      <Link to="/login">Login</Link>
                    </div>
                  </>
                )}
              </Nav>
            </Container>
          </Navbar>
          <AppContext.Provider
            value={{ isAuthenticated, userHasAuthenticated }}
          >
            <Routes />
          </AppContext.Provider>
        </div>
        <Footer />
      </div>
    )
  );
}

export default App;

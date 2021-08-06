/*eslint-disable*/
import React from "react";

// reactstrap components
import { Container } from "reactstrap";

// core components

function Footer() {
  return (
    <>
      <footer className="footer">
        <Container>
          <nav>
            <ul>
              <li>
                <a href="https://pastiche.world" target="_blank">
                  Pastiche
                </a>
              </li>
              <li>
                <a href="https://pastiche.world/about-us" target="_blank">
                  About Us
                </a>
              </li>
            </ul>
          </nav>
          <div className="copyright" id="copyright">
            © {new Date().getFullYear()}
          </div>
        </Container>
      </footer>
    </>
  );
}

export default Footer;

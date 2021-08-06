import React, { useState, useEffect } from "react";
import ListGroup from "react-bootstrap/ListGroup";
import { BsPencilSquare } from "react-icons/bs";
import { LinkContainer } from "react-router-bootstrap";

import { API } from "aws-amplify";
import { useAppContext } from "../libs/contextLib";
import { onError } from "../libs/errorLib";
import "./Home.css";

export default function Home() {
  const [portraits, setPortraits] = useState([]);
  const { isAuthenticated } = useAppContext();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function onLoad() {
      if (!isAuthenticated) {
        return;
      }

      try {
        const portraits = await loadPortraits();
        setPortraits(portraits);
      } catch (e) {
        onError(e);
      }

      setIsLoading(false);
    }

    onLoad();
  }, [isAuthenticated]);

  function loadPortraits() {
    return API.get("portraits", "/portraits");
  }

  function renderPortraitsList(portraits) {
    return (
      <>
        <LinkContainer to="/portraits/new">
          <ListGroup.Item action className="py-3 text-nowrap text-truncate">
            <BsPencilSquare size={17} />
            <span className="ml-2 font-weight-bold">Create a new portrait</span>
          </ListGroup.Item>
        </LinkContainer>
        {portraits.map(({ portrait, portraitId, createdAt }) => (
          <LinkContainer key={portraitId} to={`/portraits/${portraitId}`}>
            <ListGroup.Item action>
              <span className="text-muted">Portrait Name: {portrait}</span>
              <span className="font-weight-bold">{portraitId}</span>
              <br />
              <span className="text-muted">
                Created: {new Date(createdAt).toLocaleString()}
              </span>
            </ListGroup.Item>
          </LinkContainer>
        ))}
      </>
    );
  }

  function renderLander() {
    return (
      <div className="lander">
        <h1>Pastiche</h1>
        <p>A simple note taking app</p>
      </div>
    );
  }

  function renderPortraits() {
    return (
      <div className="portraits">
        <h2 className="pb-3 mt-4 mb-3 border-bottom">Your Portraits</h2>
        <ListGroup>{!isLoading && renderPortraitsList(portraits)}</ListGroup>
      </div>
    );
  }

  return (
    <div className="Home">
      {isAuthenticated ? renderPortraits() : renderLander()}
    </div>
  );
}

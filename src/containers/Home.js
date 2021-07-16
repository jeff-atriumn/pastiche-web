import React, { useState, useEffect } from "react";
import ListGroup from "react-bootstrap/ListGroup";
import { BsPencilSquare } from "react-icons/bs";
import { LinkContainer } from "react-router-bootstrap";

import { API } from "aws-amplify";
import { useAppContext } from "../libs/contextLib";
import { onError } from "../libs/errorLib";
import "./Home.css";

export default function Home() {
  const [notes, setImages] = useState([]);
  const { isAuthenticated } = useAppContext();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function onLoad() {
      if (!isAuthenticated) {
        return;
      }

      try {
        const images = await loadImages();
        setImages(images);
      } catch (e) {
        onError(e);
      }

      setIsLoading(false);
    }

    onLoad();
  }, [isAuthenticated]);

  function loadImages() {
    return API.get("images", "/images");
  }

  function renderImagesList(images) {
    return (
      <>
        <LinkContainer to="/images/new">
          <ListGroup.Item action className="py-3 text-nowrap text-truncate">
            <BsPencilSquare size={17} />
            <span className="ml-2 font-weight-bold">Create a new image</span>
          </ListGroup.Item>
        </LinkContainer>
        {images.map(({ image, imageId, createdAt }) => (
          <LinkContainer key={imageId} to={`/images/${imageId}`}>
            <ListGroup.Item action>
              <span className="text-muted">Image Name: {image}</span>
              <span className="font-weight-bold">{imageId}</span>
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
        <h1>Scratch</h1>
        <p className="text-muted">A simple note taking app</p>
      </div>
    );
  }

  function renderImages() {
    return (
      <div className="notes">
        <h2 className="pb-3 mt-4 mb-3 border-bottom">Your Notes</h2>
        <ListGroup>{!isLoading && renderImagesList(notes)}</ListGroup>
      </div>
    );
  }

  return (
    <div className="Home">
      {isAuthenticated ? renderImages() : renderLander()}
    </div>
  );
}

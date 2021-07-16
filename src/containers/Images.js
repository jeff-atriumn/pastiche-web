import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import { API, Storage } from "aws-amplify";
import { onError } from "../libs/errorLib";
import Form from "react-bootstrap/Form";
import LoaderButton from "../components/LoaderButton";
// import config from "../config";
// import { s3Upload } from "../libs/awsLib";
import "./Images.css";

export default function Images() {
  //   const file = useRef(null);
  const { id } = useParams();
  const history = useHistory();
  const [image, setImage] = useState(null);
  //   const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    function loadImage() {
      return API.get("images", `/images/${id}`);
    }

    async function onLoad() {
      try {
        const img = await loadImage();
        const { image } = img;

        if (image) {
          img.imageURL = await Storage.vault.get(image);
        }

        console.log(img);
        setImage(img);
      } catch (e) {
        onError(e);
      }
    }

    onLoad();
  }, [id]);

  function formatFilename(str) {
    return str.replace(/^\w+-/, "");
  }

  function deleteImage() {
    return API.del("images", `/images/${id}`);
  }

  async function handleDelete(event) {
    event.preventDefault();

    const confirmed = window.confirm(
      "Are you sure you want to delete this image?"
    );

    if (!confirmed) {
      return;
    }

    setIsDeleting(true);

    try {
      await deleteImage();
      history.push("/");
    } catch (e) {
      onError(e);
      setIsDeleting(false);
    }
  }

  return (
    <div className="Images">
      {image && (
        <Form>
          <Form.Group>
            <Form.Label>Image</Form.Label>
            {image.image && (
              <p>
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href={image.imageURL}
                >
                  {formatFilename(image.image)}
                </a>
              </p>
            )}
          </Form.Group>
          <LoaderButton
            block
            size="lg"
            variant="danger"
            onClick={handleDelete}
            isLoading={isDeleting}
          >
            Delete
          </LoaderButton>
        </Form>
      )}
    </div>
  );
}

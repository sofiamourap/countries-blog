import React from "react";

const Images = ({ image, handleImageRemove = (f) => f }) => (
  <img
    src={image.url}
    key={image.public_id}
    alt={image.public_id}
    style={{ height: "100px" }}
    className="float-right"
    onClick={() => handleImageRemove(image.public_id)}
  />
);

export default Images;

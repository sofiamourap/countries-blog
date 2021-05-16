import React from "react";
import Images from "./Images";
import { Link } from "react-router-dom";

export default function UserCard({ user }) {
  const { username, images, about } = user;
  return (
    <div className="card text-center" style={{ minHeight: "375px" }}>
      <div className="card-body">
        <Images image={images[0]} />
        <Link to={`/user/${username}`}>
          <h4 className="text-primary">@{username}</h4>
        </Link>

        <hr />
        <small>{about}</small>
      </div>
    </div>
  );
}

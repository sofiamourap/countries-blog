import React from "react";
import Images from "./Images";
import { Link, useHistory } from "react-router-dom";

const PostCard = ({
  post,
  handleDelete = (f) => f,
  showUpdateButton = false,
  showDeleteButton = false,
}) => {
  const history = useHistory();
  const { image, content, postedBy, country } = post;
  return (
    <div className="card text-center" style={{ minHeight: "375px" }}>
      <div className="card-body">
        <Link to={`/post/${post._id}`}>
          <Images image={image} />
        </Link>
        <h4 className="text-primary">{country}</h4>
        <p className="text-primary">@{post.postedBy.username}</p>
        <hr />
        <small>{content}</small>
        <br />
        <br />
        {showDeleteButton && (
          <button
            onClick={() => handleDelete(post._id)}
            className="btn m-2 btn-danger"
          >
            Delete
          </button>
        )}
        {showUpdateButton && (
          <button
            onClick={() => history.push(`/post/update/${post._id}`)}
            className="btn m-2 btn-warning"
          >
            Update
          </button>
        )}
      </div>
    </div>
  );
};

export default PostCard;

import React, { useState, useContext, useEffect, Fragment } from "react";
import { toast, toats } from "react-toastify";
import { AuthContext } from "../../context/authContext";
import { useQuery, useMutation } from "@apollo/react-hooks";
import omitDeep from "omit-deep";
import FileUpload from "../../components/FileUpload";
import { POST_CREATE } from "../../graphql/mutations";
import { POST_BY_USER } from "../../graphql/queries";
import PostCard from "../../components/PostCard";

const initialState = {
  content: "",
  image: {
    url: "https://via.placeholder.com/200x200.png?text=Post",
    public_id: "123",
  },
};

export default function Post() {
  const [values, setValues] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const { content, image } = values;

  //query
  const { data: posts } = useQuery(POST_BY_USER);

  //mutation
  const [postCreate] = useMutation(POST_CREATE, {
    //read query from cache/ write query from cache with method provided by useMutation hook
    update: (cache, { data: { postCreate } }) => {
      //read Query from cache
      const { postByUser } = cache.readQuery({
        query: POST_BY_USER,
      });
      //write Query to cache
      cache.writeQuery({
        query: POST_BY_USER,
        data: {
          postByUser: [postCreate, ...postByUser],
        },
      });
    },
    onError: (err) => console.log(err),
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    postCreate({ variables: { input: values } });
    setValues(initialState);
    setLoading(false);
    toast.success("Post created");
  };

  const handleChange = (e) => {
    e.preventDefault();
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const createForm = () => {
    return (
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <textarea
            value={content}
            onChange={handleChange}
            name="content"
            rows="10"
            className="md-textarea form-control"
            placeholder="Write something cool"
            maxLength="500"
            disabled={loading}
          ></textarea>
        </div>

        <button
          className="btn btn-primary"
          type="submit"
          disabled={loading || !content}
        >
          Post
        </button>
      </form>
    );
  };

  return (
    <div className="container p-5">
      {loading ? (
        <h4 className="text-danger">Loading...</h4>
      ) : (
        <h4>New Post</h4>
      )}

      <FileUpload
        setValues={setValues}
        values={values}
        loading={loading}
        setLoading={setLoading}
        singleUpload={true}
      />

      <div className="row">
        <div className="col">{createForm()}</div>
      </div>

      <hr />
      <div className="row p-5">
        {posts &&
          posts.postByUser.map((post) => (
            <div className="col-md-6 pt-5" key={post._id}>
              <PostCard
                post={post}
                showUpdateButton={true}
                showDeleteButton={true}
              />
            </div>
          ))}
      </div>
    </div>
  );
}

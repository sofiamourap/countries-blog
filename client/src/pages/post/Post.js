import React, { useState } from "react";
import { toast } from "react-toastify";
import { useQuery, useMutation } from "@apollo/react-hooks";
import FileUpload from "../../components/FileUpload";
import { POST_CREATE, POST_DELETE } from "../../graphql/mutations";
import { POST_BY_USER } from "../../graphql/queries";
import PostCard from "../../components/PostCard";
import PostForm from "../../components/forms/PostForm";

const initialState = {
  content: "",
  image: {
    url: "https://via.placeholder.com/200x200.png?text=Post",
    public_id: "123",
  },
  country: "",
};

export default function Post() {
  const [values, setValues] = useState(initialState);

  const [loading, setLoading] = useState(false);

  //query
  const { data: posts } = useQuery(POST_BY_USER);

  //mutation
  const [postCreate] = useMutation(POST_CREATE, {
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

  const [postDelete] = useMutation(POST_DELETE, {
    update: ({ data }) => {
      console.log("POST DELETE MUTSTION", data);
      toast.error("Post deleted");
    },
    onError: (err) => {
      console.log(err);
      toast.error("Post delete failed");
    },
  });

  const handleDelete = async (postId) => {
    let answer = window.confirm("Delete this post?");
    if (answer) {
      setLoading(true);
      postDelete({
        variables: { postId },
        refetchQueries: [{ query: POST_BY_USER }], //provided by Apollo react
      });
      setLoading(false);
    }
  };

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
        <PostForm
          handleSubmit={handleSubmit}
          values={values}
          handleChange={handleChange}
          loading={loading}
        />
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
                handleDelete={handleDelete}
                country={post.country}
              />
            </div>
          ))}
      </div>
    </div>
  );
}

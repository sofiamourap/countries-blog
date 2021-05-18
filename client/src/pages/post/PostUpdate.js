import React, { useState, useMemo, useEffect } from "react";
import { toast } from "react-toastify";
import { useLazyQuery, useMutation } from "@apollo/react-hooks";
import { SINGLE_POST } from "../../graphql/queries";
import { POST_UPDATE } from "../../graphql/mutations";
import omitDeep from "omit-deep";
import { useParams } from "react-router-dom";
import FileUpload from "../../components/FileUpload";
import PostForm from "../../components/forms/PostForm";

export default function PostUpdate() {
  const [values, setValues] = useState({
    content: "",
    image: {
      url: "",
      public_id: "",
    },
    country: "",
  });

  const [getSinglePost, { data: singlePost }] = useLazyQuery(SINGLE_POST);
  const [postUpdate] = useMutation(POST_UPDATE);
  const [loading, setLoading] = useState(false);
  const { postid } = useParams();
  const { content, image } = values;

  useMemo(() => {
    if (singlePost) {
      console.log("SINGLE POST", singlePost.singlePost.content);
      setValues({
        ...values,
        _id: singlePost.singlePost._id,
        content: singlePost.singlePost.content,
        image: omitDeep(singlePost.singlePost.image, ["__typename"]),
      });
    }
  }, [singlePost]);

  useEffect(() => {
    getSinglePost({ variables: { postId: postid } });
  }, []);

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    postUpdate({ variables: { input: values } });
    setLoading(false);
    toast.success("Post updated");
  };

  return (
    <div className="container p-5">
      {loading ? (
        <h4 className="text-danger">Loading...</h4>
      ) : (
        <h4>Update Post</h4>
      )}
      <FileUpload
        setValues={setValues}
        values={values}
        loading={loading}
        setLoading={setLoading}
        singleUpload={true}
      />
      <PostForm
        handleSubmit={handleSubmit}
        values={values}
        handleChange={handleChange}
        loading={loading}
      />
    </div>
  );
}

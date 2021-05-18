import React, { useState, useMemo, useEffect } from "react";
import { useLazyQuery } from "@apollo/react-hooks";
import { SINGLE_POST } from "../../graphql/queries";
import { useParams } from "react-router-dom";
import PostCard from "../../components/PostCard";

export default function SinglePost() {
  const [values, setValues] = useState({
    content: "",
    image: {
      url: "",
      public_id: "",
    },
    postedBy: {},
  });

  const [getSinglePost, { data: singlePost }] = useLazyQuery(SINGLE_POST);

  const { postid } = useParams();
  const { content, image } = values;

  useMemo(() => {
    if (singlePost) {
      console.log("SINGLE POST", singlePost.singlePost.content);
      setValues({
        ...values,
        _id: singlePost.singlePost._id,
        content: singlePost.singlePost.content,
        image: singlePost.singlePost.image,
        postedBy: singlePost.singlePost.postedBy,
      });
    }
  }, [singlePost]);

  useEffect(() => {
    getSinglePost({ variables: { postId: postid } });
  }, []);

  return (
    <div className="container p-5">
      <PostCard post={values} />
    </div>
  );
}

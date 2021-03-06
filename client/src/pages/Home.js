import React, { useState, useContext } from "react";
import { useQuery, useLazyQuery, useSubscription } from "@apollo/react-hooks";
import { AuthContext } from "../context/authContext";
import { useHistory } from "react-router-dom";
import { GET_ALL_POSTS, TOTAL_POSTS } from "../graphql/queries";
import {
  POST_ADDED,
  POST_UPDATED,
  POST_DELETED,
} from "../graphql/subscriptions";
import PostCard from "../components/PostCard";
import PostPagination from "../components/PostPagination";
import { toast } from "react-toastify";

function Home() {
  const [page, setPage] = useState(1);
  const { data, loading, error } = useQuery(GET_ALL_POSTS, {
    variables: { page },
  });
  const { data: postCount } = useQuery(TOTAL_POSTS);
  const [fetchPosts, { data: posts }] = useLazyQuery(GET_ALL_POSTS);

  //subscription | post added
  const { data: newPost } = useSubscription(POST_ADDED, {
    onSubscriptionData: async ({
      client: { cache },
      subscriptionData: { data },
    }) => {
      //read query from cache
      const { allPosts } = cache.readQuery({
        query: GET_ALL_POSTS,
        variables: { page },
      });
      //write back to cache
      cache.writeQuery({
        query: GET_ALL_POSTS,
        variables: { page },
        data: {
          allPosts: [data.postAdded, ...allPosts],
        },
      });
      //refetch all posts to update ui
      fetchPosts({
        variables: { page },
        refetchQueries: [{ query: GET_ALL_POSTS, variables: { page } }],
      });

      //show toast notification
      toast.success(`New post about ${data.postAdded.country}!`, {
        toastId: "individualId",
      });
    },
  });

  //subscription | post updated
  const { data: updatedPost } = useSubscription(POST_UPDATED);

  //subscription | post deleted
  const { data: deletedPost } = useSubscription(POST_DELETED, {
    onSubscriptionData: async ({
      client: { cache },
      subscriptionData: { data },
    }) => {
      //read query from cache
      const { allPosts } = cache.readQuery({
        query: GET_ALL_POSTS,
        variables: { page },
      });
      let filteredPost = allPosts.filter((p) => p._id !== data.postDeleted._id);

      //write back to cache
      cache.writeQuery({
        query: GET_ALL_POSTS,
        variables: { page },
        data: {
          allPosts: filteredPost,
        },
      });
      //refetch all posts to update ui
      fetchPosts({
        variables: { page },
        refetchQueries: [{ query: GET_ALL_POSTS }],
      });
    },
  });

  //access context
  const { state, dispatch } = useContext(AuthContext);

  //react router
  let history = useHistory();

  if (loading) return <p className="p-5">Loading...</p>;

  return (
    <div className="container">
      <div className="row p-5">
        {data &&
          data.allPosts.map((post) => (
            <div className="col-md-4 p-3" key={post._id}>
              <PostCard post={post} />
            </div>
          ))}
      </div>
      <PostPagination page={page} setPage={setPage} postCount={postCount} />
    </div>
  );
}

export default Home;

import React from "react";
import { useParams } from "react-router-dom";

export default function SearchResult() {
  const { query } = useParams();
  return (
    <div>
      <p>search results | {query}</p>
    </div>
  );
}

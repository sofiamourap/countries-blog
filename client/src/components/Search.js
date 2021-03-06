import React, { useState } from "react";
import { useHistory } from "react-router-dom";

export default function Search() {
  const [query, setQuery] = useState("");
  let history = useHistory();

  const handleSubmit = (e) => {
    e.preventDefault();
    history.push(`/search/${query}`);
  };

  return (
    <div>
      <form className="form-inline my-2 my-lg-0" onSubmit={handleSubmit}>
        <input
          value={query}
          className="form-control mr-sm-2"
          type="search"
          placeholder="Search"
          aria-label="Search"
          onChange={(e) => setQuery(e.target.value)}
        />
        <button className="btn btn-outline-success my-2 my-sm-0" type="submit">
          Search
        </button>
      </form>
    </div>
  );
}

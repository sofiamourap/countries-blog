import React, { useState, useEffect } from "react";
import axios from "axios";

export default function PostForm({
  handleSubmit,
  values,
  handleChange,
  loading,
}) {
  const [countriesList, setCountriesList] = useState([]);
  const { content, image, country } = values;

  useEffect(() => {
    async function getCountries() {
      const response = await axios.get("https://restcountries.eu/rest/v2/all");
      setCountriesList(response.data.map((c) => c.name));
    }
    getCountries();
  }, []);
  return (
    <div className="col">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <div className="form-group mb-1">
            <label htmlFor="lg_country" className="sr-only">
              Select Country
            </label>
            <select
              value={country}
              className="form-control mb-2"
              id="lg_country"
              onChange={handleChange}
              name="country"
              disabled={loading}
              placeholder="Select Country"
            >
              <option hidden>Select a country</option>
              {countriesList.map((country, i) => (
                <option value={country} key={i}>
                  {country}
                </option>
              ))}
            </select>
          </div>
          <textarea
            value={content}
            onChange={handleChange}
            name="content"
            rows="10"
            className="md-textarea form-control"
            placeholder="Write something cool"
            maxLength="300"
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
    </div>
  );
}

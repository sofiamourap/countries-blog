import React, { useState, useMemo, useFragment } from "react";
import { toast } from "react-toastify";
import { useQuery, useMutation } from "@apollo/react-hooks";
import omitDeep from "omit-deep";
import { PROFILE } from "../../graphql/queries";
import { USER_UPDATE } from "../../graphql/mutations";

export default function Profile() {
  const [values, setValues] = useState({
    username: "",
    name: "",
    email: "",
    about: "",
    images: [],
  });

  const { username, name, email, about, images } = values;

  const [loading, setLoading] = useState(false);

  // query
  const { data } = useQuery(PROFILE);

  // mutation
  const [userUpdate] = useMutation(USER_UPDATE, {
    update: ({ data }) => {
      console.log("USER UPDATE MUTATION IN PROFILE", data);
      toast.success("Profile updated");
    },
  });

  useMemo(() => {
    if (data) {
      console.log(data.profile);
      setValues({
        ...values,
        username: data.profile.username,
        name: data.profile.name,
        email: data.profile.email,
        about: data.profile.about,
        images: omitDeep(data.profile.images, ["__typename"]),
        //first argument is the data and the second what we want to remove
      });
    }
  }, [data]);

  const handleImageChange = () => {};

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(values);
    setLoading(true);
    userUpdate({ variables: { input: values } });
    setLoading(false);
  };

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const profileUpdateForm = () => (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Username</label>
        <input
          type="text"
          name="username"
          value={username}
          onChange={handleChange}
          className="form-control"
          placeholder="Username"
          disable={loading}
        />

        <div className="form-group">
          <label>Name</label>
          <input
            type="text"
            name="name"
            value={name}
            onChange={handleChange}
            className="form-control"
            placeholder="Name"
            disable={loading}
          />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={email}
            onChange={handleChange}
            className="form-control"
            placeholder="Email"
            disable
          />
        </div>
        <div className="form-group">
          <label>About</label>
          <textarea
            name="about"
            value={about}
            onChange={handleChange}
            className="form-control"
            placeholder="About"
            disable={loading}
          />
        </div>
        <div className="form-group">
          <label>Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="form-control"
            placeholder="Image"
            // disable={loading}
          />
        </div>
      </div>
      <button
        className="btn btn-primary"
        type="submit"
        disable={!email || loading}
      >
        Submit
      </button>
    </form>
  );

  return <div className="container p-5">{profileUpdateForm()}</div>;
}

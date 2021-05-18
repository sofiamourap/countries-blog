import React, { useState, useMemo, Fragment, useContext } from "react";
import { toast } from "react-toastify";
import { useQuery, useMutation } from "@apollo/react-hooks";
import omitDeep from "omit-deep";
import { PROFILE } from "../../graphql/queries";
import { USER_UPDATE } from "../../graphql/mutations";
import { AuthContext } from "../../context/authContext";
import UserProfile from "../../components/forms/UserProfile";
import FileUpload from "../../components/FileUpload";

export default function Profile() {
  const { state } = useContext(AuthContext);
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

  return (
    <div className="container p-5">
      <div className="row">
        <div className="col-md-12 pb-3">
          {loading ? (
            <h4 className="text-danger">Loading...</h4>
          ) : (
            <h4>Profile</h4>
          )}
        </div>
        <FileUpload
          setValues={setValues}
          values={values}
          setLoading={setLoading}
          loading={loading}
        />
      </div>

      <UserProfile
        {...values}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        loading={loading}
      />
    </div>
  );
}

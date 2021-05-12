import React, { useState, useMemo, Fragment, useContext } from "react";
import { toast } from "react-toastify";
import { useQuery, useMutation } from "@apollo/react-hooks";
import omitDeep from "omit-deep";
import { PROFILE } from "../../graphql/queries";
import { USER_UPDATE } from "../../graphql/mutations";
import Resizer from "react-image-file-resizer";
import axios from "axios";
import { AuthContext } from "../../context/authContext";
import UserProfile from "../../components/forms/UserProfile";

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

  const fileResizeAndUpload = (e) => {
    setLoading(true);
    let fileInput = false;
    if (e.target.files[0]) {
      fileInput = true;
    }
    if (fileInput) {
      try {
        Resizer.imageFileResizer(
          e.target.files[0],
          300,
          300,
          "JPEG",
          100,
          0,
          (uri) => {
            // console.log(uri);
            axios
              .post(
                `${process.env.REACT_APP_REST_ENDPOINT}/uploadimages`,
                { image: uri },
                {
                  headers: {
                    authtoken: state.user.token,
                  },
                }
              )
              .then((response) => {
                setLoading(false);
                console.log("cloudinary upload", response);
                setValues({ ...values, images: [...images, response.data] }); // data = {url, public_id}
              })
              .catch((error) => {
                setLoading(false);
                console.log("Cloudinary Upload Failed", error);
              });
          },
          "base64",
          200,
          200
        );
      } catch (err) {
        console.log(err);
      }
    }
  };

  const handleImageRemove = (id) => {
    setLoading(true);
    axios
      .post(
        `${process.env.REACT_APP_REST_ENDPOINT}/removeimage`,
        {
          public_id: id,
        },
        {
          headers: {
            authtoken: state.user.token,
          },
        }
      )
      .then((response) => {
        setLoading(false);
        let filteredImages = images.filter((item) => {
          return item.public_id !== id;
        });
        setValues({ ...values, images: filteredImages });
      })
      .catch((error) => {
        setLoading(false);
        console.log(error);
      });
  };

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
        <div className="col-md-3">
          <div className="form-group">
            <label className="btn btn-primary">
              Upload Image
              <input
                hidden
                type="file"
                accept="image/*"
                onChange={fileResizeAndUpload}
                className="form-control"
                placeholder="Image"
                // disable={loading}
              />
            </label>
          </div>
        </div>
        <div className="col-md-9">
          {images.map((image) => (
            <img
              src={image.url}
              key={image.public_id}
              alt={image.public_id}
              style={{ height: "100px" }}
              className="float-right"
              onClick={() => handleImageRemove(image.public_id)}
            />
          ))}
        </div>
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

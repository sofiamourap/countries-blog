import React, { useContext, Fragment } from "react";
import Resizer from "react-image-file-resizer";
import axios from "axios";
import { AuthContext } from "../context/authContext";
import Images from "./Images";

export default function FileUpload({ setLoading, setValues, values, loading }) {
  const { state } = useContext(AuthContext);

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
                const { images } = values;
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
        const { images } = values;
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
  return (
    <div className="row">
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
              // disabled={loading}
            />
          </label>
        </div>
      </div>
      <div className="col-md-9">
        {values.images.map((image) => (
          <Images
            image={image}
            key={image.public_id}
            handleImageRemove={handleImageRemove}
          />
        ))}
      </div>
    </div>
  );
}

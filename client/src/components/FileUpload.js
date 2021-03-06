import React, { useContext, Fragment } from "react";
import Resizer from "react-image-file-resizer";
import axios from "axios";
import { AuthContext } from "../context/authContext";
import Images from "./Images";

export default function FileUpload({
  setLoading,
  setValues,
  values,
  loading,
  singleUpload = false,
}) {
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
                //set values to parent component based on either it is used fpr single/multiple upload
                if (singleUpload) {
                  //single upload
                  const { image } = values;
                  setValues({ ...values, image: response.data });
                } else {
                  const { images } = values;
                  setValues({ ...values, images: [...images, response.data] }); // data = {url, public_id}
                }
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
        //set values to parent component based on either it is used fpr single/multiple upload
        if (singleUpload) {
          const { image } = values;
          setValues({
            ...values,
            image: {
              url: "",
              public_id: "",
            },
          });
        } else {
          const { images } = values;
          let filteredImages = images.filter((item) => {
            return item.public_id !== id;
          });
          setValues({ ...values, images: filteredImages });
        }
      })
      .catch((error) => {
        setLoading(false);
        console.log(error);
      });
  };
  return (
    <div className="row">
      <div className="col-md-4">
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
      <div className="col-md-8">
        {/* for single images */}
        {values.image && (
          <Images
            image={values.image}
            key={values.image.public_id}
            handleImageRemove={handleImageRemove}
          />
        )}

        {/* for multiple images */}
        {values.images &&
          values.images.map((image) => (
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

var express = require("express");
const { ApolloServer } = require("apollo-server-express");
const http = require("http");
const path = require("path");
const mongoose = require("mongoose");
// const { makeExecutableSchema } = require("graphql-tools");
const { mergeTypeDefs, mergeResolvers } = require("@graphql-tools/merge");
const { loadFilesSync } = require("@graphql-tools/load-files");
require("dotenv").config();
const { authCheck, authCheckMiddleware } = require("./helpers/auth");
const cors = require("cors");
const cloudinary = require("cloudinary");

const app = express();

//db
const db = async () => {
  try {
    const success = await mongoose.connect(process.env.DATABASE_CLOUD, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });
    console.log("DB Connected");
  } catch (error) {
    console.log("DB Connection Error", error);
  }
};

//execute db connection
db();

// middlewares
app.use(cors());
app.use(express.json({ limit: "5mb" }));

const typeDefs = mergeTypeDefs(
  loadFilesSync(path.join(__dirname, "./typeDefs"))
);
const resolvers = mergeResolvers(
  loadFilesSync(path.join(__dirname, "./resolvers"))
);

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req, res }) => ({ req, res }),
});

// middleware - connecting ApolloServer to express
apolloServer.applyMiddleware({ app });

// server
const httpserver = http.createServer(app);

// rest endpoint
app.get("/rest", authCheck, function (req, res) {
  res.json({
    data: "You hit the rest endpoint",
  });
});

// cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// upload
app.post("/uploadimages", authCheckMiddleware, (req, res) => {
  cloudinary.uploader.upload(
    req.body.image,
    (result) => {
      console.log("RESULT CLOUDINARY", result);
      res.send({
        // url: result.url, this is http
        url: result.secure_url, //secure url https
        public_id: result.public_id,
      });
    },
    {
      public_id: `${Date.now()}`, // public name
      resource_type: "auto", //JPEG, PNG
    }
  );
});

//remove image
app.post("/removeimage", authCheckMiddleware, (req, res) => {
  let image_id = req.body.public_id;
  cloudinary.uploader.destroy(image_id, (error, result) => {
    if (error) return res.json({ success: false, error });
    res.send("ok");
  });
});

// Port
app.listen(process.env.PORT, function () {
  console.log(`server is ready at http://localhost${process.env.PORT}`);
  console.log(
    `graphql server is ready at http://localhost${process.env.PORT}${apolloServer.graphqlPath}`
  );
});

// let authorized = true;
let admin = require("firebase-admin");

var serviceAccount = require("../config/fbServiceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// exports.authCheck = (req, res, next = (f) => f) => {
//   if (!req.headers.authtoken) throw new Error("Unauthorized");
//   //token validity check
//   const valid = req.headers.authtoken === "secret";

//   if (!valid) {
//     throw new Error("Unauthorized");
//   } else {
//     next();
//   }
// };

exports.authCheck = async (req) => {
  try {
    const currentUser = await admin.auth().verifyIdToken(req.headers.authtoken);
    console.log("CURRENT USER", currentUser);
    return currentUser;
  } catch (error) {
    console.log("AUTH CHECK ERROR", error);
    throw new Error("Invalid or expired token");
  }
};

exports.authCheckMiddleware = (req, res, next) => {
  if (req.headers.authtoken) {
    admin
      .auth()
      .verifyIdToken(req.headers.authtoken)
      .then((result) => {
        next();
      })
      .catch((error) => conmsole.log(error));
  } else {
    res.json({ error: "Unauthorize. Please provide a token" });
  }
};

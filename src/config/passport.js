const passport = require("passport");
const db = require("../models/index");
const jwtAuth = require("../utility/jwtAuth");
const Pid = require("puid");
const randomstring = require("randomstring");

const FacebookStrategy = require("passport-facebook").Strategy;
const GoogleStrategy = require("passport-google-oauth2").Strategy;

const FACEBOOK_APP_ID = process.env.FACEBOOK_APP_ID;
const FACEBOOK_APP_SECRET = process.env.FACEBOOK_APP_SECRET;

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

const getEmail = profile => {
  let email = null;
  if (profile.emails && profile.emails.length) {
    email = profile.emails[0].value;
  } else if (profile._json.emails && profile._json.emails.length) {
    email = profile._json.emails[0].value;
  }
  return email;
};

function createOrReturnUser(request, CustomerModel, profile, done, strategy) {
  const email = getEmail(profile);
  let reqQuery = null;
  let token = null;
  let uid = null;
  let query = {
    $or: [
      { email, isDeleted: false, oAuthProvider: { $ne: "Voicefirst" } },
      {
        linkedAccountEmails: {
          [strategy]: email
        },
        isDeleted: false
      }
    ]
  };

  if (request.query.state) {
    reqQuery = JSON.parse(request.query.state);
  }

  if (reqQuery) {
    token = reqQuery.token;
  }
  if (token) {
    const decoded = jwtAuth.verifyJWTToken(token);
    uid = decoded.uid;
  }

  if (uid) {
    query = { uid };
  }

  if (email !== null) {
    CustomerModel.findOne(query, (err, user) => {
      if (err) return done(null, false, { message: err });
      let image = "";
      if (strategy === "google") {
        image = profile._json.image.url;
      } else if (strategy === "facebook") {
        image = profile._json.picture.data.url;
      }
      if (user) {
        // This if statement is just for when the user is trying to link any one of his accounts
        if (uid) {
          // Check if the oauth email, already linked with any other account already?
          db.Customer.findOne(
            {
              linkedAccountEmails: { [strategy]: email },
              isDeleted: false
            },
            (err, usr) => {
              if (err) {
                return done(null, user);
              }
              if (usr) {
                return done(null, user);
              }
              db.Customer.findOneAndUpdate(
                query,
                {
                  $addToSet: {
                    linkedAccounts: strategy,
                    linkedAccountEmails: { [strategy]: email }
                  }
                },
                (error, updatedUser) => {
                  if (err || !updatedUser) return done(null, user);
                  if (
                    updatedUser.profileImage &&
                    updatedUser.profileImage.length !== 0
                  )
                    return done(null, updatedUser);
                  db.Customer.findOneAndUpdate(
                    query,
                    {
                      $set: { profileImage: image }
                    },
                    (err, imageUpdated) => {
                      if (err || !imageUpdated) return done(null, false);
                      return done(null, imageUpdated);
                    }
                  );
                }
              );
            }
          );
        } else {
          if (user.profileImage && user.profileImage.length !== 0)
            return done(null, user);
          db.Customer.findOneAndUpdate(
            query,
            {
              $set: { profileImage: image }
            },
            (err, imageUpdated) => {
              if (err || !imageUpdated) return done(null, false);
              return done(null, imageUpdated);
            }
          );
        }
      } else {
        // if there is no user with that email
        // create the user
        var newUser = new db.Customer();
        const puid = new Pid();
        const uid = puid.generate("userId");
        // set the user's local credentials
        newUser.uid = uid;
        newUser.username = null;
        newUser.email = email;
        newUser.password = randomstring.generate({
          length: 40,
          charset: "alphabetic"
        });

        newUser.name =
          strategy === "facebook"
            ? profile._json.name
            : profile.displayName
            ? profile.displayName
            : email.split("@")[0];
        newUser.isVerified = "true";
        newUser.passwordKey = "";
        newUser.oAuth = false;
        newUser.oAuthProvider = strategy === "facebook" ? "Facebook" : "Google";
        newUser.profileImage = image;
        newUser.linkedAccounts = [strategy];
        newUser.linkedAccountEmails = [{ [strategy]: email }];
        newUser.lastLoggedIn = new Date();
        newUser.createdAt = new Date();
        newUser.passwordKey = randomstring.generate({
          length: 26
        });

        // save the user
        newUser.save(function(err) {
          if (err) {
            throw err;
          }
          // addSubscriber({ firstName: newUser.name }, newUser.email);
          return done(null, newUser);
        });
      }
    });
  } else if (profile && email === null) {
    console.log("emailerror", profile);
    return done(null, false);
  } else {
    console.log("error", profile);
    return done(null, false);
  }
}

passport.use(
  new FacebookStrategy(
    {
      clientID: FACEBOOK_APP_ID,
      clientSecret: FACEBOOK_APP_SECRET,
      callbackURL: "/auth/facebook/callback",
      profileFields: ["email", "displayName", "picture.type(small)"],
      passReqToCallback: true
    },
    (request, accessToken, refreshToken, profile, done) => {
      createOrReturnUser(request, db.Customer, profile, done, "facebook");
    }
  )
);

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
      passReqToCallback: true
    },
    (request, accessToken, refreshToken, profile, done) => {
      console.log("HEY req.", request, profile);
      createOrReturnUser(request, db.Customer, profile, done, "google");
    }
  )
);

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  UserModal.db
    .collection("user")
    .find({ _id: ObjectId(id) })
    .toArray((err, user) => {
      if (err) return done(null, false, { message: err });
      done(null, user);
    });
});

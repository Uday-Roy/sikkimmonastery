//const passport = require("passport");
//const GoogleStrategy = require("passport-google-oauth20").Strategy;
//const User = require("../models/User");
//const GitHubStrategy = require("passport-github2").Strategy;

// passport.use(
//   new GoogleStrategy(
//     {
//       clientID: process.env.GOOGLE_CLIENT_ID,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//       callbackURL: "https://sikkimmonastery.onrender.com/auth/google/callback",
//       // callbackURL: "/auth/google/callback",
//     },
//     async (accessToken, refreshToken, profile, done) => {
//       let user = await User.findOne({ googleId: profile.id });

//       if (!user) {
//         user = await User.create({
//           name: profile.displayName,
//           email: profile.emails?.[0]?.value,
//           googleId: profile.id,
//           role: "user",
//         });
//       }

//       done(null, user);
//     },
//   ),

// Google OAuth strategy
//   passport.use(
//   new GitHubStrategy(
//     {
//       clientID: process.env.GITHUB_CLIENT_ID,
//       clientSecret: process.env.GITHUB_CLIENT_SECRET,
//       callbackURL:
//         "https://sikkimmonastery.onrender.com/auth/github/callback",
//     },

//     async (accessToken, refreshToken, profile, done) => {
//       try {
//         const User = require("../models/User");

//         let user = await User.findOne({
//           email: profile.emails?.[0]?.value,
//         });

//         if (!user) {
//           user = await User.create({
//             name: profile.displayName || profile.username,
//             email: profile.emails?.[0]?.value,
//             password: "github-login",
//           });
//         }

//         done(null, user);
//       } catch (err) {
//         done(err, null);
//       }
//     },
//   ),
// );

//   // GitHub OAuth strategy (optional)
//   passport.use(
//     new GitHubStrategy(
//       {
//         clientID: process.env.GITHUB_CLIENT_ID,
//         clientSecret: process.env.GITHUB_CLIENT_SECRET,
//         callbackURL:
//           "https://sikkimmonastery.onrender.com/auth/github/callback",
//       },

//       async (accessToken, refreshToken, profile, done) => {
//         try {
//           const User = require("../models/User");

//           let user = await User.findOne({
//             email: profile.emails?.[0]?.value,
//           });

//           if (!user) {
//             user = await User.create({
//               name: profile.displayName || profile.username,
//               email: profile.emails?.[0]?.value,
//               password: "github-login",
//             });
//           }

//           done(null, user);
//         } catch (err) {
//           done(err, null);
//         }
//       },
//     ),
//   ),

// module.exports = passport;

// ***   full code for passport.js

// const passport = require("passport");

// const GoogleStrategy = require("passport-google-oauth20").Strategy;

// const GitHubStrategy = require("passport-github2").Strategy;

// const User = require("../models/User");

// // GOOGLE LOGIN
// passport.use(
//   new GoogleStrategy(
//     {
//       clientID: process.env.GOOGLE_CLIENT_ID,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET,

//       callbackURL: "https://sikkimmonastery.onrender.com/auth/google/callback",
//     },

//     async (accessToken, refreshToken, profile, done) => {
//       try {
//         let user = await User.findOne({
//           email: profile.emails[0].value,
//         });

//         if (!user) {
//           user = await User.create({
//             name: profile.displayName,
//             email: profile.emails[0].value,
//             password: "google-login",
//           });
//         }

//         return done(null, user);
//       } catch (err) {
//         return done(err, null);
//       }
//     },
//   ),
// );

// // GITHUB LOGIN
// passport.use(
//   new GitHubStrategy(
//     {
//       clientID: process.env.GITHUB_CLIENT_ID,
//       clientSecret: process.env.GITHUB_CLIENT_SECRET,

//       callbackURL: "https://sikkimmonastery.onrender.com/auth/github/callback",
//     },

//     async (accessToken, refreshToken, profile, done) => {
//       try {
//         let user = await User.findOne({
//           email: profile.emails?.[0]?.value,
//         });

//         if (!user) {
//           user = await User.create({
//             name: profile.displayName || profile.username,

//             email:
//               profile.emails?.[0]?.value || `${profile.username}@github.com`,

//             password: "github-login",
//           });
//         }

//         return done(null, user);
//       } catch (err) {
//         return done(err, null);
//       }
//     },
//   ),
// );

// module.exports = passport;

// ***  full code for passport.js again with github fix issue

// server/config/passport.js

const passport = require("passport");

const GoogleStrategy = require("passport-google-oauth20").Strategy;

const GitHubStrategy = require("passport-github2").Strategy;

const User = require("../models/User");

// =========================
// GOOGLE LOGIN
// =========================

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,

      clientSecret: process.env.GOOGLE_CLIENT_SECRET,

      // callbackURL: "https://sikkimmonastery.onrender.com/auth/google/callback",
      callbackURL:
        "https://sikkimmonastery-api.udayroy.in/auth/google/callback",
    },

    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({
          email: profile.emails[0].value,
        });

        // Create new user if not exists
        if (!user) {
          user = await User.create({
            name: profile.displayName,

            email: profile.emails[0].value,

            password: "google-login",
          });
        }

        return done(null, user);
      } catch (err) {
        console.log("Google Login Error:", err);

        return done(err, null);
      }
    },
  ),
);

// =========================
// GITHUB LOGIN
// =========================

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,

      clientSecret: process.env.GITHUB_CLIENT_SECRET,

      // callbackURL: "https://sikkimmonastery.onrender.com/auth/github/callback",
      callbackURL:
        "https://sikkimmonastery-api.udayroy.in/auth/github/callback",

      scope: ["user:email", "read:user"],
    },

    async (accessToken, refreshToken, profile, done) => {
      try {
        // GitHub sometimes does not provide email
        const email =
          profile.emails && profile.emails.length > 0
            ? profile.emails[0].value
            : `${profile.username}@github.com`;

        let user = await User.findOne({
          email,
        });

        // Create user if not found
        if (!user) {
          user = await User.create({
            name: profile.displayName || profile.username,

            email,

            password: "github-login",
          });
        }

        return done(null, user);
      } catch (err) {
        console.log("GitHub Login Error:", err);

        return done(err, null);
      }
    },
  ),
);

module.exports = passport;

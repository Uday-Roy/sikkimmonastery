const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/User");
const GitHubStrategy = require("passport-github2").Strategy;

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
  passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL:
        "https://sikkimmonastery.onrender.com/auth/github/callback",
    },

    async (accessToken, refreshToken, profile, done) => {
      try {
        const User = require("../models/User");

        let user = await User.findOne({
          email: profile.emails?.[0]?.value,
        });

        if (!user) {
          user = await User.create({
            name: profile.displayName || profile.username,
            email: profile.emails?.[0]?.value,
            password: "github-login",
          });
        }

        done(null, user);
      } catch (err) {
        done(err, null);
      }
    },
  ),
);

  // GitHub OAuth strategy (optional)
  passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL:
          "https://sikkimmonastery.onrender.com/auth/github/callback",
      },

      async (accessToken, refreshToken, profile, done) => {
        try {
          const User = require("../models/User");

          let user = await User.findOne({
            email: profile.emails?.[0]?.value,
          });

          if (!user) {
            user = await User.create({
              name: profile.displayName || profile.username,
              email: profile.emails?.[0]?.value,
              password: "github-login",
            });
          }

          done(null, user);
        } catch (err) {
          done(err, null);
        }
      },
    ),
  ),
);

module.exports = passport;

/* const session = require("express-session");
const MongoStore = require("connect-mongo");

module.exports = (app) => {
    app.use(
        session({
            secret: process.env.SESSION_SECRET || "supersecretkey",
            resave: false,
            saveUninitialized: false,
            store: MongoStore.create({
                mongoUrl: process.env.MONGO_URI,
                collectionName: "sessions",
            }),
            cookie: {
                httpOnly: true,
                secure: false, // If using HTTPS, change to true
                maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
            },
        })
    );
}; */

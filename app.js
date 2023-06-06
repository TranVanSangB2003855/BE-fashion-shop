const express = require("express");
const cors = require("cors");
const cookieSession = require("cookie-session");
const ApiError = require("./app/api-error");
const itemRoute = require("./app/routes/item.route");
const cartRoute = require("./app/routes/cart.routes");
const orderRoute = require("./app/routes/order.routes");

const app = express();

// var corsOptions = {
//     origin: "http://localhost:5173"
// };

// app.use(cors(corsOptions));
app.use(cors());
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

app.use(
    cookieSession({
        name: "bookworm-session",
        secret: "COOKIE_SECRET", // should use as secret environment variable
        httpOnly: true
    })
);

app.get("/", (res, req) => {
    req.json({ message: "Welcome to contact fashion shop." });
})

// routes
app.use("/api/items", itemRoute);
app.use("/api/cart", cartRoute);
app.use("/api/order", orderRoute);
require('./app/routes/user.routes')(app);
require('./app/routes/auth.routes')(app);

// handle 404 response
// app.use((req, res, next) => {
//     // Code ở đây sẽ chạy khi không có route được định nghĩa nào
//     // khớp với yêu cầu. Gọi next() để chuyển sang middleware xử lý lỗi
//     return next(new ApiError(404, "Resource not found"));
// });

// define error-handling middleware last, after other app.use() and routes calls
app.use((err, req, res, next) => {
    // Middleware xử lý lỗi tập trung.
    // Trong các đoạn code xử lý ở các route, gọi next(error)
    // sẽ chuyển về middleware xử lý lỗi này
    return res.status(err.statusCode || 500).json({
        message: err.message || "Internal Server Error",
    });
});

module.exports = app

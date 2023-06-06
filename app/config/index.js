const config = {
    app: {
        port: process.env.port || 3333 ,
    },
    db: {
        uri: process.env.MONGODB_URI || "mongodb+srv://admin:TRVASAmb6902@cluster0.ekgkgef.mongodb.net/fashion-shop"//"mongodb://127.0.0.1:27017/fashion-shop"
    },
    secret: "bezkoder-secret-key"
};

module.exports = config;
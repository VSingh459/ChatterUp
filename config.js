import mongoose from 'mongoose';

export function connect() {
    return mongoose.connect("mongodb://127.0.0.1:27017/chatApp", {
        //useNewUrlParser: true,
        //useUnifiedTopology: true
    }).then(function () {
        console.log("Database is connected");
    }).catch(function (error) {
        console.error("Database connection failed:", error);
    });
}

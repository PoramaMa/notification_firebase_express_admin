const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const { applicationDefault, initializeApp } = require('firebase-admin/app');
const { getMessaging } = require('firebase-admin/messaging');
require('dotenv').config();
const cors = require("cors");

process.env.GOOGLE_APPLICATION_CREDENTIALS;

const app = express();

app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')));


app.use(
    cors({
        origin: "*",
    })
);

app.use(
    cors({
        methods: ["GET", "POST", "DELETE", "UPDATE", "PUT", "PATCH"],
    })
);

app.use(function (req, res, next) {
    res.setHeader("Content-Type", "application/json");
    next();
});

initializeApp({
    credential: applicationDefault(),
    projectId: 'winbot-notification-web',
});

app.post("/send", function (req, res) {
    const receivedToken = req.body.fcmToken;

    const message = {
        notification: {
            title: "testtt",
            body: 'This is a Test Notification'
        },
        token: receivedToken,
    };

    getMessaging()
        .send(message)
        .then((response) => {
            res.status(200).json({
                message: "Successfully sent message",
                token: receivedToken,
            });
            console.log("Successfully sent message:", response);
        })
        .catch((error) => {
            res.status(400);
            res.send(error);
            console.log("Error sending message:", error);
        });


});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT = 3145, () => {
    console.log(`Server running on port ${PORT}`);
});
const express = require("express");
const path = require("path");
const port = process.env.PORT || 3000; 
var bodyParser = require("body-parser");
const cookieParser = require('cookie-parser')

const app = express();

const Chats = require("./models/chats");
let newChat = new Chats({ issue: "depression", msgs: [] });
newChat.save();
newChat = new Chats({ issue: "loneliness", msgs: [] });
newChat.save();
newChat = new Chats({ issue: "bipolar", msgs: [] });
newChat.save();
newChat = new Chats({ issue: "anxiety", msgs: [] });
newChat.save();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static("./public"));

const router = require("./routing/router");
const mongoConnect = require("./utils/conn");

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(router);

mongoConnect(() => {
    app.listen(port, () => {
        console.log(`Listening to port ${port}...`);
    })
})
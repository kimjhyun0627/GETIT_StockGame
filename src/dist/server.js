"use strict";
exports.__esModule = true;
var express_1 = require("express");
var cors_1 = require("cors");
var http_1 = require("http");
var app = express_1["default"]();
var server = http_1.createServer(app);
app.use(cors_1["default"]());
app.use(express_1["default"].json());
app.get('/', function (req, res) {
    res.send('Server is running');
});
server.listen(3000, function () {
    console.log('Server is running on port 3000');
});

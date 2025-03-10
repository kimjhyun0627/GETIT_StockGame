"use strict";
exports.__esModule = true;
var react_1 = require("react");
var react_router_dom_1 = require("react-router-dom");
var react_cookie_1 = require("react-cookie");
var UserPage_1 = require("./component/UserPage");
var CommanderPage_1 = require("./component/CommanderPage");
var LoginPage_1 = require("./component/LoginPage");
var App = function () {
    var _a = react_cookie_1.useCookies(["user"]), cookies = _a[0], setCookie = _a[1];
    var _b = react_1.useState(null), user = _b[0], setUser = _b[1];
    // 쿠키에 사용자 정보가 있으면 해당 정보를 가져온다
    react_1.useEffect(function () {
        if (cookies.user) {
            setUser(cookies.user);
        }
    }, [cookies]);
    // 쿠키가 없다면 로그인 페이지로 이동
    if (!user) {
        return (react_1["default"].createElement(react_router_dom_1.BrowserRouter, null,
            react_1["default"].createElement(react_router_dom_1.Routes, null,
                react_1["default"].createElement(react_router_dom_1.Route, { path: "/login", element: react_1["default"].createElement(LoginPage_1["default"], null) }),
                react_1["default"].createElement(react_router_dom_1.Route, { path: "*", element: react_1["default"].createElement(react_router_dom_1.Navigate, { to: "/login" }) }))));
    }
    // 사용자 정보가 있으면 특수 이름에 따라 다른 페이지로 리다이렉트
    return (react_1["default"].createElement(react_router_dom_1.BrowserRouter, null,
        react_1["default"].createElement(react_router_dom_1.Routes, null,
            react_1["default"].createElement(react_router_dom_1.Route, { path: "/user", element: user !== "ggetitofficial" ? react_1["default"].createElement(UserPage_1["default"], null) : react_1["default"].createElement(react_router_dom_1.Navigate, { to: "/commander" }) }),
            react_1["default"].createElement(react_router_dom_1.Route, { path: "/commander", element: user === "ggetitofficial" ? react_1["default"].createElement(CommanderPage_1["default"], null) : react_1["default"].createElement(react_router_dom_1.Navigate, { to: "/user" }) }),
            react_1["default"].createElement(react_router_dom_1.Route, { path: "*", element: react_1["default"].createElement(react_router_dom_1.Navigate, { to: user !== "ggetitofficial" ? "/user" : "/commander" }) }))));
};
exports["default"] = App;

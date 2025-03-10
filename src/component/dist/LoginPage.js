"use strict";
exports.__esModule = true;
var react_1 = require("react");
var react_router_dom_1 = require("react-router-dom");
var react_cookie_1 = require("react-cookie");
var LoginPage = function () {
    var _a = react_1.useState(""), name = _a[0], setName = _a[1];
    var _b = react_cookie_1.useCookies(["user"]), setCookie = _b[1];
    var navigate = react_router_dom_1.useNavigate();
    var handleLogin = function () {
        var expires = new Date();
        expires.setTime(expires.getTime() + 5 * 60 * 60 * 1000); // 5시간 후 만료
        setCookie("user", name, { path: "/", expires: expires }); // 쿠키에 사용자 이름 저장
        // 쿠키에 정보가 저장되면 리렌더링 후 적절한 페이지로 이동
        if (name === "ggetitofficial") {
            navigate("/commander");
        }
        else {
            navigate("/user");
        }
    };
    return (react_1["default"].createElement("div", null,
        react_1["default"].createElement("h1", null, "\uB85C\uADF8\uC778"),
        react_1["default"].createElement("input", { type: "text", placeholder: "\uC0AC\uC6A9\uC790 \uC774\uB984\uC744 \uC785\uB825\uD558\uC138\uC694", value: name, onChange: function (e) { return setName(e.target.value); } }),
        react_1["default"].createElement("button", { onClick: handleLogin }, "\uB85C\uADF8\uC778")));
};
exports["default"] = LoginPage;

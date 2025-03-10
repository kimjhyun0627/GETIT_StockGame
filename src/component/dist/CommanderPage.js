"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
var react_1 = require("react");
var CommanderPage = function () {
    var _a = react_1.useState(null), data = _a[0], setData = _a[1];
    var _b = react_1.useState(null), setSocket = _b[1];
    // 입력 값 상태 설정
    var _c = react_1.useState(2022), newYear = _c[0], setNewYear = _c[1];
    var _d = react_1.useState([
        { name: "Company 1", data: [1000, 1100, 1200, 1300, 1400, 1500, 2000] },
        { name: "Company 2", data: [2000, 2100, 2200, 2300, 2400, 2500, 2000] },
        { name: "Company 3", data: [3000, 3100, 3200, 3300, 3300, 3400, 2001] },
        { name: "Company 4", data: [4000, 4100, 4200, 4300, 1500, 1600, 2001] },
        { name: "Company 5", data: [5000, 5100, 5200, 5300, 5400, 5500, 2002] },
        { name: "Company 6", data: [6000, 6100, 6200, 6300, 6400, 6500, 2003] },
    ]), newCompanies = _d[0], setNewCompanies = _d[1];
    react_1.useEffect(function () {
        var ws = new WebSocket("ws://localhost:5000");
        ws.onmessage = function (event) {
            var receivedData = JSON.parse(event.data);
            console.log("📥 New JSON Received:", receivedData);
            setData(receivedData);
        };
        ws.onclose = function () {
            console.log("🔴 WebSocket Disconnected");
        };
        setSocket(ws);
        return function () {
            ws.close();
        };
    }, []);
    // 버튼 클릭 시 백엔드에 데이터 전송
    var handleUpdateData = function () {
        fetch("http://localhost:5000/update-data", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                year: newYear,
                companies: newCompanies
            })
        })
            .then(function (response) { return response.text(); })
            .then(function (data) {
            console.log("📡 Data updated successfully:", data);
        })["catch"](function (error) { return console.error("❌ Error updating data:", error); });
    };
    // 날짜 변경 핸들러
    var handleYearChange = function (event) {
        setNewYear(Number(event.target.value));
    };
    // 회사 데이터 변경 핸들러
    var handleCompanyDataChange = function (companyIndex, dataIndex, event) {
        var updatedCompanies = __spreadArrays(newCompanies);
        updatedCompanies[companyIndex].data[dataIndex] = Number(event.target.value);
        setNewCompanies(updatedCompanies);
    };
    return (react_1["default"].createElement("div", null,
        react_1["default"].createElement("h1", null, "\uD83D\uDCE1\uC6B4\uC601\uC9C4\uC774\uC2DC\uAD70\uC694? \uC8FC\uC2DD\uAC8C\uC784 \uD654\uC774\uD305~"),
        data ? (react_1["default"].createElement("div", null,
            react_1["default"].createElement("h2", null,
                "Year:",
                " ",
                react_1["default"].createElement("input", { type: "number", value: newYear, onChange: handleYearChange, style: { marginLeft: "10px", width: "80px" } })),
            newCompanies.map(function (company, companyIndex) { return (react_1["default"].createElement("div", { key: companyIndex, style: { marginBottom: "20px" } },
                react_1["default"].createElement("strong", null,
                    company.name,
                    ":"),
                company.data.map(function (value, dataIndex) { return (react_1["default"].createElement("input", { key: dataIndex, type: "number", value: value, onChange: function (event) { return handleCompanyDataChange(companyIndex, dataIndex, event); }, style: { marginLeft: "10px", width: "80px" } })); }))); }),
            react_1["default"].createElement("button", { onClick: handleUpdateData, style: { marginTop: "20px" } }, "\uB370\uC774\uD130 \uC5C5\uB370\uC774\uD2B8"))) : (react_1["default"].createElement("p", null, "\uB370\uC774\uD130 \uC218\uC2E0 \uC911..."))));
};
exports["default"] = CommanderPage;

"use strict";
// WebSocket.tsx
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
var react_1 = require("react");
var react_chartjs_2_1 = require("react-chartjs-2");
var chart_js_1 = require("chart.js");
var react_cookie_1 = require("react-cookie"); // react-cookie 사용
// Chart.js 컴포넌트 등록
chart_js_1.Chart.register(chart_js_1.CategoryScale, chart_js_1.LinearScale, chart_js_1.PointElement, chart_js_1.LineElement, chart_js_1.Title, chart_js_1.Tooltip, chart_js_1.Legend);
var UserPage = function (_a) {
    var name = _a.name;
    var initialCash = 1000000; // 초기 보유 현금 100만원
    var _b = react_cookie_1.useCookies(["cash", "stocks", "year"]), cookies = _b[0], setCookie = _b[1]; // 쿠키 관련
    var _c = react_1.useState(null), chartData = _c[0], setChartData = _c[1];
    var _d = react_1.useState(parseFloat(cookies.cash || "" + initialCash)), cash = _d[0], setCash = _d[1]; // 현금
    var _e = react_1.useState(cookies.stocks || {}), stocks = _e[0], setStocks = _e[1]; // 보유 주식
    var _f = react_1.useState(cash), totalAssets = _f[0], setTotalAssets = _f[1]; // 총 자산
    var _g = react_1.useState(parseInt(cookies.year || "2022")), year = _g[0], setYear = _g[1]; // 연도
    var _h = react_1.useState(null), data = _h[0], setData = _h[1]; // WebSocket으로 받은 데이터
    var rgbdata = [
        "rgb(255, 99, 132)",
        "rgb(54, 162, 235)",
        "rgb(255, 206, 86)",
        "rgb(75, 192, 192)",
        "rgb(153, 102, 255)",
        "rgb(255, 159, 64)",
    ];
    // cash cookie가 없으면 초기값으로 생성
    react_1.useEffect(function () {
        if (!cookies.cash) {
            var expires = new Date();
            expires.setTime(expires.getTime() + 5 * 60 * 60 * 1000); // 5시간 후 만료
            setCookie("cash", initialCash.toString(), { expires: expires });
            setCash(initialCash); // 현금 업데이트
        }
    }, [cookies, setCookie]);
    react_1.useEffect(function () {
        var socket = new WebSocket("ws://localhost:5000");
        socket.onmessage = function (event) {
            var receivedData = JSON.parse(event.data);
            // console.log("📥 New JSON Received:", receivedData);
            setData(receivedData); // WebSocket으로 받은 데이터 저장
            // 차트 데이터 설정
            setChartData({
                labels: ["2020", "2021", "2022", "2023", "2024", "2025", "2026"],
                datasets: receivedData.companies.map(function (company, index) { return ({
                    label: company.name,
                    data: receivedData.companies.map(function (company) {
                        return company.data.slice(0, receivedData.year - 2019);
                    })[index],
                    fill: false,
                    borderColor: rgbdata[index],
                    tension: 0.1
                }); })
            });
            setYear(receivedData.year); // 연도 업데이트
        };
        socket.onclose = function () {
            // console.log("🔴 WebSocket Disconnected");
        };
        return function () {
            socket.close();
        };
    }, []);
    react_1.useEffect(function () {
        // 쿠키에 연도 저장
        var expires = new Date();
        expires.setTime(expires.getTime() + 5 * 60 * 60 * 1000); // 5시간 후 만료
        setCookie("year", data === null || data === void 0 ? void 0 : data.year.toString(), { expires: expires });
        var defaultStocks = data ? __assign({}, data.companies.reduce(function (acc, company) {
            var _a;
            return (__assign(__assign({}, acc), (_a = {}, _a[company.name] = 0, _a)));
        }, {})) : {};
        // stocks가 없으면 초기값으로 설정
        if (Object.keys(stocks).length === 0) {
            // console.log(defaultStocks);
            setStocks(defaultStocks);
            var expires_1 = new Date();
            expires_1.setTime(expires_1.getTime() + 5 * 60 * 60 * 1000); // 5시간 후 만료
            setCookie("stocks", defaultStocks, { expires: expires_1 }); // 쿠키에 주식 상태 저장
        }
        else {
            var stocksFromCookie = cookies.stocks || defaultStocks; // 보유 주식
            setStocks(stocksFromCookie); // 보유 주식 업데이트
        }
    }, [data, year]);
    // chartdata 바뀔때만 총자산 수정
    react_1.useEffect(function () {
        // 총 자산 = 현금 + sum(현재년도의 주식 가격 * 해당 주식 보유량)
        var totalAssets = cash + (data ? data.companies.reduce(function (acc, company) {
            var currentPrice = company.data[cookies.year - 2020]; // 현재 가격
            return acc + (currentPrice * (stocks[company.name] || 0));
        }, 0) : 0);
        setTotalAssets(totalAssets); // 총 자산 업데이트
    }, [data, year, cash, stocks]);
    // 주식 구매 함수
    var buyStock = function (companyName, amount, price) {
        var _a;
        var totalCost = price * amount;
        if (totalCost <= cash) {
            var newCash = cash - totalCost;
            var newStocks = __assign(__assign({}, stocks), (_a = {}, _a[companyName] = (stocks[companyName] || 0) + amount, _a));
            setCash(newCash);
            setStocks(newStocks);
            // 쿠키에 현금 및 주식 상태 저장
            var expires = new Date();
            expires.setTime(expires.getTime() + 5 * 60 * 60 * 1000); // 5시간 후 만료
            setCookie("cash", newCash.toString(), { expires: expires });
            setCookie("stocks", JSON.stringify(newStocks), { expires: expires });
        }
        else {
            alert("현금이 부족합니다!");
        }
    };
    // 주식 판매 함수
    var sellStock = function (companyName, amount, price) {
        var _a;
        var ownedAmount = stocks[companyName] || 0;
        if (ownedAmount >= amount) {
            var newCash = cash + price * amount;
            var newStocks = __assign(__assign({}, stocks), (_a = {}, _a[companyName] = ownedAmount - amount, _a));
            setCash(newCash);
            setStocks(newStocks);
            // 쿠키에 현금 및 주식 상태 저장
            var expires = new Date();
            expires.setTime(expires.getTime() + 5 * 60 * 60 * 1000); // 5시간 후 만료
            setCookie("stocks", JSON.stringify(newStocks), { expires: expires });
        }
        else {
            alert("보유 주식 수량이 부족합니다!");
        }
    };
    return (react_1["default"].createElement("div", null,
        react_1["default"].createElement("h1", null, "\uC8FC\uC2DD \uCC28\uD2B8"),
        react_1["default"].createElement("h2", null,
            name,
            " \uB2D8, GETIT 7\uAE30 \uBD80\uC6D0\uC774 \uB418\uC2E0 \uAC83\uC744 \uD658\uC601\uD569\uB2C8\uB2E4!"),
        react_1["default"].createElement("h3", null,
            "\uC9C0\uAE08\uC740... ",
            year,
            "\uB144"),
        chartData ? (react_1["default"].createElement(react_chartjs_2_1.Line, { data: chartData, options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: "주식 차트"
                    },
                    legend: {
                        position: "top"
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            } })) : (react_1["default"].createElement("p", null, "\uCC28\uD2B8 \uB370\uC774\uD130\uB97C \uBD88\uB7EC\uC624\uB294 \uC911...")),
        react_1["default"].createElement("div", null,
            react_1["default"].createElement("h3", null,
                "\uBCF4\uC720 \uD604\uAE08: \u20A9",
                cash.toLocaleString()),
            react_1["default"].createElement("h3", null,
                "\uCD1D \uC790\uC0B0: \u20A9",
                totalAssets.toLocaleString()),
            react_1["default"].createElement("h3", null, "\uBCF4\uC720 \uC8FC\uC2DD:"),
            react_1["default"].createElement("ul", null, chartData === null || chartData === void 0 ? void 0 : chartData.datasets.map(function (dataset) {
                var companyName = dataset.label;
                var currentPrice = dataset.data[dataset.data.length - 1]; // 현재 가격
                return (react_1["default"].createElement("li", { key: companyName },
                    companyName,
                    ": ",
                    stocks[companyName] || 0,
                    " \uC8FC ",
                    currentPrice ? "\u20A9" + (stocks[companyName] * currentPrice).toLocaleString() : "",
                    react_1["default"].createElement("input", { type: "number", name: "number" + companyName, min: "1", defaultValue: "1" }),
                    react_1["default"].createElement("button", { onClick: function () { return sellStock(companyName, parseInt(document.querySelector("input[name=\"number" + companyName + "\"]").value), currentPrice); } }, "\uD310\uB9E4"),
                    react_1["default"].createElement("button", { onClick: function () { return buyStock(companyName, parseInt(document.querySelector("input[name=\"number" + companyName + "\"]").value), currentPrice); } }, "\uAD6C\uB9E4")));
            })))));
};
exports["default"] = UserPage;

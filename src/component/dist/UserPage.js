"use strict";
// WebSocket.tsx
exports.__esModule = true;
var react_1 = require("react");
var react_chartjs_2_1 = require("react-chartjs-2");
var chart_js_1 = require("chart.js");
// Chart.js 컴포넌트 등록
chart_js_1.Chart.register(chart_js_1.CategoryScale, chart_js_1.LinearScale, chart_js_1.PointElement, chart_js_1.LineElement, chart_js_1.Title, chart_js_1.Tooltip, chart_js_1.Legend);
var UserPage = function (_a) {
    var name = _a.name;
    var _b = react_1.useState(null), chartData = _b[0], setChartData = _b[1];
    var rgbdata = [
        "rgb(255, 99, 132)",
        "rgb(54, 162, 235)",
        "rgb(255, 206, 86)",
        "rgb(75, 192, 192)",
        "rgb(153, 102, 255)",
        "rgb(255, 159, 64)",
    ];
    react_1.useEffect(function () {
        var socket = new WebSocket("ws://localhost:5000");
        socket.onmessage = function (event) {
            var receivedData = JSON.parse(event.data);
            console.log("📥 New JSON Received:", receivedData);
            // 2020년부터 year 값까지 데이터를 표시하고 그 이후는 보이지 않도록 필터링
            var labels = ["2020", "2021", "2022", "2023", "2024", "2025", "2026"];
            var visibleData = receivedData.companies.map(function (company) { return company.data.slice(0, receivedData.year - 2019); }); // 첫 번째 인덱스만 표시
            // 차트 데이터 설정
            setChartData({
                labels: labels,
                datasets: receivedData.companies.map(function (company, index) { return ({
                    label: company.name,
                    data: visibleData[index],
                    fill: false,
                    borderColor: rgbdata[index],
                    tension: 0.1
                }); })
            });
        };
        socket.onclose = function () {
            console.log("🔴 WebSocket Disconnected");
        };
        return function () {
            socket.close();
        };
    }, []);
    return (react_1["default"].createElement("div", null,
        react_1["default"].createElement("h1", null, "\uC8FC\uC2DD \uCC28\uD2B8"),
        react_1["default"].createElement("h2", null,
            name,
            " \uB2D8, GETIT 7\uAE30 \uBD80\uC6D0\uC774 \uB418\uC2E0 \uAC83\uC744 \uD658\uC601\uD569\uB2C8\uB2E4!"),
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
            } })) : (react_1["default"].createElement("p", null, "\uCC28\uD2B8 \uB370\uC774\uD130\uB97C \uBD88\uB7EC\uC624\uB294 \uC911..."))));
};
exports["default"] = UserPage;

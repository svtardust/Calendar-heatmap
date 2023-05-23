import { Plugin } from "siyuan";
import axios from "axios";
import * as d3 from "d3";

export default class CalHeatmap extends Plugin {

    async onload() {
        const cal = document.getElementById("calendarHeatmapBtn");
        CalHeatmap.customAddHtml(cal);
        const calendarHeatmapBtn = document.getElementById("calendarHeatmapBtn");
        const openViewHeatmap = document.getElementById("openViewHeatmap");
        const calendarrefresh = document.getElementById("calendarHeatmapRefresh");
        this.customEvent(calendarHeatmapBtn, openViewHeatmap, calendarrefresh);
    }

    private static customAddHtml(cal: HTMLElement) {
        // 
        if (cal === null) {
            const barForward = document.getElementById("barForward");
            barForward.insertAdjacentHTML(
                "afterend",
                '<div id="calendarHeatmapBtn" class="toolbar__item b3-tooltips b3-tooltips__sw" aria-label="calendar-heatmap" >' +
                '<span style="background-color: green;width: 15px;height: 15px;border-radius: 5px"></span></div>'
            );
            barForward.insertAdjacentHTML(
                "afterend",
                `<div data-node-index="1">
                    <div id="openViewHeatmap"
                    style="visibility: hidden;
                        position: fixed;
                        z-index: 10;
                        top: 140px; left: 195px;
                        box-shadow: 0 1px 1px darkgrey;
                        opacity: 1;
                        background-color: white;
                        border: 0;
                        border-radius: 8px;
                        transform: translate(-15%, -50%);
                        overflow: auto;">
                        <div style="width: 1010px; height: 20px;">
                            <div id="customData"
                            style="width: 600px; padding-left: 65px; float: left; 
                            height: -webkit-fill-available;
                            line-height: 45px;
                            font-size: smaller;letter-spacing: 1px;font-weight: lighter;color: #93989f;
                            font-family: -apple-system,sans-serif"Segoe UI","Noto Sans",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji";">
                            </div>
                            <div id="calendarHeatmapRefresh" 
                            class="toolbar__item b3-tooltips b3-tooltips__sw"
                            style="float: left; 
                                    height: 20px; 
                                    width:25px; 
                                    margin-left: 280px; 
                                    line-height: 50px; 
                                    cursor: pointer;
                                    padding-top: 4px;"
                                    aria-label="刷新"
                                    >
                                <svg width="20" height="20" t="1684846732026" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3148" width="200" height="200"><path d="M0 0h1024v1024H0z" fill="#FFFFFF" p-id="3149"></path><path d="M295.3 806.3c-7.2 0-14.4-2.4-20.4-7.3-9-7.5-17.8-15.5-26.1-23.8-34.2-34.2-61-74-79.8-118.3-19.4-45.9-29.3-94.7-29.3-144.9s9.8-99 29.3-144.9c18.7-44.3 45.6-84.1 79.8-118.3 34.2-34.2 74-61 118.3-79.8 45.9-19.4 94.7-29.3 144.9-29.3 17.7 0 32 14.3 32 32s-14.3 32-32 32c-82.3 0-159.7 32.1-217.9 90.3-58.2 58.2-90.3 135.6-90.3 217.9 0 82.3 32.1 159.7 90.3 217.9 6.9 6.9 14.2 13.5 21.7 19.7 13.6 11.3 15.5 31.4 4.3 45.1-6.4 7.7-15.6 11.7-24.8 11.7zM512 884.2c-17.7 0-32-14.3-32-32s14.3-32 32-32c82.3 0 159.7-32.1 217.9-90.3s90.3-135.6 90.3-217.9-32.1-159.7-90.3-217.9c-7.4-7.4-15.2-14.5-23.3-21.1-13.7-11.2-15.7-31.3-4.6-45 11.2-13.7 31.3-15.7 45-4.6 9.8 8 19.2 16.5 28.1 25.4 34.2 34.2 61 74 79.8 118.3 19.4 45.9 29.3 94.7 29.3 144.9s-9.8 99-29.3 144.9c-18.7 44.3-45.6 84.1-79.8 118.3-34.2 34.2-74 61-118.3 79.8-45.8 19.3-94.6 29.2-144.8 29.2z" fill="#B3B3B3" p-id="3150"></path><path d="M518.8 70.8l98.3 98.3c1.6 1.6 1.6 4.1 0 5.7l-98.3 98.3c-2.5 2.5-6.8 0.7-6.8-2.8V73.7c0-3.6 4.3-5.4 6.8-2.9zM505.2 751.2l-98.3 98.3c-1.6 1.6-1.6 4.1 0 5.7l98.3 98.3c2.5 2.5 6.8 0.7 6.8-2.8V754.1c0-3.6-4.3-5.4-6.8-2.9z" fill="#B3B3B3" p-id="3151"></path></svg>
                            </div>
                        </div>
                        <div id="calendarHeatmapContent">
                        </div>
                    </div>
                </div>`
            );
        }
    }

    private customEvent(calendarHeatmapBtn, openViewHeatmap, calendarrefresh) {
        calendarrefresh.addEventListener("click", async (event) => {
            event.stopPropagation();
            localStorage.removeItem("calendar-heatmap-data");
            await this.heatmap();

        })
        calendarHeatmapBtn.addEventListener(
            "click",
            async (event) => {
                event.stopPropagation();
                if (openViewHeatmap.style.visibility === "hidden") {
                    openViewHeatmap.style.visibility = "visible";
                    await this.heatmap();
                } else {
                    openViewHeatmap.style.visibility = "hidden";
                }
            }, false);
        window.addEventListener(
            "click",
            (event) => {
                if (event.clientX <= 50 || event.clientX >= 1048 || event.clientY >= 235) {
                    event.stopPropagation();
                    if (openViewHeatmap.style.visibility === "visible") {
                        openViewHeatmap.style.visibility = "hidden";
                    }
                }
            }, false);
    }

    private async heatmap() {
        const width = 1000;
        const height = 180;
        const margin = 30;
        const weekBoxWidth = 20;
        const monthBoxHeight = 20;
        const con = d3.select("#calendarHeatmapContent");
        con.selectAll("*").remove();
        const svg = con.append("svg").attr("width", width).attr("height", height);
        await this.monthCoordinate(width, margin, weekBoxWidth, svg);
        await this.weekCoordinate(height, margin, monthBoxHeight, svg);
        await this.dateSquares(height, margin, weekBoxWidth, monthBoxHeight, svg);
        await this.localTotal();
    }

    private async monthCoordinate(width, margin, weekBoxWidth, svg) {
        const months = () => {
            const year = new Date().getFullYear();
            const months = [];
            for (let i = 1; i <= 12; i++) {
                const month = year + "-" + i;
                months.push(month);
            }
            return months;
        };
        // 绘制月坐标
        const monthBox = svg
            .append("g")
            .attr(
                "transform",
                "translate(" + (margin + weekBoxWidth) + ", " + margin + ")"
            );
        const monthScale = d3
            .scaleLinear()
            .domain([0, months().length])
            .range([20, width - margin - weekBoxWidth - 20]);
        monthBox
            .selectAll("text")
            .data(months())
            .enter()
            .append("text")
            .text((v) => {
                return v;
            })
            .attr("font-size", "0.9em")
            .attr("font-family", "monospace")
            .attr("fill", "#999")
            .attr("x", (v, i) => {
                return monthScale(i);
            });
    }

    private async weekCoordinate(height, margin, monthBoxHeight, svg) {
        const weeks = ["日", "二", "四", "六"];
        const weekBox = svg
            .append("g")
            .attr(
                "transform",
                "translate(" + (margin - 10) + ", " + (margin + monthBoxHeight) + ")"
            );
        const weekScale = d3
            .scaleLinear()
            .domain([0, weeks.length])
            .range([0, height - margin - monthBoxHeight + 14]);

        weekBox
            .selectAll("text")
            .data(weeks)
            .enter()
            .append("text")
            .text((v) => {
                return v;
            })
            .attr("font-size", "0.85em")
            .attr("fill", "#CCC")
            .attr("y", (v, i) => {
                return weekScale(i);
            });
    }

    private async dateSquares(height, margin, weekBoxWidth, monthBoxHeight, svg) {
        const data = await this.dataChart();
        const cellBox = svg
            .append("g")
            .attr(
                "transform",
                "translate(" + (margin + weekBoxWidth) + ", " + (margin + 10) + ")"
            );
        // 设置方块间距
        const cellMargin = 4;
        // 计算方块大小
        const cellSize =
            (height - margin - monthBoxHeight - cellMargin * 6 - 10) / 7;
        // 方块列计数器
        let cellCol = 0;
        const cell = cellBox
            .selectAll("rect")
            .data(data)
            .enter()
            .append("rect")
            .attr("width", cellSize)
            .attr("height", cellSize)
            .attr("rx", 3)
            .attr("fill", function (d) {
                if (d.total === undefined || d.total === 0) {
                    return "#ebedf0";
                }
                let total = d.total;
                if (total > 0) {
                    if (total <= 30) {
                        return "#9be9a8"
                    } else if (total <= 70) {
                        return "#40c463"
                    } else if (total <= 120) {
                        return "#30a14e"
                    }
                    return "#216e39";
                }
                return "#ebedf0";
            })
            .attr("x", (v, i) => {
                if (i % 7 === 0) {
                    cellCol++;
                }
                const x = (cellCol - 1) * cellSize;
                return cellCol > 1 ? x + cellMargin * (cellCol - 1) : x;
            })
            .attr("y", (v, i) => {
                const y = i % 7;
                return y > 0 ? y * cellSize + cellMargin * y : y * cellSize;
            })
            .style("cursor", "pointer");
        // 日期方块添加鼠标移入时的数据提示
        cell.append("title").text((d) => {
            let message = "没有内容块";
            if (d.total != 0) {
                message = "有 " + d.total + "个内容块";
            }
            return d.day + "\n" + message;
        });

    }

    private async dataChart() {
        let data = [];
        // 获去当前年
        const date = new Date();
        const year = date.getFullYear();
        const localDay = year + "-" + (date.getMonth() + 1) + "-" + date.getDate();
        const heatmapData = JSON.parse(
            localStorage.getItem("calendar-heatmap-data")
        );
        if (
            heatmapData === null ||
            new Date(localDay) > new Date(heatmapData.now)
        ) {
            await this.formatDate(year, localDay, data);
        } else {
            const heatmapDate = heatmapData.now;
            const count = await this.queryCount(
                year,
                date.getMonth() + 1,
                date.getDate()
            );
            const arrData = heatmapData.data;
            const newData = [];
            data.slice(0, data.length);
            for (let i = 0; i < arrData.length; i++) {
                if (arrData[i].day === heatmapDate) {
                    newData.push({ day: arrData[i].day, total: count });
                } else {
                    newData.push(arrData[i]);
                }
            }
            data = newData;
        }
        localStorage.setItem(
            "calendar-heatmap-data",
            JSON.stringify({ data, now: localDay })
        );
        return data;
    }

    private async formatDate(year: number, localDay: string, data: any[]) {
        for (let index = 0; index < 12; index++) {
            const month = index + 1;
            const monthNumber = new Date(year, month, 0).getDate();
            for (let index = 1; index < monthNumber + 1; index++) {
                const day = year + "-" + month + "-" + index;
                if (new Date(day) > new Date(localDay)) {
                    data.push({ day, total: 0 });
                } else {
                    const total = await this.queryCount(year, month, index);
                    data.push({ day, total: total === 0 ? 0 : total });
                }
            }
        }
        return data;
    }

    private async queryCount(year: number, month: number, day: number) {
        const dateStr =
            year.toString() +
            (month < 10 ? "0" + month.toString() : month.toString()) +
            (day < 10 ? "0" + day.toString() : day.toString());
        const sql =
            "SELECT count(*) AS count FROM blocks WHERE type = 'p' AND created like +'" +
            dateStr +
            "%'";
        const sqlData = { stmt: sql };
        return await axios
            .post("/api/query/sql", sqlData)
            .then(function (response) {
                return response.data.data[0].count;
            });
    }


    private async localTotal() {
        const date = new Date();
        const day = date.getFullYear() + "年" + (date.getMonth() + 1) + "月" + date.getDate() + "日";
        const count = await this.queryCount(date.getFullYear(), (date.getMonth() + 1), date.getDate());
        document.getElementById("customData").innerText = "今日" + day + "，共创建" + count + "个内容块";

    }
}

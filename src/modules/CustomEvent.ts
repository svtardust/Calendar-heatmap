import { heatmap } from "./Heatmap";

export function customEvent() {
    const openViewHeatmap = document.getElementById("openViewHeatmap");

    async function calendarrefresh(event) {
        event.stopPropagation();
        localStorage.removeItem("calendar-heatmap-data");
        await heatmap();
    }

    async function eventHeatmapButton(event) {
        event.stopPropagation();
        if (openViewHeatmap.style.visibility === "hidden") {
            openViewHeatmap.style.visibility = "visible";
            await heatmap();
        } else {
            openViewHeatmap.style.visibility = "hidden";
        }
    }

    function windowRadiusClose(event) {
        if (event.clientX <= 50 || event.clientX >= 1048 || event.clientY >= 235) {
            event.stopPropagation();
            if (openViewHeatmap.style.visibility === "visible") {
                openViewHeatmap.style.visibility = "hidden";
            }
        }
    }
    document.getElementById("calendarHeatmapRefresh").addEventListener("click", calendarrefresh);
    document.getElementById("calendarHeatmapBtn").addEventListener("click", eventHeatmapButton);

    window.addEventListener("click", windowRadiusClose);
}

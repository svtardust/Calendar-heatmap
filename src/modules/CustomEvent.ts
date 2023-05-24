import { heatmap } from "./Heatmap";

export function customEvent(){
  const calendarHeatmapBtn = document.getElementById("calendarHeatmapBtn");
  const openViewHeatmap = document.getElementById("openViewHeatmap");
  const calendarrefresh = document.getElementById("calendarHeatmapRefresh");
  
  calendarrefresh.addEventListener("click", async (event) => {
      event.stopPropagation();
      localStorage.removeItem("calendar-heatmap-data");
      await heatmap();

  })
  calendarHeatmapBtn.addEventListener(
      "click",
      async (event) => {
          event.stopPropagation();
          if (openViewHeatmap.style.visibility === "hidden") {
              openViewHeatmap.style.visibility = "visible";
              await heatmap();
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

import {fetchPost} from "siyuan";

export function getData() {
  return new Promise((resolve) => {
    fetchPost("/api/file/getFile", {path: `/data/storage/petal/Calendar-heatmap/config.json`}, (response) => {
      resolve(response);
    });
  });
}

export function saveData(data) {
  return new Promise((resolve) => {
    const pathString = `/data/storage/petal/Calendar-heatmap/config.json`;
    const file = new File([new Blob([data])], pathString.split("/").pop());
    const formData = new FormData();
    formData.append("path", pathString);
    formData.append("file", file);
    formData.append("isDir", "false");
    fetchPost("/api/file/putFile", formData, (response) => {
      resolve(response);
    });
  });
}

export async function getColor() {
  let color = []
  const {customColor, lightColor, darkColor} = await getData()
  if (customColor.length != 0 && customColor.length === 5) {
    color = customColor
  } else {
    // @ts-ignore
    if (siyuan.config.appearance.mode === 0) {
      color = lightColor
    } else {
      color = darkColor
    }
  }
  return color
}
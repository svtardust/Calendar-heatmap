import { fetchPost } from 'siyuan';

export function getData() {
  return new Promise((resolve) => {
    fetchPost('/api/file/getFile', { path: `/data/storage/petal/Calendar-heatmap/config.json` }, (response) => {
      resolve(response);
    });
  });
}

export function saveData(data) {
  return new Promise((resolve) => {
    const pathString = `/data/storage/petal/Calendar-heatmap/config.json`;
    const file = new File([new Blob([data])], pathString.split('/').pop());
    const formData = new FormData();
    formData.append('path', pathString);
    formData.append('file', file);
    formData.append('isDir', 'false');
    fetchPost('/api/file/putFile', formData, (response) => {
      resolve(response);
    });
  });
}

export async function getColor() {
  let color = [];
  // @ts-ignore
  const { customColor, lightColor, darkColor } = await getData();
  if (customColor && customColor.length === 5) {
    color = customColor;
  } else {
    // 亮色系
    const defaultLightColors = [
      '#ebedf0',  // 最浅，无数据
      '#9be9a8',  // 少量数据
      '#40c463',  // 中等数据
      '#30a14e',  // 较多数据
      '#216e39'   // 大量数据
    ];
    
    // 暗色系
    const defaultDarkColors = [
      '#2d333b',  // 最浅，无数据
      '#0e4429',  // 少量数据
      '#006d32',  // 中等数据
      '#26a641',  // 较多数据
      '#39d353'   // 大量数据
    ];

    // @ts-ignore
    const isLight = siyuan.config.appearance.mode === 0;
    color = isLight 
      ? (lightColor || defaultLightColors)
      : (darkColor || defaultDarkColors);
  }
  return color;
}
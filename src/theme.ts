export function colors() {
  let data: any[]
  // @ts-ignore
  if (siyuan.config.appearance.mode === 0) {
    data = ['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39']
  } else {
    data = ['#161B22', '#0E4429', '#006D32', '#26A641', '#39D353']
  }
  return data
}
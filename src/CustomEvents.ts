// @ts-nocheck
import { Dialog } from 'siyuan'
import { heatmap, queryCount } from './Heatmap'
import { settingElement } from './CustomElement'

/**
 * 加载数据，填充图区
 */
export async function loadData() {
  // 填充热力图
  await heatmap()
  // 填充今日统计区域
  await statisticalRegionData()
  // 刷新事件监听
  document.getElementById('calendarHeatmapRefresh').addEventListener('click', calendarHeatmapRefresh)
}

/**
 * 设置
 */
export function setting() {
  const dialog = new Dialog({
    title: '日历热力图设置',
    content: settingElement,
    width: '800px',
    height: '400px',
  })
  const localConfig = localStorage.getItem('calendar-heatmap-config')
  if (localConfig != null) {
    const { isdailyNote, ignore } = JSON.parse(localConfig)
    document.getElementById('calendarHeatmapConfigCheckbox')['checked'] = isdailyNote
    if (ignore != null) {
      document.getElementById('calendarHeatmapConfigText')['value'] = ignore
    }
  }
  dialog.element.querySelector('#calendarHeatmapConfigCheckbox').addEventListener('click', calendarHeatmapConfigCheckd)
  dialog.element.querySelector('#calendarHeatmapConfigText').addEventListener('input', calendarHeatmapConfigtextarea)
}

async function statisticalRegionData() {
  const date = new Date()
  const day = date.getFullYear() + '年' + (date.getMonth() + 1) + '月' + date.getDate() + '日'
  const count = await queryCount(date.getFullYear(), date.getMonth() + 1, date.getDate()
  )
  document.getElementById('StatisticalRegion').innerText = `今日${day},共创建${count}个内容块`
}


async function calendarHeatmapRefresh(this: HTMLElement) {
  localStorage.removeItem('calendar-heatmap-data')
  await heatmap();
}

function calendarHeatmapConfigCheckd(event: any) {
  const checked = event.target.checked
  if (checked) {
    localStorage.setItem('calendar-heatmap-config', JSON.stringify({ isdailyNote: true }))
    document.getElementById('calendarHeatmapConfigCheckbox')['checked'] = true
    document.getElementById('calendarHeatmapConfigText')['value'] = ''
  } else {
    localStorage.setItem('calendar-heatmap-config', JSON.stringify({ isdailyNote: false }))
    document.getElementById('calendarHeatmapConfigCheckbox')['checked'] = false
  }

}

function calendarHeatmapConfigtextarea(event: any) {
  const text = event.target.value
  if (text != null) {
    document.getElementById('calendarHeatmapConfigCheckbox')['checked'] = false
    localStorage.setItem('calendar-heatmap-config', JSON.stringify({ checked: false, ignore: text }))
  }
}

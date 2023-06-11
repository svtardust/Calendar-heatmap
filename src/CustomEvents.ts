// @ts-nocheck
import { Dialog } from 'siyuan'
import { heatmap } from './Heatmap'
import { settingElement } from './CustomElement'
import axios from 'axios'

/**
 * 加载数据，填充图区
 */
export async function loadData() {
  // 填充热力图
  await heatmap()
  // 填充今日统计区域
  await statisticalRegionData()
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

  const createSql = `SELECT count(*) AS count FROM blocks WHERE type = 'p' AND created > strftime('%Y%m%d','now','localtime')`
  const updateSql = `SELECT count(*) AS count FROM blocks WHERE type = 'p' AND updated > strftime('%Y%m%d','now','localtime') AND length <> 0`
  const createCount = await (await axios.post('/api/query/sql', { stmt: createSql })).data.data[0].count
  const updateCount = (await axios.post('/api/query/sql', { stmt: updateSql })).data.data[0].count
  document.getElementById('StatisticalRegion').innerText = `今日${day},共创建${createCount}个内容块，共修改${updateCount}个内容块`
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

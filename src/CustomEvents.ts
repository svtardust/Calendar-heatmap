import {Dialog} from 'siyuan'
import {heatmap} from './Heatmap'
import {settingElement} from './CustomElement'
import axios from 'axios'
import {getData, saveData} from "./utils";

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
export async function setting() {
  const dialog = new Dialog({
    title: '日历热力图设置',
    content: settingElement,
    width: '800px',
    height: '400px',
  })
  const {isdailyNote, heatmapPosition, ignoreText} = await getData()
  document.getElementById('calendarHeatmapConfigCheckbox')['checked'] = isdailyNote
  document.getElementById('calendarHeatmapConfigPosition')['checked'] = heatmapPosition
  if (ignoreText != null) {
    document.getElementById('calendarHeatmapConfigText')['value'] = ignoreText
  }
  dialog.element.querySelector('#calendarHeatmapConfigCheckbox').addEventListener('click', calendarHeatmapConfigCheckd)
  dialog.element.querySelector('#calendarHeatmapConfigText').addEventListener('input', calendarHeatmapConfigtextarea)
  dialog.element.querySelector('#calendarHeatmapConfigPosition').addEventListener('click', calendarHeatmapConfigPosition)
}

async function statisticalRegionData() {
  const date = new Date()
  const day = `${date.getFullYear()}年${(date.getMonth() + 1)}月${date.getDate()}日`

  const createSql = `SELECT count(*) AS count FROM blocks WHERE type = 'p' AND created > strftime('%Y%m%d','now','localtime')`
  const updateSql = `SELECT count(*) AS count FROM blocks WHERE type = 'p' AND updated > strftime('%Y%m%d','now','localtime') AND length <> 0`
  const createCount = await (await axios.post('/api/query/sql', {stmt: createSql})).data.data[0].count
  const updateCount = (await axios.post('/api/query/sql', {stmt: updateSql})).data.data[0].count
  document.getElementById('StatisticalRegion').innerText = `今日${day},共创建${createCount}个内容块，共修改${updateCount}个内容块`
}

async function calendarHeatmapConfigPosition(event) {
  const checked = event.target.checked
  const heatmapConfig = await getData()
  if (checked) {
    heatmapConfig.heatmapPosition = true
    await saveData(JSON.stringify(heatmapConfig))
    document.getElementById('calendarHeatmapConfigPosition')['checked'] = true
  } else {
    heatmapConfig.heatmapPosition = false
    await saveData(JSON.stringify(heatmapConfig))
    document.getElementById('calendarHeatmapConfigPosition')['checked'] = false
  }
}

async function calendarHeatmapConfigCheckd(event) {
  const checked = event.target.checked
  const heatmapConfig = await getData()
  if (checked) {
    heatmapConfig.isdailyNote = true
    heatmapConfig.ignoreText = ''
    document.getElementById('calendarHeatmapConfigCheckbox')['checked'] = true
    document.getElementById('calendarHeatmapConfigText')['value'] = ''
    await saveData(JSON.stringify(heatmapConfig))
  } else {
    heatmapConfig.isdailyNote = false
    document.getElementById('calendarHeatmapConfigCheckbox')['checked'] = false
    await saveData(JSON.stringify(heatmapConfig))
  }

}

async function calendarHeatmapConfigtextarea(event) {
  const text = event.target.value
  const heatmapConfig = await getData()
  if (text != null) {
    heatmapConfig.isdailyNote = false
    heatmapConfig.ignoreText = text
    document.getElementById('calendarHeatmapConfigCheckbox')['checked'] = false
    await saveData(JSON.stringify(heatmapConfig))
  }
}

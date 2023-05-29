import { Dialog } from 'siyuan'
import { addSettingElement } from './CustomElement'
import { calendarHeatmapConfig } from './CustomEvent'

export function config() {
  const dialog = new Dialog({
    title: '日历热力图设置',
    content: addSettingElement,
    width: '800px',
    height: '400px',
  })
  calendarHeatmapConfig(dialog)
  const localConfig = localStorage.getItem('calendar-heatmap-config')
  if (localConfig != null) {
    const { isdailyNote, ignore } = JSON.parse(localConfig)
    document.getElementById('calendarHeatmapConfigCheckbox').checked = isdailyNote
    if (ignore != null) {
      document.getElementById('calendarHeatmapConfigText').value = ignore
    }
  }
}
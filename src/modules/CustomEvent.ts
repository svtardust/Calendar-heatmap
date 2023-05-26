import { heatmap } from './Heatmap'

const localConfig = localStorage.getItem('calendar-heatmap-config')

const calendarHeatmaprefresh = async (event) => {
  event.stopPropagation()
  localStorage.removeItem('calendar-heatmap-data')
  await heatmap()
}

const calendarHeatmapButton = async (event) => {
  event.stopPropagation()
  const openViewHeatmap = document.getElementById('openViewHeatmap')

  if (openViewHeatmap.style.visibility === 'hidden') {
    openViewHeatmap.style.visibility = 'visible'
    await heatmap()
  } else {
    openViewHeatmap.style.visibility = 'hidden'
  }
}

const windowRadiusClose = (event) => {
  if (event.clientX <= 50 || event.clientX >= 1048 || event.clientY >= 235) {
    event.stopPropagation()
    const openViewHeatmap = document.getElementById('openViewHeatmap')
    if (openViewHeatmap.style.visibility === 'visible') {
      openViewHeatmap.style.visibility = 'hidden'
    }
  }
}

const calendarHeatmapConfigCheckd = (event) => {
  const checked = event.target.checked
  if (checked) {
    if (localConfig === null || localConfig === undefined) {
      localStorage.setItem('calendar-heatmap-config', JSON.stringify({ isdailyNote: true }))
    } else {
      const { ignore } = JSON.parse(localConfig)
      localStorage.setItem('calendar-heatmap-config', JSON.stringify({ isdailyNote: true, ignore }))
    }
    document.getElementById('calendarHeatmapConfigCheckbox').checked = true
  } else {
    if (localConfig === null || localConfig === undefined) {
      localStorage.setItem('calendar-heatmap-config', JSON.stringify({ isdailyNote: false }))
    } else {
      const { ignore } = JSON.parse(localConfig)
      localStorage.setItem('calendar-heatmap-config', JSON.stringify({ isdailyNote: false, ignore }))
    }
    document.getElementById('calendarHeatmapConfigCheckbox').checked = false
  }
}

const calendarHeatmapConfigtextarea = (event) => {
  const text = event.target.value
  if (text != null) {
    // https://github.com/svtardust/Calendar-heatmap/issues/9
    document.getElementById('calendarHeatmapConfigCheckbox').checked = false
    localStorage.setItem('calendar-heatmap-config', JSON.stringify({ checked: false, ignore: text }))
  }
}

export const calendarHeatmapConfig = (dialog) => {
  dialog.element.querySelector('#calendarHeatmapConfigCheckbox').addEventListener('click', calendarHeatmapConfigCheckd)
  dialog.element.querySelector('#calendarHeatmapConfigText').addEventListener('input', calendarHeatmapConfigtextarea)
}

export function addEvent() {
  document.getElementById('calendarHeatmapButton').addEventListener('click', calendarHeatmapButton)
  document.getElementById('calendarHeatmapRefresh').addEventListener('click', calendarHeatmaprefresh)
  window.addEventListener('click', windowRadiusClose)
}

export function removeEvent() {
  window.removeEventListener('click', windowRadiusClose)
  document.getElementById('calendarHeatmapConfigCheckbox').removeEventListener('click', calendarHeatmapConfigCheckd)
  document.getElementById('calendarHeatmapConfigText').removeEventListener('input', calendarHeatmapConfigtextarea)
  document.getElementById('calendarHeatmapRefresh').removeEventListener('click', calendarHeatmaprefresh)
  document.getElementById('calendarHeatmapButton').removeEventListener('click', calendarHeatmapButton)
}

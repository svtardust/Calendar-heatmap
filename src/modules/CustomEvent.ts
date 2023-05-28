import { heatmap } from './Heatmap'

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
    localStorage.setItem('calendar-heatmap-config', JSON.stringify({ isdailyNote: true }))
    document.getElementById('calendarHeatmapConfigCheckbox').checked = true
    document.getElementById('calendarHeatmapConfigText').value = ''
  } else {
    localStorage.setItem('calendar-heatmap-config', JSON.stringify({ isdailyNote: false }))
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
  document.getElementById('calendarHeatmapRefresh').removeEventListener('click', calendarHeatmaprefresh)
  document.getElementById('calendarHeatmapButton').removeEventListener('click', calendarHeatmapButton)
}

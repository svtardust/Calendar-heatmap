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
  const config = JSON.parse(localStorage.getItem('calendar-heatmap-config'))
  if (checked) {
    if (config === null) {
      localStorage.setItem('calendar-heatmap-config', JSON.stringify({ isdailyNote: true }))
    } else {
      const { ignore } = config
      console.log(ignore)
      localStorage.setItem('calendar-heatmap-config', JSON.stringify({ isdailyNote: true, ignore }))
    }
  } else {
    if (config === null) {
      localStorage.setItem('calendar-heatmap-config', JSON.stringify({ isdailyNote: false }))
    } else {
      const { ignore } = config
      localStorage.setItem('calendar-heatmap-config', JSON.stringify({ isdailyNote: false, ignore }))
    }
  }
}
export const calendarHeatmapConfig = (dialog) => {
  dialog.element.querySelector('#calendarHeatmapConfigCheckbox').addEventListener('click', calendarHeatmapConfigCheckd)
}

export function addEvent() {
  document.getElementById('calendarHeatmapButton').addEventListener('click', calendarHeatmapButton)
  document.getElementById('calendarHeatmapRefresh').addEventListener('click', calendarHeatmaprefresh)
  window.addEventListener('click', windowRadiusClose)
}

export function removeEvent() {
  window.removeEventListener('click', windowRadiusClose)
  document.getElementById('calendarHeatmapRefresh').addEventListener('click', calendarHeatmaprefresh)
  document.getElementById('calendarHeatmapButton').removeEventListener('click', calendarHeatmapButton)
}

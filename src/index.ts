import { Plugin } from 'siyuan'
import { addcalendarHeatmapButtonElement, addcalendarHeatmapViewElement, removeElement } from './modules/CustomElement'
import { addEvent, removeEvent } from './modules/CustomEvent'
import { removeLocalData } from './modules/Heatmap'
import { config } from './modules/CustomConfig'
import { onLoadData } from './modules/Heatmap'


export default class CalHeatmap extends Plugin {
  onload() {
    addcalendarHeatmapButtonElement()
    addcalendarHeatmapViewElement()
    addEvent()
    onLoadData()
  }

  onunload() {
    removeEvent()
    removeElement()
    removeLocalData()
  }

  openSetting() {
    config()
  }
}

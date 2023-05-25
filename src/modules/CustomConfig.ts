import { Dialog } from 'siyuan'
import { addSettingElement } from './CustomElement'

export function config() {
  const dialog = new Dialog({
    title: this.name,
    content: addSettingElement,
    width: '900px',
    height: '600px',
  })
}

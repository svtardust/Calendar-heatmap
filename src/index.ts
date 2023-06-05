import { Menu, Plugin } from 'siyuan'
import { viewElement } from './CustomElement'
import { loadData, setting } from './CustomEvents'

/**
 * 思源笔记-日历热力图插件
 */
module.exports = class CalendarHeatmap extends Plugin {
  /**
   * 插件入口
   */
  onload(): void {
    this.addTopBar({
      icon: `<svg height=15 width=15 style='background-color: green;border-radius: 5px'></svg>`,
      title: '日历热力图',
      position: 'left',
      callback: (evt) => {
        addOpenView(evt)
      },
    })
  }
  /**
   * 设置窗口
   */
  openSetting(): void {
    setting()
  }
}

/**
 * 热力图显示区域
 * @param evt 鼠标事件
 */
function addOpenView(evt: MouseEvent) {
  const menu = new Menu()
  // 加载图区
  menu.addItem({ element: viewElement() })
  // 修改图区背景色为白色
  document.getElementById('openViewElement').parentElement.style.backgroundColor = '#FFFFFF'
  // 取消小手图标
  document.getElementById('openViewElement').parentElement.style.cursor = 'auto'
  document.getElementById('openViewElement').parentElement.style.height = '220px'
  // 加载数据
  loadData()
  menu.open({
    x: evt.x - 40,
    y: evt.y,
  })
}

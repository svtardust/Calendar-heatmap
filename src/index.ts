import { Menu, Plugin } from 'siyuan';
import { viewElement } from './CustomElement';
import { loadData, setting } from './CustomEvents';

/**
 * 思源笔记-日历热力图插件
 */
export default class CalendarHeatmap extends Plugin {
  /**
   * 插件入口
   */
  async onload() {
    const defaultConfig = {
      lightColor: ['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39'],
      darkColor: ['#161B22', '#0E4429', '#006D32', '#26A641', '#39D353'],
      customColor: [],
      // 是否只统计日记
      isdailyNote: false,
      // 是否显示在左侧
      heatmapPosition: false,
      // 忽略文件
      ignoreText: '',
    };
    let heatPosition: 'right' | 'left' = 'right';
    const heatmapConfig = await this.loadData('config.json');
    if (heatmapConfig === null || heatmapConfig === '') {
      await this.saveData('config.json', JSON.stringify(defaultConfig));
    } else {
      const { heatmapPosition } = heatmapConfig;
      if (heatmapPosition === true) {
        heatPosition = 'left';
      }
    }
    this.addTopBar({
      icon: `<svg t='1685958379791' class='icon' viewBox='0 0 1024 1024' version='1.1' xmlns='http://www.w3.org/2000/svg' p-id='660' width='16' height='16'><path d='M57.094244 943.953171V1.998049H0v999.02439h999.02439v-57.069268z' fill='#469c4b' p-id='661'></path><path d='M199.804878 144.708683m-57.094244 0a57.094244 57.094244 0 1 0 114.188488 0 57.094244 57.094244 0 1 0-114.188488 0Z' fill='#469c4b' p-id='662'></path><path d='M713.578146 144.708683m-57.094244 0a57.094244 57.094244 0 1 0 114.188488 0 57.094244 57.094244 0 1 0-114.188488 0Z' fill='#469c4b' p-id='663'></path><path d='M913.383024 144.708683m-57.094244 0a57.094244 57.094244 0 1 0 114.188488 0 57.094244 57.094244 0 1 0-114.188488 0Z' fill='#469c4b' p-id='664'></path><path d='M456.679024 144.708683m-114.163512 0a114.163512 114.163512 0 1 0 228.327025 0 114.163512 114.163512 0 1 0-228.327025 0Z' fill='#469c4b' p-id='665'></path><path d='M199.804878 772.670439m-57.094244 0a57.094244 57.094244 0 1 0 114.188488 0 57.094244 57.094244 0 1 0-114.188488 0Z' fill='#469c4b' p-id='666'></path><path d='M656.483902 772.670439m-57.094243 0a57.094244 57.094244 0 1 0 114.188487 0 57.094244 57.094244 0 1 0-114.188487 0Z' fill='#469c4b' p-id='667'></path><path d='M428.156878 772.670439m-85.641366 0a85.641366 85.641366 0 1 0 171.282732 0 85.641366 85.641366 0 1 0-171.282732 0Z' fill='#469c4b' p-id='668'></path><path d='M884.835902 772.670439m-114.163512 0a114.163512 114.163512 0 1 0 228.327025 0 114.163512 114.163512 0 1 0-228.327025 0Z' fill='#469c4b' p-id='669'></path><path d='M199.804878 458.702049m-57.094244 0a57.094244 57.094244 0 1 0 114.188488 0 57.094244 57.094244 0 1 0-114.188488 0Z' fill='#469c4b' p-id='670'></path><path d='M913.383024 458.702049m-57.094244 0a57.094244 57.094244 0 1 0 114.188488 0 57.094244 57.094244 0 1 0-114.188488 0Z' fill='#469c4b' p-id='671'></path><path d='M713.578146 458.702049m-85.641366 0a85.641366 85.641366 0 1 0 171.282732 0 85.641366 85.641366 0 1 0-171.282732 0Z' fill='#469c4b' p-id='672'></path></svg>`,
      title: '日历热力图',
      position: heatPosition,
      callback: async (evt) => {
        await addOpenView(evt, this.app);
      },
    });
  }

  /**
   * 设置窗口
   */
  async openSetting() {
    await setting();
  }
}

/**
 * 热力图显示区域
 * @param evt 鼠标事件
 */
async function addOpenView(evt: MouseEvent, app) {
  const menu = new Menu('Calendar-heatmap');
  // 加载图区
  menu.addItem({ element: await viewElement() });
  // 修改图区背景色 0亮色，1 暗色
  // @ts-ignore
  document.getElementById('openViewElement').parentElement.style.backgroundColor = `${siyuan.config.appearance.mode === 0 ? '#FFFFFF' : '#0D1117'}`;
  // 此处解决与某些主题不适配问题
  document.getElementById('openViewElement').parentElement.style.height = '168px';
  // 取消小手图标
  document.getElementById('openViewElement').parentElement.style.cursor = 'auto';
  // 取消默认边距，边框
  document.getElementById('openViewElement').parentElement.parentElement.parentElement.style.padding = '0px';
  document.getElementById('openViewElement').parentElement.parentElement.parentElement.style.border = '0px';
  // 加载数据
  await loadData(app);
  menu.open({
    x: evt.x,
    y: evt.y,
  });
}

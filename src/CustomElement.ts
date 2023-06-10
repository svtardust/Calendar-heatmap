/**
 * 绘制图区
 * @returns element
 */
export function viewElement() {
  // 包裹图层
  const divElement = document.createElement('div')
  divElement.setAttribute('id', 'openViewElement')
  divElement.setAttribute('style','background-color: white;')
  // 文字显示及图标刷新区域
  const topElement = document.createElement('div')
  topElement.setAttribute('style', 'height:30px;')
  // 今日块统计区域
  const topLeftElement = document.createElement('div')
  topLeftElement.setAttribute('id', 'StatisticalRegion')
  topLeftElement.setAttribute('style', 'width: 600px; padding-left: 50px; float: left; font-size: inherit; letter-spacing: 1px; font-weight: lighter; color: #93989f;')
  topElement.appendChild(topLeftElement)
  divElement.appendChild(topElement)

  // 热力图显示区域
  const calendarHeatmapContent = document.createElement('div')
  calendarHeatmapContent.setAttribute('id', 'calendarHeatmapContent')
  divElement.appendChild(calendarHeatmapContent)
  return divElement
}

export const settingElement = `<div class='config__tab-container' id='heatmapSettingsDialog'>
                                  <lable class='fn__flex b3-label'>
                                    <div class='fn__flex-1'>
                                    日记
                                      <div class='b3-label__text'>启用后将只统计当年归属于daily note中的内容块</div>
                                      <span class='fn__space'></span>
                                    </div>
                                    <input class='b3-switch fn__flex-center' id='calendarHeatmapConfigCheckbox' type='checkbox'>
                                  </lable>
                                  <label class='b3-label fn__flex'>
                                    <div class='fn__flex-1'>
                                      忽略统计文件
                                      <div class='b3-label__text'>请输入所需忽略的文件,并用英文逗号隔开</div>
                                      <div class='fn__hr'></div>
                                      <textarea class='b3-text-field fn__block' 
                                                id='calendarHeatmapConfigText' 
                                                style='height: 50px;' placeholder='请输入需要忽略的文档全名称,并且用逗号隔开'></textarea>
                                    </div>
                                  </label>
                                </div>`

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
  // 刷新按钮区域
  const topRightElement = document.createElement('div')
  topRightElement.setAttribute('id', 'calendarHeatmapRefresh')
  topRightElement.setAttribute('style', 'margin-top: 15px;margin-right: 20px; cursor: pointer; width: 20px; height: 20px;float:right;')
  topRightElement.insertAdjacentHTML('afterbegin', `<svg width="20" height="20" t="1685678708644" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="8426"><path d="M887.8 394.8H719.3c-21.5 0-38.9-17.4-38.9-38.9s17.4-38.9 38.9-38.9H787c-61-86.2-161.3-142.5-275-142.5-186.1 0-336.9 150.8-336.9 336.9 0 186.1 150.8 336.9 336.9 336.9 186 0 336.9-150.8 336.9-336.9 0-21.5 17.4-38.9 38.9-38.9s38.9 17.4 38.9 38.9C926.7 740.4 741 926 512 926S97.4 740.4 97.4 511.4C97.4 282.4 283 96.8 512 96.8c139 0 261.7 68.5 336.9 173.5v-69.8c0-21.5 17.4-38.9 38.9-38.9s38.9 17.4 38.9 38.9V356c0 21.4-17.5 38.8-38.9 38.8z m0 0" fill="#333333" p-id="8427"></path></svg>`)
  topElement.appendChild(topRightElement)
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

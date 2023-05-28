export function addcalendarHeatmapButtonElement() {
  if (document.getElementById('calendarHeatmapButton') === null) {
    document.getElementById('barForward').insertAdjacentHTML(
      'afterend',
      `<div id="calendarHeatmapButton" class="toolbar__item b3-tooltips b3-tooltips__sw" aria-label="calendar-heatmap" >
          <span style="background-color: green;width: 15px;height: 15px;border-radius: 5px"></span>
        </div>`
    )
  }
}

export function addcalendarHeatmapViewElement() {
  if (document.getElementById('openViewHeatmap') === null) {
    document.getElementById('barForward').insertAdjacentHTML(
      'afterend',
      `<div id="openViewHeatmap"
          style="
            visibility: hidden;
            position: fixed;
            z-index: 10;
            top: 140px; left: 195px;
            box-shadow: 0 1px 1px darkgrey;
            opacity: 1;
            background-color: white;
            border: 0;
            border-radius: 8px;
            transform: translate(-15%, -50%);
            overflow: auto;">
            <div style="width: 1010px; height: 20px;">
                <div id="customData"
                style="width: 600px; padding-left: 65px; float: left; 
                height: -webkit-fill-available;
                line-height: 45px;
                font-size: smaller;letter-spacing: 1px;font-weight: lighter;color: #93989f;
                font-family: -apple-system,sans-serif"Segoe UI","Noto Sans",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji";">
                </div>
                <div id="calendarHeatmapRefresh" 
                style="float: left; 
                        height: 25px; 
                        width:25px; 
                        margin-left: 280px; 
                        line-height: 50px; 
                        cursor: pointer;
                        padding-top: 4px;"
                        aria-label="刷新"
                        >
                      <svg width="20" height="20" t="1684846732026" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3148" width="200" height="200"><path d="M0 0h1024v1024H0z" fill="#FFFFFF" p-id="3149"></path><path d="M295.3 806.3c-7.2 0-14.4-2.4-20.4-7.3-9-7.5-17.8-15.5-26.1-23.8-34.2-34.2-61-74-79.8-118.3-19.4-45.9-29.3-94.7-29.3-144.9s9.8-99 29.3-144.9c18.7-44.3 45.6-84.1 79.8-118.3 34.2-34.2 74-61 118.3-79.8 45.9-19.4 94.7-29.3 144.9-29.3 17.7 0 32 14.3 32 32s-14.3 32-32 32c-82.3 0-159.7 32.1-217.9 90.3-58.2 58.2-90.3 135.6-90.3 217.9 0 82.3 32.1 159.7 90.3 217.9 6.9 6.9 14.2 13.5 21.7 19.7 13.6 11.3 15.5 31.4 4.3 45.1-6.4 7.7-15.6 11.7-24.8 11.7zM512 884.2c-17.7 0-32-14.3-32-32s14.3-32 32-32c82.3 0 159.7-32.1 217.9-90.3s90.3-135.6 90.3-217.9-32.1-159.7-90.3-217.9c-7.4-7.4-15.2-14.5-23.3-21.1-13.7-11.2-15.7-31.3-4.6-45 11.2-13.7 31.3-15.7 45-4.6 9.8 8 19.2 16.5 28.1 25.4 34.2 34.2 61 74 79.8 118.3 19.4 45.9 29.3 94.7 29.3 144.9s-9.8 99-29.3 144.9c-18.7 44.3-45.6 84.1-79.8 118.3-34.2 34.2-74 61-118.3 79.8-45.8 19.3-94.6 29.2-144.8 29.2z" fill="#B3B3B3" p-id="3150"></path><path d="M518.8 70.8l98.3 98.3c1.6 1.6 1.6 4.1 0 5.7l-98.3 98.3c-2.5 2.5-6.8 0.7-6.8-2.8V73.7c0-3.6 4.3-5.4 6.8-2.9zM505.2 751.2l-98.3 98.3c-1.6 1.6-1.6 4.1 0 5.7l98.3 98.3c2.5 2.5 6.8 0.7 6.8-2.8V754.1c0-3.6-4.3-5.4-6.8-2.9z" fill="#B3B3B3" p-id="3151"></path></svg>
                  </div>
              </div>
              <div id="calendarHeatmapContent">
              </div>
          </div>`
    )
  }
}
let ignore = null
const config = localStorage.getItem('calendar-heatmap-config')
if (config != null) {
  const objConfig = JSON.parse(config)
  ignore = objConfig.ignore
}

export const addSettingElement = `<div class="config__tab-container" id="heatmapSettingsDialog">
                                    <lable class="fn__flex b3-label">
                                      <div class="fn__flex-1">
                                      日记
                                        <div class="b3-label__text">启用后将只统计当年归属于daily note中的内容块</div>
                                        <span class="fn__space"></span>
                                      </div>
                                      <input class="b3-switch fn__flex-center" id="calendarHeatmapConfigCheckbox" type="checkbox">
                                    </lable>
                                    <label class="b3-label fn__flex">
                                      <div class="fn__flex-1">
                                        忽略统计文件
                                        <div class="b3-label__text">请输入所需忽略的文件,并用英文逗号隔开</div>
                                        <div class="fn__hr"></div>
                                        <textarea class="b3-text-field fn__block" 
                                                  id="calendarHeatmapConfigText" 
                                                  style="height: 50px;" placeholder="请输入需要忽略的文档全名称,并且用逗号隔开">${ignore != '' && ignore != undefined ? ignore : ''}</textarea>
                                      </div>
                                    </label>
                                  </div>`

export function removeElement() {
  document.getElementById('openViewHeatmap').remove()
  document.getElementById('calendarHeatmapButton').remove()
}

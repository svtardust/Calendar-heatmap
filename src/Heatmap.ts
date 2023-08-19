import * as d3 from 'd3'
import axios from 'axios'
import {getColor, getData} from "./utils";

export async function heatmap() {
  const width = 815
  const height = 180
  const margin = {top: 15, right: 30, bottom: 30, left: 25}
  const weekBoxWidth = 20
  const monthBoxHeight = 20

  // 删除上一次作图
  d3.select('#calendarHeatmapContent').selectAll('*').remove()
  // 获取svg并定义svg高度和宽度
  const svg = d3.select('#calendarHeatmapContent').append('svg').attr('width', width).attr('height', height - 55)
  // 绘制图区
  const {months, days} = await dataChart()
  monthCoordinate(width, margin, weekBoxWidth, svg, months)
  weekCoordinate(height, margin, monthBoxHeight, svg)
  await dateSquares(height, margin, weekBoxWidth, monthBoxHeight, svg, days)
}

function monthCoordinate(width, margin, weekBoxWidth, svg, months) {
  // 绘制月坐标
  // @ts-ignore
  const monthBox = svg
    .append('g')
    .attr(
      'transform',
      'translate(' + (margin.left - 10) + ', ' + margin.top + ')',
    )
  // @ts-ignore
  const monthScale = d3
    .scaleLinear()
    .domain([0, months.length])
    .range([20, width - weekBoxWidth + 10])
  // @ts-ignore
  monthBox
    .selectAll('text')
    .data(months)
    .enter()
    .append('text')
    .text(function (d) {
      return d
    })
    .attr('font-size', '12px')
    .attr('font-family', 'monospace')
    .attr('fill', '#5D6063')
    // @ts-ignore
    .attr('x', (function (d, i) {
      return monthScale(i)
    }))
}

function weekCoordinate(height, margin, monthBoxHeight, svg) {
  const weeks = ['一', '三', '五', '日']
  // @ts-ignore
  const weekBox = svg
    .append('g')
    .attr(
      'transform',
      `translate(${margin.left - 20}, ${margin.top + monthBoxHeight})`,
    )
  // @ts-ignore
  const weekScale = d3
    .scaleLinear()
    .domain([0, weeks.length])
    .range([0, height - margin.right - monthBoxHeight - 13])

  // @ts-ignore
  weekBox
    .selectAll('text')
    .data(weeks)
    .enter()
    .append('text')
    .text((d) => {
      return d
    })
    .attr('font-size', '12px')
    .attr('fill', '#5D6063')
    .attr('y', (d, i) => {
      return weekScale(i)
    })
}

/**
 * 日期方块
 * @param height 高度
 * @param margin 边距
 * @param weekBoxWidth 周宽度
 * @param monthBoxHeight 月宽度
 * @param svg svg参数
 * @param days 所有日期
 */
async function dateSquares(height, margin, weekBoxWidth, monthBoxHeight, svg, days) {
  const color = await getColor()
  const cellBox = svg
    .append('g')
    .attr(
      'transform',
      'translate(' + ((margin.left - 15) + weekBoxWidth) + ', ' + (margin.top + 10) + ')',
    )
  // 设置方块间距
  const cellMargin = 4
  // 计算方块大小
  const cellSize = (height - margin.right - monthBoxHeight - cellMargin * 6 - 30) / 7
  // 方块列计数器
  let cellCol = 0
  // @ts-ignore
  cellBox
    .selectAll('rect')
    .data(days)
    .enter()
    .append('rect')
    .attr('width', cellSize)
    .attr('height', cellSize)
    .attr('rx', 3)
    // 颜色坐标
    .attr('fill', function (d) {
      if (d.total === undefined || d.total === 0) {
        return color[0]
      }
      let total = d.total
      if (total > 0) {
        if (total <= 10) {
          return color[1]
        } else if (total <= 30) {
          return color[2]
        } else if (total <= 60) {
          return color[3]
        }
        return color[4]
      }
      return color[0]
    })
    .attr('x', (d, i) => {
      if (i % 7 === 0) {
        cellCol++
      }
      const x = (cellCol - 1) * cellSize
      return cellCol > 1 ? x + cellMargin * (cellCol - 1) : x
    })
    .attr('y', (d, i) => {
      const y = i % 7
      return y > 0 ? y * cellSize + cellMargin * y : y * cellSize
    })
    .style('cursor', 'pointer')
    // 唯一标识
    .attr('id', d => {
      return `heatmap-${d.date}`
    })
    // 日期方块添加鼠标移入时的数据提示
    .append('title').text((d) => {
    let message = '没有内容块'
    if (d.total != 0 || d.total != undefined) {
      message = '有' + d.total + '个内容块'
    }
    return d.date + '\n' + message
  })
  // 如果是当日日期边框显示为红色
  const date = new Date()
  const day = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
  svg.select(`#heatmap-${day}`).style('stroke', '#E34234').style('stroke-width', '1px')
}

async function queryDate() {
  const {isdailyNote, ignoreText} = await getData()
  let response
  if (isdailyNote === true) {
    const sql = `SELECT SUBSTR(created, 1, 8) AS date, COUNT(*) count FROM blocks WHERE type = 'p' AND  hpath LIKE '/daily note%' GROUP BY SUBSTR(created, 1, 8) ORDER BY date DESC LIMIT 370`
    response = await (await axios.post('/api/query/sql', {stmt: sql})).data.data
  } else if (ignoreText !== null && ignoreText != '') {
    let sql = `SELECT SUBSTR(created, 1, 8) AS date, COUNT(*) count FROM blocks WHERE type = 'p' AND `
    const arrData = ignoreText.split(',')
    for (let i = 0; i < arrData.length; i++) {
      if (arrData[i].indexOf('#') === 0) {
        sql = sql + `box <> '${arrData[i].substring(1)}' ${i === arrData.length - 1 ? '' : 'AND '} `
      } else {
        sql = sql + `hpath NOT LIKE '/${arrData[i]}%' ${i === arrData.length - 1 ? '' : 'AND '} `
      }
    }
    sql = sql + `GROUP BY SUBSTR(created, 1, 8) ORDER BY date DESC LIMIT 370 `
    response = await (await axios.post('/api/query/sql', {stmt: sql})).data.data
  } else {
    const sql = `SELECT SUBSTR(created, 1, 8) AS date, COUNT(*) count FROM blocks WHERE type = 'p' GROUP BY SUBSTR(created, 1, 8) ORDER BY date DESC LIMIT 370`
    response = await (await axios.post('/api/query/sql', {stmt: sql})).data.data
  }
  return response
}

async function dataChart() {
  const resDate = await queryDate()
  let formatParams = []
  // 遍历数据
  if (resDate != null) {
    resDate.forEach(param => {
      const {date, count} = param
      // 格式化date，封装进新数组
      const formatDate = `${date.substring(0, 4)}-${(date.substring(4, 6) > 10 ? date.substring(4, 6) : date.substring(4, 6).substring(1, 2))}-${(date.substring(6, 8) > 10 ? date.substring(6, 8) : date.substring(6, 8).substring(1.2))}`
      formatParams.push({day: formatDate, total: count})
    })
  }

  const months = []
  const days = []

  for (let i = 12; i > 0; i--) {
    const referDate = new Date()

    referDate.setMonth(referDate.getMonth() - i + 2)
    referDate.setDate(0)

    let month: string | number = referDate.getMonth() + 1

    for (let j = 1; j <= referDate.getDate(); j++) {
      let data = {date: referDate.getFullYear() + '-' + month + '-' + j, total: 0}
      formatParams.forEach(item => {
        if (item.day === data.date) {
          data.total = item.total
        }
      })

      days.push(data)
    }
    months.push(referDate.getFullYear() + '-' + month)
  }
  let firstDate = days[0].date

  let d = new Date(firstDate)
  let day = d.getDay()
  if (day == 0) {
    day = 7
  }

  for (let i = 1; i < day; i++) {
    const date = new Date(firstDate)
    date.setDate(date.getDate() - i)

    let formatDate = [date.getFullYear(), date.getMonth() + 1, date.getDate()]

    if (formatDate[1] < 10) {
      formatDate[1] = Number('0' + formatDate[1])
    }

    if (formatDate[2] < 10) {
      formatDate[2] = Number('0' + formatDate[2])
    }
    let total = 0
    formatParams.forEach(item => {
      if (item.day === formatDate.join('-')) {
        total = item.total
      }
    })
    days.unshift({date: formatDate.join('-'), total})
  }
  return {days, months}
}


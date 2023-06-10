import * as d3 from 'd3'
import axios from 'axios'

export async function heatmap() {
  const width = 1000
  const height = 180
  const margin = 30
  const weekBoxWidth = 20
  const monthBoxHeight = 20

  // 删除上一次作图
  d3.select('#calendarHeatmapContent').selectAll('*').remove()
  // 获取svg并定义svg高度和宽度
  const svg = d3.select('#calendarHeatmapContent').append('svg').attr('width', width).attr('height', height)
  // 绘制图区
  const { months, days } = await dataChart()
  monthCoordinate(width, margin, weekBoxWidth, svg, months)
  weekCoordinate(height, margin, monthBoxHeight, svg)
  await dateSquares(height, margin, weekBoxWidth, monthBoxHeight, svg, days)
}

function monthCoordinate(width: number, margin: number, weekBoxWidth: number, svg: d3.Selection<SVGSVGElement, unknown, HTMLElement, any>, months) {// 绘制月坐标
  const monthBox = svg
    .append('g')
    .attr(
      'transform',
      'translate(' + (margin + weekBoxWidth) + ', ' + margin + ')',
    )
  const monthScale = d3
    .scaleLinear()
    .domain([0, months.length])
    .range([20, width - margin - weekBoxWidth - 20])
  monthBox
    .selectAll('text')
    .data(months)
    .enter()
    .append('text')
    .text(function(d) {
      return d
    })
    .attr('font-size', '0.9em')
    .attr('font-family', 'monospace')
    .attr('fill', '#999')
    .attr('x', (v: any, i: d3.NumberValue) => {
      return monthScale(i)
    })
}

function weekCoordinate(height: number, margin: number, monthBoxHeight: number, svg: d3.Selection<SVGSVGElement, unknown, HTMLElement, any>) {
  const weeks = ['一', '三', '五', '日']
  const weekBox = svg
    .append('g')
    .attr(
      'transform',
      'translate(' + (margin - 10) + ', ' + (margin + monthBoxHeight) + ')',
    )
  const weekScale = d3
    .scaleLinear()
    .domain([0, weeks.length])
    .range([0, height - margin - monthBoxHeight + 14])

  weekBox
    .selectAll('text')
    .data(weeks)
    .enter()
    .append('text')
    .text((v) => {
      return v
    })
    .attr('font-size', '0.85em')
    .attr('fill', '#CCC')
    .attr('y', (v: any, i: d3.NumberValue) => {
      return weekScale(i)
    })
}

async function dateSquares(height: number, margin: number, weekBoxWidth: number, monthBoxHeight: number, svg: d3.Selection<SVGSVGElement, unknown, HTMLElement, any>, days) {

  const cellBox = svg
    .append('g')
    .attr(
      'transform',
      'translate(' + (margin + weekBoxWidth) + ', ' + (margin + 10) + ')',
    )
  // 设置方块间距
  const cellMargin = 4
  // 计算方块大小
  const cellSize = (height - margin - monthBoxHeight - cellMargin * 6 - 10) / 7
  // 方块列计数器
  let cellCol = 0
  const cell = cellBox
    .selectAll('rect')
    .data(days)
    .enter()
    .append('rect')
    .attr('width', cellSize)
    .attr('height', cellSize)
    .attr('rx', 3)
    .attr('fill', function(d) {
      if (d.total === undefined || d.total === 0) {
        return '#ebedf0'
      }
      let total = d.total
      if (total > 0) {
        if (total <= 30) {
          return '#9be9a8'
        } else if (total <= 70) {
          return '#40c463'
        } else if (total <= 120) {
          return '#30a14e'
        }
        return '#216e39'
      }
      return '#ebedf0'
    })
    .attr('x', (v, i) => {
      if (i % 7 === 0) {
        cellCol++
      }
      const x = (cellCol - 1) * cellSize
      return cellCol > 1 ? x + cellMargin * (cellCol - 1) : x
    })
    .attr('y', (v, i) => {
      const y = i % 7
      return y > 0 ? y * cellSize + cellMargin * y : y * cellSize
    })
    .style('cursor', 'pointer')
  // 日期方块添加鼠标移入时的数据提示
  cell.append('title').text((d) => {
    let message = '没有内容块'
    if (d.total != 0 || d.total != undefined) {
      message = '有 ' + d.total + '个内容块'
    }
    return d.date + '\n' + message
  })
}

async function queryDate() {
  const localConfig = localStorage.getItem('calendar-heatmap-config')
  let response
  if (localConfig === null) {
    const sql = `SELECT SUBSTR(created, 1, 8) AS date, COUNT(*) count FROM blocks WHERE type = 'p' GROUP BY SUBSTR(created, 1, 8) ORDER BY date DESC LIMIT 370`
    response = await (await axios.post('/api/query/sql', { stmt: sql })).data.data
  } else {
    const { isdailyNote, ignore } = JSON.parse(localConfig)
    if (isdailyNote === true) {
      const sql = `SELECT SUBSTR(created, 1, 8) AS date, COUNT(*) count FROM blocks WHERE type = 'p' AND hpath LIKE '/daily note%' GROUP BY SUBSTR(created, 1, 8) ORDER BY date DESC LIMIT 370`
      response = await (await axios.post('/api/query/sql', { stmt: sql })).data.data
    } else if (ignore !== null && ignore !== undefined && ignore != '') {
      let sql = `SELECT SUBSTR(created, 1, 8) AS date, COUNT(*) count FROM blocks WHERE type = 'p' AND `
      const arrData = ignore.split(',')
      for (let i = 0; i < arrData.length; i++) {
        sql = sql + `hpath NOT LIKE '/${arrData[i]}%' ${i === arrData.length - 1 ? '' : 'OR '}`
      }
      sql = sql + ` GROUP BY SUBSTR(created, 1, 8) ORDER BY date DESC LIMIT 370`
      response = await (await axios.post('/api/query/sql', { stmt: sql })).data.data
    } else {
      const sql = `SELECT SUBSTR(created, 1, 8) AS date, COUNT(*) count FROM blocks WHERE type = 'p' GROUP BY SUBSTR(created, 1, 8) ORDER BY date DESC LIMIT 370`
      response = await (await axios.post('/api/query/sql', { stmt: sql })).data.data
    }
  }
  return response
}

async function dataChart() {
  const resDate = await queryDate()
  let formatParams = []
  // 遍历数据
  if (resDate != null) {
    resDate.forEach(param => {
      const { date, count } = param
      // 格式化date，封装进新数组
      const formatDate = `${date.substring(0, 4)}-${(date.substring(4, 6) > 10 ? date.substring(4, 6) : date.substring(4, 6).substring(1, 2))}-${(date.substring(6, 8) > 10 ? date.substring(6, 8) : date.substring(6, 8).substring(1.2))}`
      formatParams.push({ day: formatDate, total: count })
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
      let data = { date: referDate.getFullYear() + '-' + month + '-' + j, total: 0 }
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
    days.unshift({ date: formatDate.join('-'), total })
  }
  return { days, months }
}


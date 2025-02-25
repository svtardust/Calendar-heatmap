import * as d3 from 'd3';
import axios from 'axios';
import { getColor, getData } from './utils';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';

export async function heatmap() {
  const width = 815;
  const height = 180;
  const margin = { top: 10, right: 30, bottom: 30, left: 20 };
  const weekBoxWidth = 15;
  const monthBoxHeight = 20;

  // 删除上一次作图和提示框
  d3.selectAll('.heatmap-tooltip').remove();
  d3.select('#calendarHeatmapContent').selectAll('*').remove();
  
  // 创建容器并添加提示框
  const container = d3.select('#calendarHeatmapContent')
    .style('position', 'relative');
    
  const tooltip = d3.select('body')
    .append('div')
    .attr('class', 'heatmap-tooltip')
    .style('position', 'fixed')
    .style('visibility', 'hidden')
    .style('background-color', 'var(--b3-menu-background)')
    .style('color', 'var(--b3-theme-on-background)')
    .style('padding', '10px 14px')
    .style('border-radius', '6px')
    .style('font-size', '13px')
    .style('line-height', '1.5')
    .style('box-shadow', '0 3px 14px rgba(0, 0, 0, 0.15)')
    .style('pointer-events', 'none')
    .style('z-index', '9999')
    .style('white-space', 'nowrap')
    .style('border', '1px solid var(--b3-theme-surface-lighter)')
    .style('-webkit-font-smoothing', 'antialiased')
    .style('-moz-osx-font-smoothing', 'grayscale')
    .style('font-family', 'var(--b3-font-family)')
    .style('font-weight', '400')
    .style('letter-spacing', '0.2px')
    .style('opacity', '0.95')
    .style('backdrop-filter', 'blur(4px)')
    .style('-webkit-backdrop-filter', 'blur(4px)');

  // 获取svg并定义svg高度和宽度
  const svg = container
    .append('svg')
    .attr('width', width)
    .attr('height', height - 55);
  
  // 绘制图区
  const { months, days } = await dataChart();

  monthCoordinate(width, margin, weekBoxWidth, svg, months);
  weekCoordinate(height, margin, monthBoxHeight, svg);
  await dateSquares(height, margin, weekBoxWidth, monthBoxHeight, svg, days, tooltip);
}

/**
 * 绘制月
 * @param width 宽度
 * @param margin 边距
 * @param weekBoxWidth 周宽度
 * @param svg 图区
 * @param months 月数据
 */
function monthCoordinate(width, margin, weekBoxWidth, svg, months) {
  const monthBox = svg
    .append('g')
    .attr(
      'transform',
      'translate(' + (margin.left - 5) + ', ' + margin.top + ')',
    );
  // @ts-ignore
  const monthScale = d3
    .scaleLinear()
    .domain([0, months.length])
    .range([20, width - weekBoxWidth + 10]);
  // @ts-ignore
  monthBox
    .selectAll('text')
    .data(months)
    .enter()
    .append('text')
    .text(function(d) {
      return d;
    })
    .attr('font-size', '12px')
    .attr('font-family', 'monospace')
    .attr('fill', '#5D6063')
    // @ts-ignore
    .attr('x', (function(d, i) {
      return monthScale(i);
    }));
}

/**
 * 绘制周
 * @param height 高度
 * @param margin 边距
 * @param monthBoxHeight 与方块高度
 * @param svg 图区
 */
function weekCoordinate(height, margin, monthBoxHeight, svg) {
  const weeks = ['一', '三', '五', '日'];
  const weekBox = svg
    .append('g')
    .attr(
      'transform',
      `translate(${margin.left - 15}, ${margin.top + monthBoxHeight})`,
    );
  const weekScale = d3
    .scaleLinear()
    .domain([0, weeks.length])
    .range([0, height - margin.right - monthBoxHeight - 13]);

  weekBox
    .selectAll('text')
    .data(weeks)
    .enter()
    .append('text')
    .text((d) => {
      return d;
    })
    .style('font-size', '12px')
    .style('font-family', 'var(--b3-font-family)')
    .style('fill', 'var(--b3-theme-on-surface)')
    .style('font-weight', '450')
    .style('letter-spacing', '0.2px')
    .attr('y', (d, i) => {
      return weekScale(i);
    });
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
async function dateSquares(height, margin, weekBoxWidth, monthBoxHeight, svg, days, tooltip) {
  const color = await getColor();
  const cellBox = svg
    .append('g')
    .attr(
      'transform',
      'translate(' + ((margin.left - 15) + weekBoxWidth) + ', ' + (margin.top + 10) + ')',
    );
  
  // 设置方块间距
  const cellMargin = 4;
  // 计算方块大小
  const cellSize = (height - margin.right - monthBoxHeight - cellMargin * 6 - 30) / 7;
  
  // 方块列计数器
  let cellCol = 0;
  
  // 添加过渡效果
  const cells = cellBox
    .selectAll('rect')
    .data(days)
    .enter()
    .append('rect')
    .attr('width', cellSize)
    .attr('height', cellSize)
    .style('cursor', 'pointer')
    .style('transition', 'opacity 150ms ease')
    
  // 设置颜色和位置
  cells.attr('fill', function(d) {
      if (d.total === undefined || d.total === 0) {
        return color[0];
      }
      let total = d.total;
      if (total > 0) {
        if (total <= 10) {
          return color[1];
        } else if (total <= 30) {
          return color[2];
        } else if (total <= 60) {
          return color[3];
        }
        return color[4];
      }
      return color[0];
    })
    // @ts-ignore
    .attr('x', (d, i) => {
      if (i % 7 === 0) cellCol++;
      const x = (cellCol - 1) * cellSize;
      return cellCol > 1 ? x + cellMargin * (cellCol - 1) : x;
    })
    // @ts-ignore
    .attr('y', (d, i) => {
      const y = i % 7;
      return y > 0 ? y * cellSize + cellMargin * y : y * cellSize;
    })
    .attr('id', d => `heatmap-${d.date}`);
    
  // 添加悬停效果
  cells.on('mouseover', function(event, d) {
      const date = new Date(d.date);
      const formatDate = `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
      
      let content = '';
      if (d.total === undefined || d.total === 0) {
        content = `<div style="font-weight: 500;">${formatDate}</div><div style="opacity: 0.86;">暂无内容</div>`;
      } else {
        let countText = '';
        if (d.total <= 10) {
          countText = '少量';
        } else if (d.total <= 30) {
          countText = '适中';
        } else if (d.total <= 60) {
          countText = '较多';
        } else {
          countText = '大量';
        }
        content = `<div style="font-weight: 500;">${formatDate}</div><div style="opacity: 0.86;">${countText}内容：${d.total} 个块</div>`;
      }
      
      // 显示提示框并计算位置
      tooltip.html(content)
        .style('visibility', 'visible');
        
      // 获取提示框尺寸和窗口尺寸
      const tooltipNode = tooltip.node();
      const tooltipRect = tooltipNode.getBoundingClientRect();
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      
      // 计算位置
      let left = event.clientX + 10;
      let top = event.clientY - 10;
      
      // 如果提示框超出右侧边界，将其显示在左侧
      if (left + tooltipRect.width > windowWidth - 20) {
        left = event.clientX - tooltipRect.width - 10;
      }
      
      // 如果提示框超出底部边界，将其显示在上方
      if (top + tooltipRect.height > windowHeight - 20) {
        top = event.clientY - tooltipRect.height - 10;
      }
      
      // 应用计算后的位置
      tooltip
        .style('left', `${left}px`)
        .style('top', `${top}px`);
        
      // 高亮效果
      d3.select(this)
        .transition()
        .duration(150)
        .style('opacity', 0.8)
        .style('stroke', 'var(--b3-theme-on-surface)')
        .style('stroke-width', '1.5px');
    })
    .on('mousemove', function(event) {
      // 同样的位置计算逻辑用于移动事件
      const tooltipNode = tooltip.node();
      const tooltipRect = tooltipNode.getBoundingClientRect();
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      
      let left = event.clientX + 10;
      let top = event.clientY - 10;
      
      if (left + tooltipRect.width > windowWidth - 20) {
        left = event.clientX - tooltipRect.width - 10;
      }
      
      if (top + tooltipRect.height > windowHeight - 20) {
        top = event.clientY - tooltipRect.height - 10;
      }
      
      tooltip
        .style('left', `${left}px`)
        .style('top', `${top}px`);
    })
    .on('mouseout', function() {
      tooltip.style('visibility', 'hidden');
      
      d3.select(this)
        .transition()
        .duration(150)
        .style('opacity', 1)
        .style('stroke', null)
        .style('stroke-width', null);
    });

  // 当日日期标记
  const date = new Date();
  const day = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
  svg.select(`#heatmap-${day}`)
     .style('stroke', 'var(--b3-theme-primary)')
     .style('stroke-width', '2px');
}

/**
 * 查询数据
 * @returns data
 */
async function queryDate() {
  // @ts-ignore
  const { isdailyNote, ignoreText } = await getData();
  let response;
  if (isdailyNote === true) {
    const sql = `SELECT SUBSTR(created, 1, 8) AS date, COUNT(*) count FROM blocks WHERE type = 'p' AND  hpath LIKE '/daily note%' GROUP BY SUBSTR(created, 1, 8) ORDER BY date DESC LIMIT 370`;
    response = await (await axios.post('/api/query/sql', { stmt: sql })).data.data;
  } else if (ignoreText !== null && ignoreText != '') {
    let sql = `SELECT SUBSTR(created, 1, 8) AS date, COUNT(*) count FROM blocks WHERE type = 'p' AND `;
    const arrData = ignoreText.split(',');
    for (let i = 0; i < arrData.length; i++) {
      if (arrData[i].indexOf('#') === 0) {
        sql = sql + `box <> '${arrData[i].substring(1)}' ${i === arrData.length - 1 ? '' : 'AND '} `;
      } else {
        sql = sql + `hpath NOT LIKE '/${arrData[i]}%' ${i === arrData.length - 1 ? '' : 'AND '} `;
      }
    }
    sql = sql + `GROUP BY SUBSTR(created, 1, 8) ORDER BY date DESC LIMIT 370 `;
    response = await (await axios.post('/api/query/sql', { stmt: sql })).data.data;
  } else {
    const sql = `SELECT SUBSTR(created, 1, 8) AS date, COUNT(*) count FROM blocks WHERE type = 'p' GROUP BY SUBSTR(created, 1, 8) ORDER BY date DESC LIMIT 370`;
    response = await (await axios.post('/api/query/sql', { stmt: sql })).data.data;
  }
  return response;
}

async function dataChart() {
  const resDate = await queryDate();
  let formatParams = [];
  // 遍历数据
  if (resDate != null) {
    resDate.forEach(param => {
      const { date, count } = param;
      // 格式化date，封装进新数组
      const formatDate = `${date.substring(0, 4)}-${(date.substring(4, 6) >= 10 ? date.substring(4, 6) : date.substring(4, 6).substring(1, 2))}-${(date.substring(6, 8) >= 10 ? date.substring(6, 8) : date.substring(6, 8).substring(1, 2))}`;
      formatParams.push({ day: formatDate, total: count });
    });
  }

  const months = [];
  const days = [];

  for (let i = 12; i > 0; i--) {
    const referDate = dayjs(new Date());
    const referDay = referDate.month((referDate.month() - i + 1));
    for (let j = 1; j <= referDay.daysInMonth(); j++) {
      let data = { date: referDay.year() + '-' + (referDay.month() + 1) + '-' + j, total: 0 };
      formatParams.forEach(item => {
        if (item.day === data.date) {
          data.total = item.total;
        }
      });
      days.push(data);
    }
    months.push(referDay.year() + '-' + (referDay.month() + 1));


    // referDate.setMonth(referDate.getMonth() - i + 2)
    // referDate.setDate(0)
    // console.log(referDate.getDate());

    // let month: string | number = referDate.getMonth() + 1

    // for (let j = 1; j <= referDate.getDate(); j++) {
    //   let data = {date: referDate.getFullYear() + '-' + month + '-' + j, total: 0}
    //   formatParams.forEach(item => {
    //     if (item.day === data.date) {
    //       data.total = item.total
    //     }
    //   })

    //   days.push(data)
    // }
    // months.push(referDate.getFullYear() + '-' + month)
  }
  let firstDate = days[0].date;

  let d = new Date(firstDate);
  let day = d.getDay();
  if (day == 0) {
    day = 7;
  }

  for (let i = 1; i < day; i++) {
    const date = new Date(firstDate);
    date.setDate(date.getDate() - i);

    let formatDate = [date.getFullYear(), date.getMonth() + 1, date.getDate()];

    if (formatDate[1] < 10) {
      formatDate[1] = Number('0' + formatDate[1]);
    }

    if (formatDate[2] < 10) {
      formatDate[2] = Number('0' + formatDate[2]);
    }
    let total = 0;
    formatParams.forEach(item => {
      if (item.day === formatDate.join('-')) {
        total = item.total;
      }
    });
    days.unshift({ date: formatDate.join('-'), total });
  }
  return { days, months };
}


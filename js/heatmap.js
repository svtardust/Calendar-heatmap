const dataChart = async () => {
    let data = [];
    // 获去当前年
    const date = new Date();
    const year = date.getFullYear();
    const localDay = year + '-' + (date.getMonth() + 1) + '-' + date.getDay()
    const heatmapData = JSON.parse(localStorage.getItem('calendar-heatmap-data'));
    if (heatmapData === null || new Date(localDay) > new Date(heatmapData.now)) {
        await formatDate(year, localDay, data)
    } else {
        const heatmapDate = heatmapData.now
        const count = await queryCount(year, (date.getMonth() + 1), date.getDay())
        const arrData = heatmapData.data;
        const newData = []
        data.slice(0,data.length)
        for (let i = 0; i < arrData.length; i++) {
            if (arrData[i].day === heatmapDate) {
                newData.push({day: arrData[i].day, total: count})
            } else {
                newData.push(arrData[i])
            }
        }
        data = newData
    }
    localStorage.setItem('calendar-heatmap-data', JSON.stringify({data, now: localDay}))
    return data;
};

const formatDate = async (year, localDay, data) => {
    for (let index = 0; index < 12; index++) {
        const month = index + 1;
        const monthNumber = new Date(year, month, 0).getDate();
        for (let index = 1; index < monthNumber + 1; index++) {
            const day = year + '-' + month + '-' + index;
            if (new Date(day) > new Date(localDay)) {
                data.push({day, total: 0})
            } else {
                const total = await queryCount(year, month, index)
                data.push({day, total: total === 0 ? 0 : total});
            }
        }
    }
    return data;
}

const queryCount = async (year, month, day) => {
    const dateStr = year.toString()
        + (month < 10 ? ('0' + month.toString()) : month.toString())
        + (day.toString() < 10 ? ('0' + day.toString()) : day.toString())
    const sql = "SELECT count(*) AS count FROM blocks WHERE type = 'p' AND created like +'" + dateStr + "%'";
    const sqlData = {stmt: sql}
    return await axios.post('/api/query/sql', sqlData)
        .then(function (response) {
            return response.data.data[0].count
        })
}

const width = 1000;
const height = 180;
const margin = 30;
const weekBoxWidth = 20;
const monthBoxHeight = 20;

const svg = d3
    .select('svg')
    .attr('width', width)
    .attr('height', height);
const months = () => {
    const year = new Date().getFullYear();
    const months = []
    for (let i = 1; i <= 12; i++) {
        const month = year + '-' + i;
        months.push(month)
    }
    return months
}
// 绘制月坐标
const monthBox = svg
    .append('g')
    .attr(
        'transform',
        'translate(' + (margin + weekBoxWidth) + ', ' + margin + ')'
    );
const monthScale = d3
    .scaleLinear()
    .domain([0, months().length])
    .range([0, width - margin - weekBoxWidth + 10]);

monthBox
    .selectAll('text')
    .data(months())
    .enter()
    .append('text')
    .text((v) => {
        return v;
    })
    .attr('font-size', '0.9em')
    .attr('font-family', 'monospace')
    .attr('fill', '#999')
    .attr('x', (v, i) => {
        return monthScale(i);
    });
const weeks = ['二', '四', '六'];
// 绘制周坐标
const weekBox = svg
    .append('g')
    .attr(
        'transform',
        'translate(' + (margin - 10) + ', ' + (margin + monthBoxHeight) + ')'
    );
const weekScale = d3
    .scaleLinear()
    .domain([0, weeks.length])
    .range([0, height - margin - monthBoxHeight + 14]);

weekBox
    .selectAll('text')
    .data(weeks)
    .enter()
    .append('text')
    .text((v) => {
        return v;
    })
    .attr('font-size', '0.85em')
    .attr('fill', '#CCC')
    .attr('y', (v, i) => {
        return weekScale(i);
    });

const data = await dataChart()
// 绘制日期方块
const cellBox = svg
    .append('g')
    .attr(
        'transform',
        'translate(' + (margin + weekBoxWidth) + ', ' + (margin + 10) + ')'
    );
// 设置方块间距
const cellMargin = 1.5;
// 计算方块大小
const cellSize = (height - margin - monthBoxHeight - cellMargin * 5 - 10) / 7;
// 方块列计数器
let cellCol = 0;

const cell = cellBox
    .selectAll('rect')
    .data(data)
    .enter()
    .append('rect')
    .attr('width', cellSize)
    .attr('height', cellSize)
    .attr('rx', 3)
    .attr('fill', function (d) {
        if (d.total === undefined || d.total === 0) {
            return '#EFEFEF';
        }
        let t = d.total;
        if (t > 0) {
            if (t >= 180) {
                t = 40;
            } else {
                t = 255 - t;
            }
            return 'rgb(0,' + t + ',0)';
        }
        return '#EFEFEF';
    })
    .attr('x', (v, i) => {
        if (i % 7 === 0) {
            cellCol++;
        }
        const x = (cellCol - 1) * cellSize;
        return cellCol > 1 ? x + cellMargin * (cellCol - 1) : x;
    })
    .attr('y', (v, i) => {
        const y = i % 7;
        return y > 0 ? y * cellSize + cellMargin * y : y * cellSize;
    })
    .style('cursor', 'pointer');

// 日期方块添加鼠标移入时的数据提示
cell.append('title').text((d) => {
    let message = '没有内容';
    if (d.total) {
        message = '有 ' + d.total + '个内容块';
    }

    return d.day + '\n' + message;
});

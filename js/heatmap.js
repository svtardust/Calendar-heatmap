const dataChart = async () => {
    // 获去当前年
    const year = new Date().getFullYear();
    const data = [];
    // 遍历循环当前日期
    for (let index = 0; index < 12; index++) {
        const month = index + 1;
        const monthNumber = new Date(year, month, 0).getDate();
        for (let index = 1; index < monthNumber + 1; index++) {
            const day = year + '-' + month + '-' + index;
            const formatDay = year.toString()
                + (month < 10 ? ('0' + month.toString()) : month.toString())
                + (index.toString() < 10 ? ('0' + index.toString()) : index.toString())
            const sql = "SELECT count(*) AS count FROM blocks WHERE type = 'p' AND created like '" + formatDay + "%'";
            const sqlData = {stmt: sql}
            await axios.post('/api/query/sql', sqlData)
                .then(function (response) {
                    let total = response.data.data[0].count
                    data.push({day, total: total === 0 ? 0 : total});
                })
        }
    }
    return data;
};

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
const weeks = ['一', '二', '三', '四', '五', '六', '日'];
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

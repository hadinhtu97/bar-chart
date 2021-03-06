fetch('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json')
    .then(response => response.json())
    .then(data => {
        const dataset = data.data;
        const w = 1000;
        const h = 500;
        const padding = 50;
        const svg = d3.select('#bar-chart').append('svg').style('width', w).style('height', h);
        const tooltip = d3.select('#tooltip').attr('data-date', '').style('opacity', 0);
        const xScale = d3.scaleLinear().domain([1947, 2015.75]).range([padding, w - padding]);
        const yScale = d3.scaleLinear().domain([0, d3.max(dataset, d => d[1])]).range([h - padding, padding]);
        const xAxis = d3.axisBottom(xScale).tickFormat(d3.format(''));
        const yAxis = d3.axisLeft(yScale);

        const convertStringToDate = (str) => {
            let newStr = str.split("-");
            let x;
            newStr[1] === '01' ? x = 0 : newStr[1] === '04' ? x = 0.25 : newStr[1] === '07' ? x = 0.5 : x = 0.75;
            return parseFloat(newStr[0]) + x;
        }
        const rect = svg.selectAll('rect')
            .data(dataset)
            .enter()
            .append('rect')
            .attr('x', d => xScale(convertStringToDate(d[0])))
            .attr('y', d => yScale(d[1]))
            .attr('width', w / dataset.length)
            .attr('height', d => h - yScale(d[1]) - padding)
            .attr('fill', '#5e0080')
            .attr('data-date', d => d[0])
            .attr('data-gdp', d => d[1])
            .attr('class', 'bar')
            .on('mouseover', function (event, d) {
                d3.select(this).attr('fill', 'cyan');
                tooltip.style('opacity', 1)
                    .attr('data-date', d[0])
                    .html(d[0] + '<br> $' + d[1] + ' B')
                    .style('left', (event.pageX + 20) + 'px')
                    .style('top', event.pageY + 'px')
            })
            .on('mouseout', function () {
                d3.select(this).attr('fill', '#5e0080')
                tooltip.style('opacity', 0)
                    .attr('data-date', '')
                    .text('')
                    .style('left', '0px')
                    .style('top', '0px')
            });
        svg.append("g")
            .attr("transform", "translate(0," + (h - padding) + ")")
            .attr("id", "x-axis")
            .call(xAxis);
        svg.append("g")
            .attr("transform", "translate(" + padding + ",0)")
            .attr("id", "y-axis")
            .call(yAxis);
    })
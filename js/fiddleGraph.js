var svg = d3.select('svg');
var width = svg.attr('width');
    height = svg.attr('height');
    margin = {top: 0, right: 20, bottom: 20, left: 40};
    scorelines = [63.5, 67, 70.5, 74, 77.5]; // midi approximations of treble staff lines, problematic: sharps and flats in a even scaled graph.

var x = d3.scaleLinear()
    .range([0, width - margin.left - margin.right]);
var y = d3.scaleLinear()
    .domain([0,136]) // midi range
    .range([height - margin.bottom, 0]);

for (var i = 0; i < scorelines.length; i++) {
    svg.append('line')
        .attr('x1', 0)
        .attr('y1', y(scorelines[i]))
        .attr('x2', width)
        .attr('y2', y(scorelines[i]))
        .attr('class', 'staffline');
}

var clefheight = height * .225;
svg.append('svg:image')
    .attr('xlink:href', '../trebleClef.svg')
    .attr('x', 0)
    .attr('y', height / 2.93)
    .attr('height', clefheight)
    .attr('width', clefheight / 2.25);

var line = d3.line()
    .x(function(d) { return x(d[0]); })
    .y(function(d) { return y(d[1]); });

d3.text('../fiddle-data/fundamentalB.txt', function(error, text){
    if (error) throw error;
    // each line of pd output: "index fiddle-value;\n"
    text = text.split(';');
    for(var i = 0, l = text.length; i < l; i++){
        text[i] = text[i].split(' ');
        text[i][0] = parseFloat(text[i][0]);
        text[i][1] = parseFloat(text[i][1]);
    }

    x.domain([0, d3.max(text, function(d){return d[0]})])

    var xAxis = d3.axisBottom() // create axis now that x has domain
        .scale(x)
        .ticks(20)
        .tickFormat(function(d){return d + 's'});

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(" + margin.left + "," + (height - 20) + ")")
        .call(xAxis)

    svg.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
      .append("path")
        .datum(text)
        .attr("fill", "none")
        .attr("stroke", "black")
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("stroke-width", 1.5)
        .attr("d", line);
})

d3.text('../fiddle-data/partials.txt', function(error, text){
    if (error) throw error;

    text = text.split(';');
    for(var i = 0, l = text.length; i < l; i++){
        text[i] = text[i].split(' ');
        for (var j = 0; j < text[i].length; j++) {
            text[i][j] = parseFloat(text[i][j]);
        }
    }

    x.domain([0, text.length]) // relies on the syncing in the pd patch to give both documents the same number of data points. potentially reliable but seems fragile here.
    var g1 = svg.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    g1.selectAll("circle")
        .data(text).enter().append('circle')
        .attr('cx', function(d,i){return x(i)})
        .attr('cy', function(d, i){return y(d[0])})
        .attr('r', 1)
        .style('fill', 'red');
    var g2 = svg.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    g2.selectAll("circle")
        .data(text).enter().append('circle')
        .attr('cx', function(d,i){return x(i)})
        .attr('cy', function(d, i){return y(d[1])})
        .attr('r', 1)
        .style('fill', 'green');
    var g3 = svg.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    g3.selectAll("circle")
        .data(text).enter().append('circle')
        .attr('cx', function(d,i){return x(i)})
        .attr('cy', function(d, i){return y(d[2])})
        .attr('r', 1)
        .style('fill', 'blue');
    var g4 = svg.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    g4.selectAll("circle")
        .data(text).enter().append('circle')
        .attr('cx', function(d,i){return x(i)})
        .attr('cy', function(d, i){return y(d[2])})
        .attr('r', 1)
        .style('fill', 'purple');
})

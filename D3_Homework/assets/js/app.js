var svgWidth = 750;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 80,
  bottom: 80,
  left: 90
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`)
    .attr("class", "chart");

d3.csv("assets/data/data.csv").then(function(censusData) {
    censusData.forEach(function(data) {
      data.healthcare = +data.healthcare;
      data.income = +data.income;
        data.age = +data.age;
        data.obesity = +data.obesity;
        data.smokes = +data.smokes;
        data.poverty = +data.poverty;
        data.abbr = String(data.abbr);
    });

    var xLinearScale = d3.scaleLinear()
      .domain([d3.min(censusData, d => d.income) - 1000, d3.max(censusData, d => d.income)])
      .range([0, width]);

    var yLinearScale = d3.scaleLinear()
      .domain([d3.min(censusData, d => d.healthcare) - 2, d3.max(censusData, d => d.healthcare)])
      .range([height, 0]);

    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

    chartGroup.append("g")
      .call(leftAxis);
    
    var toolTip = d3.tip()
        .html(function(d) { 
            return `${d.state}<br/>Income: $${d.income}<br/>% Without Healthcare: ${d.healthcare}%`; })
        .attr("class", "d3-tip");
    chartGroup.call(toolTip);

    var radius = "10px"
    var circlesGroup = chartGroup.selectAll("circle")
    .data(censusData)
    .enter()
    .append("circle")
    .attr("class", "stateCircle")
    .attr("cx", d => xLinearScale(d.income))
    .attr("cy", d => yLinearScale(d.healthcare))
    .attr("r", radius)
    .on('mouseover', toolTip.show)
    .on('mouseout', toolTip.hide);
    
    var textGroup = chartGroup.selectAll(null)
        .data(censusData)
        .enter()
        .append("text")
        .attr("class", "stateText")
        .attr("x", d => xLinearScale(d.income))
        .attr("y", d => yLinearScale(d.healthcare) + 2)
        .attr("font-size", radius)
        .text((d) => d.abbr);
    
    chartGroup.append("text")
        .attr("class", "aText")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 40)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .attr("class", "active")
      .text("% Without Healthcare");

    chartGroup.append("text")
      .attr("transform", `translate(${(width / 2)}, ${height + margin.top + 30})`)
      .attr("class", "active")
      .text("Median Household Income");

});
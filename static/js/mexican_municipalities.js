var x = d3.scaleLinear()
    .domain([0, width])
    .range([0, width]);

var y = d3.scaleLinear()
    .domain([0, height])
    .range([height, 0]);

var width = 960,
    height = 500;

var projection = d3.geoMercator()
    .scale(1200)
    .center([-102.34034978813841, 24.012062015793]);

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

var g = svg.append("g");

d3.json("static/data/mx_tj.json").then(mx=>{
  svg.selectAll("path")
    .data(topojson.object(mx, mx.objects.municipalities).geometries)
    .enter().append("path")
    .attr("d", d3.geo.path().projection(projection))
    .attr("fill", "transparent")
    .style("stroke", "#333")
    .style("stroke-width", ".2px")
    .attr("class", "muns");
  
  g.selectAll("path")
    .data(topojson.object(mx, mx.objects.states).geometries)
    .enter().append("path")
    .attr("d", d3.geo.path().projection(projection))
    .attr("fill", "transparent")
    .style("stroke", "#333");

});
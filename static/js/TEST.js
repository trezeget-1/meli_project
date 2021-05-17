var another_map = L.map('testMAP').setView([19.4327, -99.1333], 13);


// var another_map = L.map('testMAP', {
//     center: [19.432773407864026, -99.13334959469503],
//     zoom: 13,
//   });

L.tileLayer('https://tiles.stadiamaps.com/tiles/outdoors/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
  }).addTo(another_map);

d3.json("static/data/cdmx_municipios.geojson").then(shuju=>{

  console.log(shuju)
    L.geoJSON(shuju).addTo(another_map)

})
.catch(e=>{
    console.log(e)
})
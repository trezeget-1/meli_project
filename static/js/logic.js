var final_map = L.map('map_analysis').setView([19.310470960907647, -99.14773403421277], 11);

L.tileLayer('https://tiles.stadiamaps.com/tiles/outdoors/{z}/{x}/{y}{r}.png', {
  attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
}).addTo(final_map);

d3.json("static/data/cdmx_municipios.geojson").then(shuju=>{

  console.log(shuju)

  shuju.features.forEach(d=>{
    console.log(d.properties.NOMGEO)
  })
  
L.geoJSON(shuju, {
  color: "blue",
  weight: 4,
  fillColor: 'blue',
  opacity: .2,
    onEachFeature: function(feature, layer) {
      layer.bindTooltip(`${feature.properties.NOMGEO}`, {permanent: true, direction:'center'});
      layer.bindPopup(`<h4>Price: </h4>`)
    }
  })
  .addTo(final_map)


})




function map_creation(shuju, map_id_name){

// Define variables for our tile layers
let satellite_layer = L.tileLayer(`https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=${API_KEY}`, {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    id: 'mapbox/satellite-v9',
    accessToken: 'your.mapbox.access.token'
});


let outdoor_layer = L.tileLayer('https://tiles.stadiamaps.com/tiles/outdoors/{z}/{x}/{y}{r}.png', {
  attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
});


let street_map = L.tileLayer('https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png', {
	// maxZoom: 20,
	attribution: '&copy; OpenStreetMap France | &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

let Jawg_Dark = L.tileLayer(`https://{s}.tile.jawg.io/jawg-dark/{z}/{x}/{y}{r}.png?access-token=${jawg_api_key}`, {
	attribution: '<a href="http://jawg.io" title="Tiles Courtesy of Jawg Maps" target="_blank">&copy; <b>Jawg</b>Maps</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	minZoom: 0,
	// maxZoom: 22,
	subdomains: 'abcd',
	accessToken: jawg_api_key
});


// Create our number formatter.
var formatter = new Intl.NumberFormat('en-MX', {
  style: 'currency',
  currency: 'MXN',

  // These options are needed to round to whole numbers if that's what you want.
  //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
  maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
});

      
  function markerSize(amount_of_m2) {
    return amount_of_m2*.2;
  }


  let studied_array = []

  shuju.forEach( d=> {    
    studied_array.push(
      d['Precio por m2']
      )      
  }) 

  let amount_of_shares_desired = 7

  let quantiles_ranges = []
  for (let i=1, n=amount_of_shares_desired; i<n; i++){

    // if (i ===1 ){
    //   quantiles_ranges.push((i/7)/2)
    //   quantiles_ranges.push(i/7)
    // }else{
    //   quantiles_ranges.push(i/7)
    // }

    quantiles_ranges.push(i/7)

  }

  function quantile_definition(quantiles_ranges){

      
      // THIS IS TO OBTAIN THE QUARTILES FOR THE ARRAY M2
      
        // sort array ascending
        const asc = studied_array.sort((a, b) => a - b);
      
        const sum = studied_array.reduce((a, b) => a + b, 0);
      
        const mean = sum / studied_array.length;
      
      
        // sample standard deviation
        const std = (studied_array) => {
            const mu = mean(studied_array);
            const diffArr = studied_array.map(a => (a - mu) ** 2);
            return Math.sqrt(sum(diffArr) / (studied_array.length - 1));
        };
      
        const quantile = (studied_array, q) => {
            const sorted = asc;
            const pos = (sorted.length - 1) * q;
            const base = Math.floor(pos);
            const rest = pos - base;
            if (sorted[base + 1] !== undefined) {
                return sorted[base] + rest * (sorted[base + 1] - sorted[base]);
            } else {
                return sorted[base];
            }
        };
      
      let quantiles_actual_array = []
      
      quantiles_ranges.forEach( d => {
          
          quantiles_actual_array.push( quantile(studied_array, d) )
      })
      
      return quantiles_actual_array

  }

  let price_per_m2_quantiles = quantile_definition(quantiles_ranges)

  formatted_price_per_m2_quantiles = []

  price_per_m2_quantiles.forEach(d=>{
    formatted_price_per_m2_quantiles.push(formatter.format(d))
  })

  // console.log(formatted_price_per_m2_quantiles)

  let color = ""

  function fillColor(price_per_m2) {
    if (price_per_m2 <= price_per_m2_quantiles[0]){
      color = "#DE0C04"
    }else if (price_per_m2 < price_per_m2_quantiles[1]){
      color = "#FF9900"
    }else if (price_per_m2 < price_per_m2_quantiles[2]){
      color = "#FFF200"
    }else if (price_per_m2 < price_per_m2_quantiles[3]){
        color = "#11FF00"
    }else if (price_per_m2 < price_per_m2_quantiles[4]){
        color = "#0088F0"
    }else if (price_per_m2 < price_per_m2_quantiles[5]){
        color = "#6800F0"
    }else if (price_per_m2 > price_per_m2_quantiles[6]){
      color = "#000000"
    }
    return color;
  }


  // ------------------------------ HOUSES LIST --------------------------------


  let filtered_data = shuju.filter(d => d['Tipo de propiedad'] === 'Casa')
  // console.log(filtered_data)


  function markers_creation(filtered_data){

  let properties_list = []

  for (let i=0, n=filtered_data.length; i<n; i++){


    properties_list.push(
      [filtered_data[i]['Latitud'], filtered_data[i]['Longitud'],
      filtered_data[i]['Precio por m2'], filtered_data[i]['Link de la publicación'],
      filtered_data[i]['Número de m2'], filtered_data[i]['Precio']]
    )
    
  }

    let properties_markers = []

  for (let i=0, n=properties_list.length; i<n; i++){

    properties_markers.push(
        L.circle([properties_list[i][0],properties_list[i][1]], {
            fillOpacity: .8,
            color: "black",
            weight: 1,
            fillColor: fillColor(properties_list[i][2]),
                
            // Setting our circle's radius equal to the output of our markerSize function
            // This will make our marker's size proportionate to its population
            radius: markerSize(properties_list[i][4])
          }).bindPopup(`<h4>Price: </h4><p class="fs-5">${formatter.format(properties_list[i][5])}</p><br>
          <h4>Price per m²: </h4><p class="fs-5">${formatter.format(properties_list[i][2])} </p> <br>
          <h4>Size: </h4><p class="fs-5">${properties_list[i][4]} m² </p><br>
          <h5><a href= ${properties_list[i][3]} target="_blank" > Check out this property </a> </h5>`)
        )
      }

      return properties_markers
  }

  /** This function is to create a heat map based on the filtered data from either houses or apartments 
  * @param filtered_data
  * @returns heat_map_layer
  **/

  function heat_map(filtered_data){

  let heatArray = []

  filtered_data.forEach(d=>{
        heatArray.push(
            [d.Latitud, d.Longitud]
        )
    })

  let heat_map_layer = L.heatLayer(heatArray, {
  radius: 30,
  blur: 10  
  })

  return heat_map_layer
  }

  let houses_heatLayer = heat_map(filtered_data)
  // let houses_heatLayer = setTimeout(function(){
  //   heat_map(filtered_data);
  // },500)

  // Add all the cityMarkers to a new layer group.
  // Now we can handle them as one group instead of referencing each individually
  let housesLayer = L.layerGroup(markers_creation(filtered_data));


  // // ------------------------------ APARTMENTS LIST --------------------------------

  filtered_data = shuju.filter(d => d['Tipo de propiedad'] === 'Departamento')

  let apartmentLayer = L.layerGroup(markers_creation(filtered_data));

  let apartment_heatLayer = heat_map(filtered_data)
  // let apartment_heatLayer = setTimeout(function(){
  //   heat_map(filtered_data);
  // },500)

  // // ------------------------------ MAP CREATION --------------------------------


  // Create map object and set default layers
  var mymap = L.map(map_id_name, {
    center: [19.432773407864026, -99.13334959469503],
    zoom: 16,
    layers: [outdoor_layer, apartmentLayer]
  });



  // Only one base layer can be shown at a time
  var baseMaps = {
  'Basic Street': outdoor_layer,
  'Dark city': Jawg_Dark,
  'Satellite': satellite_layer,
  'Detailed Street': street_map
  };

  // Overlays that may be toggled on or off
  var overlayMaps = {
  "Apartments": apartmentLayer,
  "Apartments Heatmap": apartment_heatLayer,
  "Houses": housesLayer,
  "Houses Heatmap": houses_heatLayer,
  };


  // Pass our map layers into our layer control
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps,{collapsed:false}).addTo(mymap);




  studied_array = []

  shuju.forEach( d=> {
    
    studied_array.push(
      d['Número de m2']
      )
      
  })

  quantiles_ranges = [.20, .35, .5, .75];


  let quantiles_actual_array = quantile_definition(quantiles_ranges)

  /*Legend specific*/
  var legend = new L.control({ position: "bottomright" });

  function getRadius(r) {
  let radius_reference = .42

  return  r >= quantiles_actual_array[3] ? markerSize(quantiles_actual_array[3]*radius_reference) :
          r >= quantiles_actual_array[2] ? markerSize(quantiles_actual_array[2]*radius_reference) :
          r >= quantiles_actual_array[1] ? markerSize(quantiles_actual_array[1]*radius_reference) :
          r >= quantiles_actual_array[0] ? markerSize(quantiles_actual_array[0]*radius_reference) : 0;
  }



    var control = new L.Control({position:'topright'});

    control.onAdd = function(map) {
        var azoom = L.DomUtil.create('a','resetzoom');
        azoom.innerHTML = "[Reset Map]";
        L.DomEvent
          .disableClickPropagation(azoom)
          .addListener(azoom, 'click', function() {
            map.setView(map.options.center, map.options.zoom);
          },azoom);
        return azoom;
      };

      
      control.addTo(mymap);


  legend.onAdd = function(map) {

    // console.log(map)

  var div = L.DomUtil.create("div", "legend");
    div.innerHTML += "<h3>Price per m²</h3>";
    div.innerHTML += `<i style="background:#DE0C04"></i><span>Less than ${formatted_price_per_m2_quantiles[0]}</span><br>`;
    div.innerHTML += `<i style="background: #FF9900"></i><span>${formatted_price_per_m2_quantiles[0]} to ${formatted_price_per_m2_quantiles[1]}</span><br>`;
    div.innerHTML += `<i style="background: #FFF200"></i><span>${formatted_price_per_m2_quantiles[1]} to ${formatted_price_per_m2_quantiles[2]}</span><br>`;
    div.innerHTML += `<i style="background: #11FF00"></i><span>${formatted_price_per_m2_quantiles[2]} to ${formatted_price_per_m2_quantiles[3]}</span><br>`;
    div.innerHTML += `<i style="background: #0088F0"></i><span>${formatted_price_per_m2_quantiles[3]} to ${formatted_price_per_m2_quantiles[4]}</span><br>`;
    div.innerHTML += `<i style="background: #6800F0"></i><span>${formatted_price_per_m2_quantiles[4]} to ${formatted_price_per_m2_quantiles[5]}</span><br>`;
    div.innerHTML += `<i style="background: #000000"></i><span>More than ${formatted_price_per_m2_quantiles[5]}</span><br>`;
    
    div.innerHTML += "<br>";
    div.innerHTML += "<h3>Property Size</h3>";
    grades = quantiles_actual_array,
    labels = []
    categories = quantiles_actual_array;
  


    for (var i = 0; i < grades.length; i++) {
      var grade = grades[i];//*0.5;
  labels.push(
      '<i class="circlepadding" style="width: '+Math.max(8,(getRadius(grade)))+'px;"></i> <i style="background: #8080A0; width: '+getRadius(grade)*2+'px; height: '+getRadius(grade)*2+'px; border-radius: 50%; margin-top: '+Math.max(0,(9-getRadius(grade)))+'px;"></i>' + '<span>' + categories[i] + ' m²' +'</span>');
  }
  div.innerHTML += labels.join('<br>');

    return div;
  };

  legend.addTo(mymap);


  d3.json("static/data/cdmx_municipios.geojson").then(shuju=>{

  L.geoJSON(shuju, {
    color: "blue",
    weight: 4,
    fillColor: 'none',
    }).addTo(mymap)

  })

    }


// d3.json("static/data/ML_departamentos_CDMX.json").then(data=>{
d3.json("static/data/inmuebles_24_CDMX.json").then(shuju=>{
  
  map_id_name = 'mapid'
  map_creation(shuju, map_id_name)

})

d3.json("static/data/ML_departamentos_CDMX.json").then(shuju=>{

  map_id_name = 'Melimapid'
  map_creation(shuju, map_id_name)

})


.catch(e=>{
    console.log(e)
})




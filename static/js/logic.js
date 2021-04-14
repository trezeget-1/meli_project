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
	maxZoom: 20,
	attribution: '&copy; OpenStreetMap France | &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

let Jawg_Dark = L.tileLayer(`https://{s}.tile.jawg.io/jawg-dark/{z}/{x}/{y}{r}.png?access-token=${jawg_api_key}`, {
	attribution: '<a href="http://jawg.io" title="Tiles Courtesy of Jawg Maps" target="_blank">&copy; <b>Jawg</b>Maps</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	minZoom: 0,
	maxZoom: 22,
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



d3.json("static/data/ML_departamentos_CDMX.json")
.then(data=>{


console.log(data)

    let properties_list = []
    let studied_array = []

    
    data.forEach(d=>{

        properties_list.push(
            [d.Latitud, d.Longitud,
              d['Precio por m2'], d['Link de la publicación'],
              d['Número de m2'], d['Precio']]
            )

          studied_array.push(
          d['Precio por m2']
          )

        })
    
console.log(properties_list)

function markerSize(price_per_m2) {
    return price_per_m2/1300;
  }


  let color = ""

  function fillColor(amount_of_m2) {
    if (amount_of_m2 <= 70){
      color = "#DE0C04"
    }else if (amount_of_m2 <= 100){
      color = "#FF9900"
    }else if (amount_of_m2 <= 130){
      color = "#FFF200"
    }else if (amount_of_m2 <= 180){
        color = "#11FF00"
    }else if (amount_of_m2 <= 230){
        color = "#0088F0"
    }else if (amount_of_m2 > 230){
        color = "#6800F0"
    }
    
    return color;
  }



let properties_markers = []

for (let i=0, n=properties_list.length; i<n; i++){

properties_markers.push(
    L.circle([properties_list[i][0],properties_list[i][1]], {
        fillOpacity: .8,
        color: "black",
        weight: 1,
        fillColor: fillColor(properties_list[i][4]),
            
        // Setting our circle's radius equal to the output of our markerSize function
        // This will make our marker's size proportionate to its population
        radius: markerSize(properties_list[i][2])
      }).bindPopup(`<h2>Precio de la propiedad: ${formatter.format(properties_list[i][5])} </h2> <br> <h2>Precio por m2: <br> ${formatter.format(properties_list[i][2])} </h2> <br> <h2>${properties_list[i][4]} m2 <br><br> <a href= ${properties_list[i][3]} target="_blank" > ANUNCIO DE ESTA PROPIEDAD </a> </h2>`)
    )
  }


// data.forEach( d => {
//   // console.log(d)
//   console.log(d['Precio por m2'], markerSize(d['Número de m2']))
// })


  // Add all the cityMarkers to a new layer group.
// Now we can handle them as one group instead of referencing each individually
let propertiesLayer = L.layerGroup(properties_markers);




// Create map object and set default layers
var mymap = L.map("mapid", {
    center: [19.38351531103225, -99.16814160192048],
    zoom: 15,
    layers: [street_map, propertiesLayer]
  });

 
  
// Only one base layer can be shown at a time
var baseMaps = {
  'Satellite': satellite_layer,
  'Basic Street': outdoor_layer,
  'Detailed Street': street_map,
  'Dark city': Jawg_Dark
};


// Overlays that may be toggled on or off
var overlayMaps = {
  Properties: propertiesLayer
};


  // Pass our map layers into our layer control
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps,{collapsed:false}).addTo(mymap);
  



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

let quantiles_ranges = [.20, .25, .5, .75];
let quantiles_list = []
let quantiles_actual_array = []

quantiles_ranges.forEach( d => {
    
    quantiles_actual_array.push( quantile(studied_array, d) )
    quantiles_list.push( quantile(studied_array, d)/100 )
})


let quantiles_array_formatted = []

quantiles_actual_array.forEach( d => {
  quantiles_array_formatted.push(formatter.format(d)) //logs 1123355.5
})

  function getRadius(r) {
    return  r >= quantiles_list[3] ? markerSize(quantiles_list[3])*25 :
            r >= quantiles_list[2] ? markerSize(quantiles_list[2])*25 :
            r >= quantiles_list[1] ? markerSize(quantiles_list[1])*25 :
            r >= quantiles_list[0] ? markerSize(quantiles_list[0])*25 : 0;
    }

  /*Legend specific*/
  var legend = new L.control({ position: "bottomright" });

  legend.onAdd = function(map) {
  
  var div = L.DomUtil.create("div", "legend");
    div.innerHTML += "<h2>Size</h2>";
    div.innerHTML += '<i style="background:#DE0C04"></i><span>Less than 70 m2</span><br>';
    div.innerHTML += '<i style="background: #FF9900"></i><span>70 to 100 m2</span><br>';
    div.innerHTML += '<i style="background: #FFF200"></i><span>100 to 130 m2</span><br>';
    div.innerHTML += '<i style="background: #11FF00"></i><span>130 to 180 m2</span><br>';
    div.innerHTML += '<i style="background: #0088F0"></i><span>180 to 230 m2</span><br>';
    div.innerHTML += '<i style="background: #6800F0"></i><span>More than 230 m2</span><br>';
    
    div.innerHTML += "<h2>Price per m2</h2>";
    grades = quantiles_list,
    labels = []
    categories = quantiles_array_formatted;
   


    for (var i = 0; i < grades.length; i++) {
      var grade = grades[i];//*0.5;
 labels.push(
      '<i class="circlepadding" style="width: '+Math.max(8,(getRadius(grade)))+'px;"></i> <i style="background: #8080A0; width: '+getRadius(grade)*2+'px; height: '+getRadius(grade)*2+'px; border-radius: 50%; margin-top: '+Math.max(0,(9-getRadius(grade)))+'px;"></i>' + '<span>' + categories[i] + '</span>');
 }
div.innerHTML += labels.join('<br>');

    return div;
  };
  
  legend.addTo(mymap);




})

.catch(e=>{
    console.log(e)
})

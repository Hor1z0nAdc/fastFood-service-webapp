//variables
const hiddenCoords = document.getElementById("coords").value
const checkboxes =  document.querySelectorAll(".check")
mapboxgl.accessToken = 'pk.eyJ1IjoiaG9yMXowbiIsImEiOiJja3VpajVld3QwbzZ0MnduNmdpODk0Zjg3In0.w-7i3mIEj_9FNReGD22ejg';
let warehouseLocation = [18.126631380628737, 47.762163896551755]
let deliveryLocation = [18.131022418168584,47.76140029250175]
const warehouse = turf.featureCollection([turf.point(warehouseLocation)]);

checkboxes.forEach(checkbox => {
  checkbox.addEventListener("click", e => {
    const rendelés = JSON.parse(checkbox.dataset.rendelés)
    document.getElementById(rendelés._id).classList.toggle("bg-gray-200")

    //Disable or able the delete button
    const deleteBtn = document.getElementById("btn" + rendelés._id)
    if(deleteBtn.disabled == true) deleteBtn.disabled = false
    else deleteBtn.disabled = true

    //Remove element from route if it exists
    const examinedCoord = rendelés.koordináta
    let isRemoved = false
    for(let i = 0; i < placeCoords.length; i++) {
      if(placeCoords[i][0] == examinedCoord[0] && placeCoords[i][1] == examinedCoord[1]) {
        placeCoords.splice(i,1)
        isRemoved = true
      }
    }

    //If element doesn't exists add it to route
    if(!isRemoved) {
      placeCoords.push(examinedCoord)
    }

    //Refresh features and dropoff feature collection
    newFeatures = []
    placeCoords.forEach(coordElement => {
      newFeatures.push(turf.point(coordElement))
    })

    dropoffs = turf.featureCollection(newFeatures);
    fetchData()
  })
})

//Create coord array from input
const coordValues = hiddenCoords.split(",")
let placeCoords = []
for(let i = 0; i < coordValues.length; i += 2) {
  const entry = [coordValues[i], coordValues[i+1]]
  placeCoords.push(entry)
}

//Create feature array and collection from coord array
let features = []

placeCoords.forEach(coordElement => {
  features.push(turf.point(coordElement))
})

let dropoffs = turf.featureCollection(features);

// Create an empty GeoJSON feature collection, which will be used as the data source
const nothing = turf.featureCollection([])

//Create map
//getLocation(deliveryLocation)
let map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/light-v10',
    center: deliveryLocation,
    zoom: 14
});

//add layers, markers
map.on("load", () => {
    const marker = document.createElement('div');
    marker.classList = 'truck';

    dropoffMarkers()

    // Create a new marker
    new mapboxgl.Marker(marker).setLngLat(deliveryLocation).addTo(map);

    // Create a circle layer
    map.addLayer({
      id: 'warehouse',
      type: 'circle',
      source: {
        data: warehouse,
        type: 'geojson'
      },
      paint: {
        'circle-radius': 20,
        'circle-color': 'white',
        'circle-stroke-color': '#3887be',
        'circle-stroke-width': 3
      }
    });

    // Create a symbol layer on top of circle layer
    map.addLayer({
      id: 'warehouse-symbol',
      type: 'symbol',
      source: {
        data: warehouse,
        type: 'geojson'
      },
      layout: {
        'icon-image': 'grocery-15',
        'icon-size': 1
      },
      paint: {
        'text-color': '#3887be'
      }
    });

    map.addSource('route', {
      type: 'geojson',
      data: nothing
    });

    map.addLayer(
      {
        id: 'routeline-active',
        type: 'line',
        source: 'route',
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-color': '#3887be',
          'line-width': ['interpolate', ['linear'], ['zoom'], 12, 3, 22, 12]
        }
      },
      'waterway-label'
    );
   
    map.addLayer({
      id: 'dropoffs-symbol',
      type: 'symbol',
      source: {
        data: dropoffs,
        type: 'geojson'
      },
      layout: {
        'icon-allow-overlap': true,
        'icon-ignore-placement': true,
        'icon-image': 'marker-15'
      }
    }); 

    map.addLayer({
        id: 'routearrows',
        type: 'symbol',
        source: 'route',
        layout: {
        'symbol-placement': 'line',
        'text-field': '▶',
        'text-size': [
            'interpolate',
            ['linear'],
            ['zoom'],
            12,
            24,
            22,
            60
        ],
        'symbol-spacing': [
            'interpolate',
            ['linear'],
            ['zoom'],
            12,
            30,
            22,
            160
        ],
        'text-keep-upright': false
        },
        paint: {
        'text-color': '#3887be',
        'text-halo-color': 'hsl(55, 11%, 96%)',
        'text-halo-width': 3
        }
    },
    'waterway-label'
    );

    fetchData();
})


function getLocation(location) {
    navigator.geolocation.getCurrentPosition(position => { 
        location[0] = position.coords.longitude
        location[1] = position.coords.latitude
        points = [18.131022418168584,47.76140029250175]
        map.setCenter(points)
    }); 
}

function dropoffMarkers() {
    placeCoords.forEach(place => {
      let marker = new mapboxgl.Marker().setLngLat(place).addTo(map)
    })
}

//Set up request
function assembleQueryURL() {
    let coordinates = [...placeCoords]
    coordinates.push(deliveryLocation)
    let url = `https://api.mapbox.com/optimized-trips/v1/mapbox/driving/${coordinates.join(";")}?overview=full&steps=true&geometries=geojson&source=first&access_token=${ mapboxgl.accessToken}`
        
    return url            
}

async function fetchData() {
    let routeGeoJSON

    if(placeCoords.length < 1) {
      routeGeoJSON = turf.featureCollection([])
     
    } 
    else {
      const query = await fetch(assembleQueryURL(), { method: 'GET' });
      const response = await query.json();
      routeGeoJSON = turf.featureCollection([
      turf.feature(response.trips[0].geometry)
      ]);
  
      map.getSource('dropoffs-symbol').setData(dropoffs)
    } 
    map.getSource('route').setData(routeGeoJSON);
}
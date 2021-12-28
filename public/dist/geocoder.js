//DOM és változók
mapboxgl.accessToken = 'pk.eyJ1IjoiaG9yMXowbiIsImEiOiJja3VpajVld3QwbzZ0MnduNmdpODk0Zjg3In0.w-7i3mIEj_9FNReGD22ejg';
const inputDiv = document.getElementById("order-input")
const címInput = document.getElementById("cím")
const coordsInput1 = document.getElementById("coords1")
const coordsInput2 = document.getElementById("coords2")

//mapbox input a cím számára
const geocoder = new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    types: 'place,postcode,locality,neighborhood, address, poi, region, district',
    placeholder: 'Az ön címe',
    bbox: [18.082896800358185,47.75879642803315, 18.162576424962936,47.78159906541924]
});
geocoder.addTo(inputDiv) 

geocoder.on('result', (e) => {
    let result = e.result
    let cím = result.place_name
    let coords = result.center

    címInput.value = cím
    coordsInput1.value = coords[0]
    coordsInput2.value = coords[1]
});
// TO MAKE THE MAP APPEAR YOU MUST
	// ADD YOUR ACCESS TOKEN FROM
	// https://account.mapbox.com
	mapboxgl.accessToken =mapToken;
const map = new mapboxgl.Map({
container: 'map', // container ID
// Choose from Mapbox's core styles, or make your own style with Mapbox Studio
style: 'mapbox://styles/mapbox/streets-v12', // style URL
center: listing.geomatry.coordinates, // starting position [lng, lat]
zoom: 9 // starting zoom
});



 const marker =new mapboxgl.Marker({color:'red'})
 .setLngLat(listing.geomatry.coordinates)
 .setPopup(
	new mapboxgl.Popup({offset:25})
.setHTML(`<h4>${listing.title}</h4><p>Exact Location Will be provided after booking</p>`)
 )
 .addTo(map);
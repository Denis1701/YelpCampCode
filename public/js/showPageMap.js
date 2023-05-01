mapboxgl.accessToken = mapToken;

const campgroundParsed = (JSON.parse(campground));

const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v10', // style URL
    center: campgroundParsed.geometry.coordinates, // starting position [lng, lat]
    zoom: 8, // starting zoom
});

map.addControl(new mapboxgl.NavigationControl());

new mapboxgl.Marker()
    .setLngLat(campgroundParsed.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({ offset: 25 })
            .setHTML(
                `<h3>${campgroundParsed.title}</h3>
        <p>${campgroundParsed.location}</p>`
            )
    )
    .addTo(map);
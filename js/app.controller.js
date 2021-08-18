import { locService } from './services/loc.service.js'
import { mapService } from './services/map.service.js'

window.onload = onInit;
window.onAddMarker = onAddMarker;
window.onPanTo = onPanTo;
window.onGetLocs = onGetLocs;
window.onGetUserPos = onGetUserPos;

function onInit() {
    mapService.initMap()
        .then((map) => {
            console.log('Map is ready');
            console.log('Map!', map);
            map.addListener("click", (mapClicked) => {
                addMarker(mapClicked.latLng).then(() =>
                    confirm('Do you want to add this location to your locations?')
                )
            })
        })
        .catch(() => console.log('Error: cannot init map'));
}

function addMarker(loc) {
    var marker = new google.maps.Marker({
        position: loc,
        map: mapService.getMap(),
        title: 'Hello World!'
    });
    return Promise.resolve(marker);
}

// This function provides a Promise API to the callback-based-api of getCurrentPosition
function getPosition() {
    console.log('Getting Pos');
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject)
    })
}


function onAddMarker() {
    console.log('Adding a marker');
    mapService.addMarker({ lat: 32.0749831, lng: 34.9120554 });
}

function onGetLocs() {
    locService.getLocs()
        .then(locs => {
            console.log('Locations:', locs)
            document.querySelector('.locs').innerText = JSON.stringify(locs)
        })
}

function onGetUserPos() {
    var pos;
    getPosition()
        .then(pos => {
            console.log('User position is:', pos.coords);
            document.querySelector('.user-pos').innerText =
                `Latitude: ${pos.coords.latitude} - Longitude: ${pos.coords.longitude}`
            pos = pos.coords
        })
        .catch(err => {
            console.log('err!!!', err);
        })
    mapService.initMap(pos.latitude, pos.longitude)

}

function onPanTo() {
    console.log('Panning the Map');
    mapService.panTo(35.6895, 139.6917);
}

function renderTable() {

}
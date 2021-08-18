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
                console.log(mapClicked);
                addMarker(mapClicked.latLng)
                    .then(loc => ({ lat: loc.lat(), lng: loc.lng()}))
                    .then(doConfirm)
                    .then(loc => getDetailLoc(loc))
                    .then(details => locService.saveLoc(details))
            })
        })
        .catch(() => console.log('Error: cannot init map'));
}

function doConfirm(loc) {
    const res = confirm('Do you want to save this location?');
    return (res) ? Promise.resolve(loc) : Promise.reject('Not Now!')
}

function getDetailLoc(loc) {
    const name = prompt('Please enter location name');
    return Promise.resolve({ name, lat: loc.lat, lan: loc.lan, createdAt: Date.now() })
}

function addMarker(loc) {
    new google.maps.Marker({
        position: loc,
        map: mapService.getMap(),
        title: 'Hello World!'
    });
    return Promise.resolve(loc);
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
import { locService } from './services/loc.service.js'
import { mapService } from './services/map.service.js'

window.onload = onInit;
window.onAddMarker = onAddMarker;
window.onPanTo = onPanTo;
window.onGetLocs = onGetLocs;
window.onGetUserPos = onGetUserPos;
window.onGoToLocation = onGoToLocation;
window.onDeleteLocation = onDeleteLocation;

function onInit() {
    mapService.initMap()
        .then((map) => {
            console.log('Map is ready');
            console.log('Map!', map);
            map.addListener("click", (mapClicked) => {
                addMarker(mapClicked.latLng)
            })
        })
        .catch(() => console.log('Error: cannot init map'));
    locService.getLocs()
        .then(renderTable)
}

function renderTable(locations) {
    document.querySelector('h2').innerHTML = ` Location:${locations[locations.length-1].name}`
    var strHtml = '<tbody><th>id</th><th>Name</th><th>Lat</th><th>Lng</th><th>Weather</th><th>Created</th><th>Updated</th><th>Actions</th>'
    strHtml += locations.map(function(location) {
        return `
                <tr>
                <td>${location.id}</td>
                <td>${location.name}</td>
                <td>${location.lat}</td>
                <td>${location.lng}</td>
                <td>${location.weather}</td>
                <td>${location.createdAt}</td>
                <td>${location.updatedAt}</td>
                 <td>
                <button class="go" onclick="onGoToLocation(${location.lat},${location.lng})">Go</button>
                <button class="delete" onclick="onDeleteLocation('${location.id}',${locations})">Delete</button>
                </td>
                </tr>
             `
    })
    strHtml += '</tbody>'
    var elTable = document.querySelector('table');
    elTable.innerHTML = strHtml

}


function addMarker(loc) {
    var marker = new google.maps.Marker({
        position: loc,
        map: mapService.getMap(),
        title: 'Hello World!'
    });
    return marker;
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
    getPosition()
        .then(pos => {
            console.log('User position is:', pos.coords);
            document.querySelector('.user-pos').innerText =
                `
Latitude: $ { pos.coords.latitude } - Longitude: $ { pos.coords.longitude }
`
            mapService.initMap(pos.coords.latitude, pos.coords.longitude)

        })
        .catch(err => {
            console.log('err!!!', err);
        })

    // The location given is not 100% accurate.
}

function onPanTo() {
    console.log('Panning the Map');
    mapService.panTo(35.6895, 139.6917);
}

function onGoToLocation(lat, lng) {
    mapService.initMap(lat, lng)
}

function onDeleteLocation(locationId, locations) {
    locService.deleteLocation(locationId, locations)
}
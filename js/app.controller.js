import { locService } from './services/loc.service.js'
import { mapService } from './services/map.service.js'

window.onload = onInit;
window.onAddMarker = onAddMarker;
window.onPanTo = onPanTo;
window.onGetLocs = onGetLocs;
window.onGetUserPos = onGetUserPos;
window.onGoToLocation = onGoToLocation;
window.onDeleteLocation = onDeleteLocation;
// window.copyText = copyText;

function onInit() {
    mapService.initMap()
        .then((map) => {
            console.log('Map is ready');
            console.log('Map!', map);
            map.addListener("click", (mapClicked) => {
                console.log(mapClicked);
                addMarker(mapClicked.latLng)
                    .then(loc => ({ lat: loc.lat(), lng: loc.lng() }))
                    .then(doConfirm)
                    .then(loc => getDetailLoc(loc))
                    .then(details => locService.saveLoc(details))
                    .then(renderTable)
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
                <button class="delete" onclick="onDeleteLocation('${location.id}')">Delete</button>
                </td>
                </tr>
             `
    })
    strHtml += '</tbody>'
    var elTable = document.querySelector('table');
    elTable.innerHTML = strHtml

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
    getPosition()
        .then(pos => {
            console.log('User position is:', pos.coords);

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

function onDeleteLocation(locationId) {
    locService.deleteLocation(locationId)
    locService.getLocs()
        .then(renderTable)
}

// function copyText(lat, lng) {
//     var copyText = `My location is:latitude- ${lat}-longitude-${lng}`
//     copyText.select();
//     copyText.setSelectionRange(0, 99999);
//     navigator.clipboard.writeText(copyText.value);

//     alert("Copied the text: " + copyText.value);
// }
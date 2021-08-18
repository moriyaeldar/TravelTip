export const locService = {
    getLocs,
    deleteLocation
}


const locs = [
    { name: 'Greatplace', lat: 32.047104, lng: 34.832384 },
    { name: 'Neveragain', lat: 32.047201, lng: 34.832581 }
]

function getLocs() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(locs);
        }, 500)
    });
}

function deleteLocation(locationId, locations) {
    locations.splice(locationId, 1)
}
import { storageService } from './storage.service.js'
export const locService = {
    getLocs,
    deleteLocation,
    saveLoc
}


const locs = [
    { id: 0, name: 'Greatplace', lat: 32.047104, lng: 34.832384 },
    { id: 1, name: 'Neveragain', lat: 32.047201, lng: 34.832581 }
]
storageService.saveToStorage('locsDB', locs);

function getLocs() {
    const locs1 = storageService.loadFromStorage();
    if (locs1) return Promise.resolve(locs1)
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(locs);
        }, 500)
    });
}

function deleteLocation(locationId) {
    locs.splice(locationId, 1)

}

function saveLoc(details) {
    locs.push(details)
    details.id = (locs.length);
    storageService.saveToStorage('locsDB', locs)
}
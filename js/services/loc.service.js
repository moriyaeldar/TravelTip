import { storageService } from './storage.service.js'
export const locService = {
    getLocs,
    saveLoc
}


const locs = [
    { name: 'Greatplace', lat: 32.047104, lng: 34.832384 },
    { name: 'Neveragain', lat: 32.047201, lng: 34.832581 }
]
storageService.saveToStorage('locsDB',locs);

function getLocs() {
    const locs = storageService.loadFromStorage();
    if (locs) return Promise.resolve(locs)
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(locs);
            storageService.saveToStorage('locsDB',locs)
        }, 2000)
    });
}

function saveLoc(details) {
    locs.push(details)
    storageService.saveToStorage('locsDB',locs)
}
const FingerprintJS = require('/node_modules/@fingerprintjs/fingerprintjs');

const getVisitorId = async function(port) {
    const fpPromise = FingerprintJS.load();
    const fp = await fpPromise;
    const result = await fp.get();
    const visitorId = result.visitorId;

    document.getElementById('visitorId').textContent = `Your unique ID: ${visitorId}`;
};

getVisitorId();
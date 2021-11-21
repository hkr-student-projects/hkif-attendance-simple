const FingerprintJS = require('/node_modules/@fingerprintjs/fingerprintjs');

const getVisitorId = async function() {
    const fpPromise = FingerprintJS.load();
    const fp = await fpPromise;
    const result = await fp.get();
    const visitorId = result.visitorId;
    console.log(visitorId);

    const node = document.querySelector('.visitorId');
    if(node) {
        document.querySelector('.visitorId').textContent = "Visitor ID: " + visitorId;
    }
};

getVisitorId();
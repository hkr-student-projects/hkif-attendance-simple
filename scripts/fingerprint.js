const FingerprintJS = require('/node_modules/@fingerprintjs/fingerprintjs');

const getVisitorId = async function() {
    const fpPromise = FingerprintJS.load();
    const fp = await fpPromise;
    const result = await fp.get();
    const visitorId = result.visitorId;
    console.log(visitorId);

    document.querySelector('.visitorId').textContent = "Visitor ID: " + visitorId;
    //verifyUser(visitorId, 3000);

    return visitorId;
};

// const verifyUser = async function(visitorId, port) {
//     var HttpClient = function() {
//         this.get = function(aUrl, aCallback) {
//             var anHttpRequest = new XMLHttpRequest();
//             anHttpRequest.onreadystatechange = function() { 
//                 if (anHttpRequest.readyState == 4 && anHttpRequest.status == 200) {
//                     aCallback(anHttpRequest.responseText);
//                 } 
//             };
    
//             anHttpRequest.open("GET", aUrl, true );            
//             anHttpRequest.send(null);
//         };
//     };
    

//     var client = new HttpClient();
//         client.get(`http://localhost:${port}/whitelist/${visitorId}`, function(response) {

//         console.log("response: " + response);
//     });


//     // return new Promise((resolve, reject) => {
//     //     resolve({'country' : 'INDIA'});
//     // });
// };

getVisitorId();
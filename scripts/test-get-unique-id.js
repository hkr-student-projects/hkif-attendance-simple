const FingerprintJS = require('/node_modules/@fingerprintjs/fingerprintjs');

const getVisitorId = async function() {
    const fpPromise = FingerprintJS.load();
    const fp = await fpPromise;
    const result = await fp.get();
    const visitorId = result.visitorId;
    console.log(visitorId);

    verifyUser(visitorId, 3000);
};

const verifyUser = function(visitorId, port) {
    const token = getToken();

    var HttpClient = function() {
        this.post = function(aUrl, aCallback, json) {
            const anHttpRequest = new XMLHttpRequest();
            anHttpRequest.addEventListener('load', function() {
                aCallback(anHttpRequest.responseText);
            });
            anHttpRequest.open("POST", aUrl, true);  
            anHttpRequest.setRequestHeader("Content-Type", "application/json;charset=UTF-8"); 
            anHttpRequest.send(JSON.stringify(json));
            console.log("sent: " + JSON.stringify(json));
        };
    };
    

    var client = new HttpClient();
        client.post(`http://192.168.1.195:${port}/whitelist`, 
        function(response) {
            console.log("response: " + response);
            // const res = JSON.parse(response);
            // document.getElementById("qr-code").src=`${res.qr_image}`;
        }, 
        { 
            "visitorId": visitorId,
            "token": token
        }
    );


    // return new Promise((resolve, reject) => {
    //     resolve({'country' : 'INDIA'});
    // });
};

const getToken = function() {
    return document.getElementById('super-secret-token').value;
};

getVisitorId();
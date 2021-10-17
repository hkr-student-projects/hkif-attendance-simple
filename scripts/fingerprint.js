const FingerprintJS = require('/node_modules/@fingerprintjs/fingerprintjs');

const getVisitorId = async function() {
    const fpPromise = FingerprintJS.load();
    const fp = await fpPromise;
    const result = await fp.get();
    const visitorId = result.visitorId;
    console.log(visitorId);

    document.querySelector('.visitorId').textContent = "Visitor ID: " + visitorId;
    verifyUser(visitorId, 3000);

    return visitorId;
};

const verifyUser = async function(visitorId, port) {
    var HttpClient = function() {
        this.get = function(aUrl, aCallback, json) {
            const anHttpRequest = new XMLHttpRequest();
            anHttpRequest.onreadystatechange = function() { 
                if (anHttpRequest.readyState == 4 && anHttpRequest.status == 200) {
                    aCallback(anHttpRequest.responseText);
                } 
            };
            anHttpRequest.open("POST", aUrl, true);  
            anHttpRequest.setRequestHeader("Content-Type", "application/json;charset=UTF-8"); 
            anHttpRequest.send(JSON.stringify(json));
            console.log("sent: " + JSON.stringify(json));
        };
    };
    

    var client = new HttpClient();
        client.get(`http://192.168.1.195:${port}/verify`, 
        function(response) {
            console.log("response: " + response);
            document.getElementById("qr-code").src=`${response}`;
        }, 
        { 
            visitorId 
        }
    );


    // return new Promise((resolve, reject) => {
    //     resolve({'country' : 'INDIA'});
    // });
};

getVisitorId();
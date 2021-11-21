const FingerprintJS = require('/node_modules/@fingerprintjs/fingerprintjs');

const getVisitorId = async function(port) {
    const fpPromise = FingerprintJS.load();
    const fp = await fpPromise;
    const result = await fp.get();
    const visitorId = result.visitorId;
    console.log(visitorId);

    const node = document.querySelector('.visitorId');
    if(node) {
        document.querySelector('.visitorId').textContent = "Visitor ID: " + visitorId;
        verifyUser(visitorId, port);
    }
};

const verifyUser = function(visitorId, port) {
    var HttpClient = function() {
        this.post = function(aUrl, aCallback, json) {
            const anHttpRequest = new XMLHttpRequest();
            // anHttpRequest.onreadystatechange = function() { 
            //     if (anHttpRequest.readyState == 4 && anHttpRequest.status == 200) {
            //         aCallback(anHttpRequest.responseText);
            //     } 
            // };
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
        client.post(`http://192.168.1.195:${port}/verify`, 
        function(response) {
            console.log("response: " + response);
            const res = JSON.parse(response);
            document.getElementById("qr-code").src=`${res.qr_image}`;
        }, 
        { 
            "visitorId": visitorId
        }
    );


    // return new Promise((resolve, reject) => {
    //     resolve({'country' : 'INDIA'});
    // });
};

const subscribe = function(port) {
    const es = new EventSource(`http://192.168.1.195:${port}/stream`);
    es.addEventListener('event-updated-qr-code', ev => {
        //alert(ev.data);
        document.getElementById("qr-code").src=`${ev.data}`;
    });
};

getVisitorId(3000);
subscribe(3000);
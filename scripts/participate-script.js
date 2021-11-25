const FingerprintJS = require('/node_modules/@fingerprintjs/fingerprintjs');

const getVisitorIdEnroll = async function() {
    const fpPromise = FingerprintJS.load();
    const fp = await fpPromise;
    const result = await fp.get();
    const visitorId = result.visitorId;
    console.log(visitorId);

    enroll(visitorId, 3000);

    //return visitorId;
};

const enroll = function(visitorId, port) {
    const token = getToken();
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
            console.log("sent: " + JSON.stringify(json));
            anHttpRequest.send(JSON.stringify(json));
        };
    };
    

    var client = new HttpClient();
        client.post(`http://192.168.1.195:${port}/register/enroll`, 
        function(response) {
            console.log("response: " + response);
            document.write(response);
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

getVisitorIdEnroll();
// const btn = document.querySelector('.enroll');
// btn.addEventListener('click', getVisitorIdEnroll);
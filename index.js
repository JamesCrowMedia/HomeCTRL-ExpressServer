const express = require('express');
const app = express();
const cmd = require('node-cmd');


const serviceAccount = require('./secret/service-account.json');
const firebase = require("firebase-admin");

let currentState = {}
const rfSwitch = '../rfoutlet/codesend'

firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount),
  databaseURL: "https://homectrl-jamescrow.firebaseio.com"
});

//firebase.database.enableLogging(true);

var ref = firebase.app().database().ref('rfLights');


ref.once('value')
 .then(function (snap) {
     currentState = snap.val();
 console.log('currentState', currentState);
 });

 ref.on('child_changed',function(childsnapshot,prevchildname){
    console.log(prevchildname);
    let change = childsnapshot.val();

    if(change.state === true || change.state === 'true'){
        console.log(change.desc + ': on - ' + change.on)
        cmd.run(rfSwitch + ' ' + change.on);
        setTimeout(function () {
            cmd.run(rfSwitch + ' ' + change.on);  
            setTimeout(function () {
                cmd.run(rfSwitch + ' ' + change.on);  
            }, 500);
        }, 500);
    } else {
        console.log(change.desc + ': off - ' + change.off)
        cmd.run(rfSwitch + ' ' + change.off);  
        setTimeout(function () {
            cmd.run(rfSwitch + ' ' + change.off);  
            setTimeout(function () {
                cmd.run(rfSwitch + ' ' + change.off);  
            }, 500);
        }, 500);
              
    }

     
    ref.once('value')
    .then(function (snap) {
        
    //console.log('snap.val()', snap.val());
    });
  }) ;

app.get('/', (req, res) => res.send(currentState))
app.listen(3000, () => console.log('Example app listening on port 3000!'))



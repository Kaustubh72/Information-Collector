const express = require('express');
const request = require('request');
const cheerio = require('cheerio');
const iplocate = require('node-iplocate');
var os = require('os');
var fs = require('fs');
const prettier = require("prettier");
const batteryLevel = require('battery-level');
const app = express();

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PATCH, DELETE, OPTIONS');
    next();
  });


  var json=[];
  var dt=[];
  var ip=[];
  var loc=[];
  var device=[];
  var battery=[];
let ts = Date.now();

let date_ob = new Date(ts);
let date = date_ob.getDate();
let month = date_ob.getMonth() + 1;
let year = date_ob.getFullYear();

dt.push({year:year, month: month, date: date});

var getIP = require('ipware')().get_ip;
app.use(async function(req, res, next) {
    var ipInfo = getIP(req);
    p=ipInfo.clientIp;
    ip.push({ip: ipInfo.clientIp});
    var p=ipInfo.clientIp;
    await iplocate(p).then((results) => {
      loc.push({results});
    });
    //console.log(ipInfo.clientIp);
    next();
});


device.push({host:os.hostname(),ram:os.totalmem()/1048576,type:os.type(),release: os.release(),platform: os.platform(), network:os.networkInterfaces()});


 
batteryLevel().then(level => {
  //console.log(level);
    battery.push({level});
});

json.push({date:dt, ip:ip,location:loc,device:device,battery:battery});


app.get('/', async function(req, res) 
{
    res.send(prettier.format(JSON.stringify(json,null,4)));
});

app.listen(process.env.PORT || 5000);
module.exports = app;

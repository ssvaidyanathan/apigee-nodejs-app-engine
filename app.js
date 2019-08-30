'use strict';

var express = require('express');

var app = express();

app.get('/', function(req,res){
  var keys = getApigeeVariables(req.headers);
  res.set(keys);
  res.status(200).send('Hello from Apigee !!! ');
});

var server = app.listen(process.env.PORT || '8080', function(){
  console.log('App listening on Port %s', server.address().port);
  console.log('Press Ctrl+C to quit');
});

function getApigeeVariables(headers){
  var apigeeVars = {};
  var keys = Object.keys(headers);
  for (var key of keys){
  	if(key.startsWith("x-var-")){
  		apigeeVars[key] = headers[key];
  	}
  }
  return apigeeVars;
}
let {google} = require('googleapis');

module.exports = function(RED) {
    function gSheet(config) {
        RED.nodes.createNode(this, config);
        var node = this;
        this.creds = JSON.parse(RED.nodes.getNode(config.creds).credentials.creds);
        this.method = config.method;
        this.flatten = config.flatten
        node.on('input', function(msg) {
          if(!config.sheet){
            this.sheet = msg.sheet
          } else {
            this.sheet = config.sheet;
          }
          if(!config.cells){
            if (msg.cells){
              this.cells = msg.cells
            } else{
              this.cells = msg.topic // May remove this in the future now that msg.cells is the recommended approach,
            }
          } else {
            this.cells = config.cells;
          }
			    let jwtClient = new google.auth.JWT(
			       this.creds.client_email,
			       null,
			       this.creds.private_key,
			       ['https://www.googleapis.com/auth/spreadsheets',
			        'https://www.googleapis.com/auth/drive']
			     );
           let sheet = this.sheet;
           let cells = this.cells;
           let method = this.method;
           let flaten = this.flatten;
           let sheets = google.sheets('v4');
			     jwtClient.authorize(function (err, tokens) {
			       if (err) {
			         node.error("Auth Error: " +err);
			         return;
			       } else {
               switch(method) {
                 case 'get':
    				       sheets.spreadsheets.values.get({
    				         auth: jwtClient,
    				         spreadsheetId: sheet,
    				         range: cells
    				       }, function (err, response) {
    				         if (err) {
    						       node.error('The API returned an error: ' + err, msg);
    				         } else {
                       if (flaten){
                        msg.payload = response.data.values.flat();
                       } else {
                        msg.payload = response.data.values;
                       }
    						       node.send(msg);
    				         }
    			         });
                   break;
                 case 'append':
                   if (Array.isArray(msg.payload)){
                     if (Array.isArray(msg.payload[0])){
                       msg.payload = {"values": msg.payload}
                     } else {
                       msg.payload = {"values": [msg.payload]}
                     }   
                   } else{
                     msg.payload = {"values": [[msg.payload]]}
                   }
    				       sheets.spreadsheets.values.append({
    				         auth: jwtClient,
    				         spreadsheetId: sheet,
    				         range: cells,
                     valueInputOption: "USER_ENTERED",
                     insertDataOption: "INSERT_ROWS",
                     resource: msg.payload
    				       }, function (err, response) {
    				         if (err) {
    						       node.error('The API returned an error: ' + err, msg);
    				         } else {
    						       msg.payload = response.data.updates;
    						       node.send(msg);
    				         }
    			         });
                   break;
                 case 'update':
                   if (Array.isArray(msg.payload)){
                     if (Array.isArray(msg.payload[0])){
                       msg.payload = {"values": msg.payload}
                     } else {
                       msg.payload = {"values": [msg.payload]}
                     }   
                   } else{
                     msg.payload = {"values": [[msg.payload]]}
                   }
    				       sheets.spreadsheets.values.update({
    				         auth: jwtClient,
    				         spreadsheetId: sheet,
    				         range: cells,
                     valueInputOption: "USER_ENTERED",
                     resource: msg.payload
    				       }, function (err, response) {
    				         if (err) {
    						       node.error('The API returned an error: ' + err, msg);
    				         } else {
    						       msg.payload = response.data
    						       node.send(msg);
    				         }
    			         });
                   break;
                 case 'clear':
    				       sheets.spreadsheets.values.clear({
    				         auth: jwtClient,
    				         spreadsheetId: sheet,
    				         range: cells,
    				       }, function (err, response) {
    				         if (err) {
    						       node.error('The API returned an error: ' + err, msg);
    				         } else {
    						       msg.payload = response.data;
    						       node.send(msg);
    				         }
    			         });
                  break;             
               } 
             }
			     });
        });
  }
  
  
  
  function gauth(n){
     RED.nodes.createNode(this, n);
     this.creds = n.creds;
  }
  RED.nodes.registerType("GSheet",gSheet);
  RED.nodes.registerType("gauth",gauth,{
   credentials: {
     creds: {type:"text"}
   }
  });  
}

function flatten(arr) {
  if (arr.length == 1 && arr[0].length == 1){
      return arr[0][0];
  } else if (arr.length != 1 && arr[0].length == 1){
    return arr.reduce((acc, val) => acc.concat(val), []);
  } else if (arr.length == 1 && arr[0].length != 1){
    return arr.reduce((acc, val) => acc.concat(val), []);
  } else{
    return arr
  }
}
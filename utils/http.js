function response() {
   return {
      json: function(data) {
         return ContentService
            .createTextOutput(JSON.stringify(data))
            // .setMimeType(ContentService.MimeType.JSON);
      }
   }
}

function doGet(e) {
  if(!e.parameter.action || !getRoutes[e.parameter.action]) return response().json({status:true,message:"no action",result:null});
  
  const route = getRoutes[e.parameter.action];

  const mws = route.middelware || [];
  let middelware = null;
  mws.forEach(mw=>{
    if(middelware)return;
    middelware = middelwares()[mw](e);
  });
  if(middelware) return response().json(middelware); 
  
  return route.callback(e);
}

function doPost(e) {
  if(!e.parameter.action || !postRoutes[e.parameter.action]) return response().json({status:true,message:"no action",result:null});

  const route = postRoutes[e.parameter.action];
  
  const mws = route.middelware || [];
  let middelware = null;
  mws.forEach(mw=>{
    if(middelware)return;
    middelware = middelwares()[mw](e);
  });
  if(middelware) return response().json(middelware);

  return route.callback(e);
}


const settings = require('./settings.json');

require('isomorphic-form-data')
require('isomorphic-fetch')
const { addFeatures, deleteFeatures } = require('@esri/arcgis-rest-feature-layer');
const { UserSession } = require('@esri/arcgis-rest-auth');
const fetch = require('node-fetch');

const session = new UserSession({
  username: settings.username,
  password: settings.password
})

const serviceUrl = "https://services7.arcgis.com/lTrEzFGSU2ayogtj/arcgis/rest/services/output_feature/FeatureServer/0";

session.getToken('https://www.arcgis.com/sharing/rest/generateToken')
  .then(response => {
    
    deleteFeatures({
      url: serviceUrl,
      authentication: session,
      where: "1=1"
    })
    .then(done => {
      let url = "http://localhost:8080/koop-provider-csv-cofid-esri/:host/FeatureServer/0/query?f=json";

      fetch(url, { 
        method: "Get", 
        qs: {
          f: "geojson"
        }
      })
      .then(res => res.json())
      .then((json) => {
          
          if(json.features){
            
            var features = json.features;
            var i,j,temparray,chunk = 100;
            
            for (i=0,j=features.length; i<j; i+=chunk) {
                temparray = features.slice(i,i+chunk);
                addFeatures({
                  url: serviceUrl,
                  authentication: session,
                  features: temparray
                })
                .then(response => console.log(response))
                .catch(error => { console.log('caught', error.message); });
            }
          }else{
            console.log("No se han podido recuperar datos")
          }
            
      });
    })
    .catch(error => { console.log('caught', error.message); });
  })
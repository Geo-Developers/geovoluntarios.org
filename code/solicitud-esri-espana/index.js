if(!process.argv[2]){
  console.log('Please run: node index.js "Tue, 31 Mar 2020 00:00:00 GMT"')
  return -1;
}else{
    const d = new Date(process.argv[2])
    if(!isNaN(d.getTime())){
      require('isomorphic-form-data')
      require('isomorphic-fetch')

      const { provincias } = require('./template_provincias.js');
      const { addFeatures } = require('@esri/arcgis-rest-feature-layer');
      const { UserSession } = require('@esri/arcgis-rest-auth');

      const session = new UserSession({
        username: "user",
        password: "pass"
      })
      //
      session.getToken('https://www.arcgis.com/sharing/rest/generateToken')
        .then(response => {
          // console.log(response)
          addFeatures({
            url: "https://services7.arcgis.com/lTrEzFGSU2ayogtj/arcgis/rest/services/Afectados_por_coronavirus_por_provincia_en_Espania/FeatureServer/0",
            authentication: session,
            features: provincias(process.argv[2])
          })
            .then(response)

        })
    }else{
      console.log("Invalid date format!")
    }
}

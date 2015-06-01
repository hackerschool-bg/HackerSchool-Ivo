var map;
var geocoder;

function modifyStateCombobox(){
   var x = document.getElementById("State");
   if(x.value==""){
      var totalLength = x.length;
      while(totalLength--){
         x.remove(totalLength);
      }
      
      
      var url = "latestJSON.json";
      $.getJSON( url, {
         format: "json"
      })
      .done(function( data ) {
         var option = document.createElement("option");
         option.text = data[0].state;
         x.add(option);
         
         for(var i=0; i<data.length; i++){
           var flag=0;
           for(var j=0; j<x.length; j++){
              if(x[j].value==data[i].state){
               flag++;
              }
           }
           if(flag==0){
               var option = document.createElement("option");
               option.text = data[i].state;
               x.add(option);
           }
         } 
      });
   }
}

function modifyCombobox(){
   var x = document.getElementById("City");
   var totalLength = x.length;
   while(totalLength--){
      x.remove(totalLength);
   }
   
   var url = "latestJSON.json";
   $.getJSON( url, {
      format: "json"
   })
    .done(function( data ) {
         for(var i=0; i<data.length; i++){
           if(document.getElementById('State').value == data[i].state){
              var option = document.createElement("option");
              option.text = data[i].city;
              x.add(option);
           }
         } 
    });
}


   function parseJson() {
      var url = "latestJSON.json";
      $.getJSON( url, {
         format: "json"
  })
    .done(function( data ) {
         /*for(var j=0; j < data.length; j++){
            var timeout=j*1000;
            setTimeout(console.log(data[j].storeId + " " + data[j].address),timeout);
            
         }*/
         
         //if(document.getElementById('City'))
         
         
         for(var i=0; i<data.length; i++){
            //setTimeout(console.log(data[i].storeId + " " + data[i].address),1000);
            
            
            
            if(document.getElementById('City').value == data[i].city){
               codeAddress(data[i].city + " " + data[i].address);
            }
         } 
    });
};   
      
     // codeAddress(data.stores[i].city + " " + data.stores[i].address);
   
   
   function codeAddress(address) {setInterval(
      geocoder.geocode( { 'address': address}, function(results, status) {
         map.setCenter(results[0].geometry.location);
         var coordInfoWindow = new google.maps.InfoWindow();
         coordInfoWindow.setContent("City: " + address + "<br>" + " Coordinates: " + results[0].geometry.location);
         coordInfoWindow.setPosition(results[0].geometry.location);
         coordInfoWindow.open(map);
      })   
   ,1000)}  
   
   
   window.onload= function(){
   geocoder = new google.maps.Geocoder();
   map = new google.maps.Map(document.getElementById('map-canvas'), {
      zoom: 4,
      center: new google.maps.LatLng(38,-92)
   });
      
   modifyStateCombobox();   
   //parseJson();
   };
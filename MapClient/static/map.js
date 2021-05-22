document.addEventListener('DOMContentLoaded', function () {
	
var mymap = L.map('mapid').setView([3.42335,-76.52086], 12);
L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', 
{
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(mymap);


listRoutes = [];
listMarkers = [];

//mapMarkers1 = [];


var busIcon = L.icon({
    iconUrl: '../static/leaflet/images/icon-green50.png',
    shadowUrl: '../static/leaflet/images/icon-green50_sombra.png',
    iconAnchor:   [17, 46],
    popupAnchor:  [0, -46]
});


//Topic Name
var source = new EventSource('/topic/geodatamio'); 
source.addEventListener('message', function(e)
{
   console.log('Message');
   obj = JSON.parse(e.data);
   console.log(obj);
  
  //listRoutes.indexOf(obj.ruta) === -1 ? listRoutes.push(obj.ruta) : console.log("This route already exists");
  if (listRoutes.indexOf(obj.ruta) === -1)
  {
	listRoutes.push(obj.ruta);
	routesFactory(obj.ruta);
	addRouteListing(obj.ruta);
  }
else
  {
	console.log("Esta ruta ya existe !");
  }
  

  for (var i = 0; i < listRoutes.length; i++)
  {
     if(obj.ruta == listRoutes[i]) 
     {
	 //console.log(listMarkers[i].name);
	 var newLatLng = new L.LatLng(obj.latitude, obj.longitude);
         listMarkers[i].marker.setLatLng(newLatLng);
		 listMarkers[i].marker.setIcon(busIcon);
         listMarkers[i].marker.addTo(mymap).bindPopup("<b>Ruta: </b>"+listMarkers[i].name+"<br>"+"Latitud: "+ listMarkers[i].marker._latlng.lat+"<br>"+"Longitud: "+listMarkers[i].marker._latlng.lng);
     }
  }

   /*if(obj.ruta == 'A44B') 
   {
      for (var i = 0; i < mapMarkers1.length; i++) 
      {
         mymap.removeLayer(mapMarkers1[i]);
      }
      marker1 = L.marker([obj.latitude, obj.longitude]).addTo(mymap).bindPopup("<b>A44B</b>");
      mapMarkers1.push(marker1);
  }*/

   //console.log(listRoutes);
   //console.log(listMarkers);

}, true);


function routesFactory(routeName)
{
  console.log('Nueva ruta creada: ' + routeName);
  routeObj={
    name:routeName,
    icon:'icon.png',
    marker: L.marker()
  };
  listMarkers.push(routeObj);
}

function addRouteListing(routeName)
{
   var node = document.createElement("LI"); 
   var textnode = document.createTextNode(routeName); 
   node.appendChild(textnode);                            
   document.getElementById("routes_list").appendChild(node);     
}


});




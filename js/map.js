
var database = new Firebase( // Insert your firebase DB address here //
  );
var form_id = 'placeForm'; // Change your map form id if necessary //

var mapVars = { // Play with different map attributes here //  
  style : [
    {
      stylers: [
        { hue: "#00ffe6" },
        { saturation: -20 }
      ]
    },{
      featureType: "road",
      elementType: "geometry",
      stylers: [
        { lightness: 100 },
        { visibility: "simplified" }
      ]
    },{
      featureType: "road",
      elementType: "labels",
      stylers: [
        { visibility: "off" }
      ]
    }
  ],
  canvas : document.getElementById("map-canvas"),
  centerCoord : { // Nice center point over North America //
  lat: 39.00, 
  lng: -100.00 
  },
  zoomLevel: 4 //Works well on desktops, may need to adjust/script for mobile friendly
};



// Thats it!  The rest shouldn't need any modifications. //


var Map = function (mapVars) {
  var mapCenterPoint = new google.maps.LatLng(
    mapVars.centerCoord.lat, 
    mapVars.centerCoord.lng
  );

  var mapOptions = {
    center: mapCenterPoint,
    zoom: mapVars.zoomLevel,
  }; 
  
  var map = new google.maps.Map(mapVars.canvas, mapOptions);
  map.setOptions({styles: mapVars.style});
  
  return map;
};


var Marker = function(map) {

  setMarker = function (entry) {
    var newMarker = marker(entry);
    addMarkerListener(newMarker, infoWindow(entry));
    newMarker.setMap(map);
  };

  addMarkerListener = function (marker, infoWindow) {
      google.maps.event.addListener(marker, 'click', function() {
        infoWindow.open(map,marker);
      });
  };

  marker = function (entry) {
    return new google.maps.Marker({
      position: latLong(entry),
      map: map,
      title: entry.name,
      animation: google.maps.Animation.DROP
    });
  };

  latLong = function (entry) {
    return new google.maps.LatLng(entry.lat, entry.long); 
  };

  infoWindow = function (entry) {
    var infoWindowContent = contentHtml(entry);
    return new google.maps.InfoWindow({content: infoWindowContent});
  };


  contentHtml = function(entry) {
    return '<div id="content">'+
    '<div id="siteNotice">'+
    '</div>'+
    '<h1 id="firstHeading" class="firstHeading"><h3>' + entry.name + '</h3>' +
    '<div id="bodyContent">'+
    '<p>' + entry.comments + '</p>'+
    '<p>Submitted by:' + entry.submitter + '</p>'+
    '</div>'+
    '</div>';
  };
  return setMarker;
};



window.onload = function () {
  var map = Map(mapVars);
  var marker = Marker(map);
  var form = document.getElementById(form_id);
  
  database.on('child_added', function(snapshot) {
    var entry = snapshot.val();
    marker(entry);
  });

  var getNewEntry = function() {
    var place = autocomplete.getPlace();
    var newEntry = {
        name:place.name,
        lat:place.geometry.location.k,
        long:place.geometry.location.B,
        submitter:document.getElementById('submitter').value,
        comments:document.getElementById('commentsField').value,
    };
    return newEntry;
  };

  function postFormData (event) {
    event.preventDefault();
    confirmSubmission();
    database.push(getNewEntry());
  }

  // form.submit(function( event ) {
  //   confirmSubmission();
  //   event.preventDefault();
  //   database.push(getNewEntry());
  // });

  function confirmSubmission () {
    form.style.display = "none";
    var Confirmation = document.getElementById('confirmation');
    Confirmation.innerHTML = 'Thank you for your submission!';
  };

  (function () { 
    if(form.addEventListener){
      form.addEventListener("submit", postFormData, false); 
    }else if(form.attachEvent){
      form.attachEvent('onsubmit', postFormData);            
    }
  })();
}; 




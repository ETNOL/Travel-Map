
// Insert your Firebase database here //
var database = new Firebase(
"https://amber-fire-3032.firebaseio.com/demoDB"
);

// Change your map form id if necessary //
var form = $('#placeForm')

// Play with different map attributes here, change your canvas id if different //
var mapVars = {
  
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
  canvas : $('#map-canvas')[0],
  centerCoord : { 
  // Nice center point over North America //
  lat:39.00, 
  lng:-100.00 
  },
  zoomLevel:4
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


var Marker = function(entry, map) {

  this.setMarker = function () {
    var newMarker = marker();
    var newInfoWindow = infoWindow();
    addMarkerListener(newMarker, newInfoWindow);
    newMarker.setMap(map);
  };

  addMarkerListener = function (marker, infoWindow) {
      google.maps.event.addListener(marker, 'click', function() {
        infoWindow.open(map,marker);
      });
  };

  marker = function () {
    return new google.maps.Marker({
      position: latLong(),
      map: map,
      title: entry.name,
      animation: google.maps.Animation.DROP
    });
  };

  latLong = function () {
    return new google.maps.LatLng(entry.lat, entry.long); 
  };

  infoWindow = function () {
    var infoWindowContent = contentHtml();
    return new google.maps.InfoWindow({content: infoWindowContent});
  };


  contentHtml = function() {
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
};


(function () {
  var map = Map(mapVars);
  database.on('child_added', function(snapshot) {
    var entry = snapshot.val();
    newMarker = new Marker(entry, map);
    newMarker.setMarker();
  });

  form.submit(function( event ) {
    var Submitter = $('#submitter').val();
    var Comments = $('#commentsField').val();
    var place = autocomplete.getPlace();
    form.hide();
    confirmSubmission();
    event.preventDefault();
    database.push({
                        name:place.name,
                        lat:place.geometry.location.k,
                        long:place.geometry.location.B,
                        submitter:Submitter,
                        comments:Comments });
  });

  function confirmSubmission() {
    var Confirmation = $('#confirmation');
    Confirmation.text('Thank you for your submission!');
  };
})(); 





var database = new Firebase(
// Insert your database URL here//
);
var mapStyle = [
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
];


var form = $('#placeForm');

var mapCenterCoord = { 
  // Nice center point over North America //
  lat:39.00, 
  lng:-100.00 
};

var mapZoomLevel = 4;

var mapCenterPoint = new google.maps.LatLng(mapCenterCoord.lat, mapCenterCoord.lng);

var mapOptions =  {
  center: mapCenterPoint,
  zoom: mapZoomLevel,
}; 

var map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);

map.setOptions({styles: mapStyle});

// Populates map at load and retrieves new entries in real-time //
database.on('child_added', function(snapshot) {
  var entry = snapshot.val();
  newMarker = new Marker(entry, map);
  newMarker.setMarker();
});



//Fires a DB push on form submit and hides form//
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

// Constructor for map markers and info windows //
var Marker = function(entry, map) {

  this.setMarker = function () {
    var newMarker = this.marker();
    var newInfoWindow = this.infoWindow();
    this.addMarkerListener(newMarker, newInfoWindow);
    newMarker.setMap(map);
  };

  this.addMarkerListener = function (marker, infoWindow) {
      google.maps.event.addListener(marker, 'click', function() {
        infoWindow.open(map,marker);
      });
  };

  this.marker = function () {
    return new google.maps.Marker({
      position: this.latLong(),
      map: map,
      title: entry.name,
      animation: google.maps.Animation.DROP
    });
  };

  this.latLong = function () {
    return new google.maps.LatLng(entry.lat, entry.long); 
  };

  this.infoWindow = function () {
    var infoWindowContent = this.contentHtml();
    return new google.maps.InfoWindow({content: infoWindowContent});
  };


  this.contentHtml = function() {
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


// Styling settings for Google Maps //
var styleArray = [
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


//Set Up Google Maps//
var mapOptions = {
  //Coords to center map at //
  center: new google.maps.LatLng(39.00, -100.00),
  // Zoom level.  You may want to change this to respond to viewport. //
  zoom: 4,
};

var map = new google.maps.Map(document.getElementById("map-canvas"),
  mapOptions);
map.setOptions({styles: styleArray});

//Sets up DB connection //
var PlaceRef = new Firebase('https://amber-fire-3032.firebaseIO.com/demoDB');

// Populates map at load and retrieves new entries in real-time //
PlaceRef.on('child_added', function(snapshot) {
  var child = snapshot.val();
  var location = child.location;
  var name = child.name;
  var lat = child.lat;
  var long = child.long;
  var comments = child.comments;
  var submitter = child.submitter;
    setMarker(lat, long, name, comments, submitter );

});

// Form Var //
var Submit = $('#placeForm');


//Fires a DB push on form submit and hides form//
$(Submit).submit(function( event ) {
  var Confirmation = $('#confirmation');
	var Submitter = $('#submitter').val();
  var Comments = $('#commentsField').val();
  var place = autocomplete.getPlace();
	Submit.hide();
	Confirmation.text('Thank you for your submission!');
	event.preventDefault();
  PlaceRef.push({
                      name:place.name,
                      lat:place.geometry.location.k,
                      long:place.geometry.location.A,
                      submitter:Submitter,
                      comments:Comments });
});


// Constructor for map markers and info windows //
var setMarker = function(lat, long, name, comment, submitter) {

  // HTML for Info Windows //
  var contentString = '<div id="content">'+
  '<div id="siteNotice">'+
  '</div>'+
  '<h1 id="firstHeading" class="firstHeading"><h3>' + name + '</h3>' +
  '<div id="bodyContent">'+
  '<p>' + comment + '</p>'+
  '<p>Submitted by:' + submitter + '</p>'+
  '</div>'+
  '</div>';

  // Build lat, long object //
  var myLatlng = new google.maps.LatLng(lat, long);

  // Marker Constructor //
  var marker = new google.maps.Marker({
    position: myLatlng,
    map: map,
    title: name,
    animation: google.maps.Animation.DROP
  });

  // Info Window Constructor //
  var infoWindow = new google.maps.InfoWindow({content: contentString});

  // Add listener for Window on Marker click //
  google.maps.event.addListener(marker, 'click', function() {
    infoWindow.open(map,marker);
  });

  // Set marker on map //
  marker.setMap(map);
};




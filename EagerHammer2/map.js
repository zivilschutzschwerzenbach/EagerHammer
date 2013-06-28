var $map;
var $latlng;
var overlay;
var featureTable_;
var lineCounter_ = 0;
var shapeCounter_ = 0;
var markerCounter_ = 0;
var colorIndex_ = 0;
var shape; 

var COLORS = [["red", "#ff0000"], ["orange", "#ff8800"], ["green","#008000"],
              ["blue", "#000080"], ["purple", "#800080"]];

function initialize() {
	var $latlng = new google.maps.LatLng(47.381211, 8.68);
	var myOptions = {
			zoom: 14,
			center: $latlng,
			mapTypeId: google.maps.MapTypeId.ROADMAP,
			mapTypeControlOptions: {
				style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
				position: google.maps.ControlPosition.BOTTOM_RIGHT },
				zoomControl: true,
				zoomControlOptions: {
					style: google.maps.ZoomControlStyle.LARGE,
					position: google.maps.ControlPosition.RIGHT_BOTTOM
				},
				scaleControl: true,
				scaleControlOptions: {
					position: google.maps.ControlPosition.BOTTOM_RIGHT
				},
				streetViewControl: false,
				panControl:false,

	};
	shape = new google.maps.Polygon({
	  strokeColor: '#ff0000',
	  strokeOpacity: 0.8,
	  strokeWeight: 2,
	  fillColor: '#ff0000',
	  fillOpacity: 0.35,
	  draggable: true,
	  editable: true
	});


	$map = new google.maps.Map(document.getElementById("map_canvas"),
    myOptions);

	overlay = new google.maps.OverlayView();
	overlay.draw = function() {};
	overlay.setMap($map);
	
    featureTable_ = document.getElementById("featuretbody");
} 

function placeMarker(location,image) {
  var marker = new google.maps.Marker({
  position: location, 
  map: $map,
  draggable: true,
  icon: image
  });
  
  var cells = addFeatureEntry("Placemark " + (++markerCounter_),"black");
  updateMarker(marker, cells);

}

function select(buttonId) {
  document.getElementById("hand_b").className="unselected";
  document.getElementById("shape_b").className="unselected";
  document.getElementById("line_b").className="unselected";
  document.getElementById("placemark_b").className="unselected";
  document.getElementById(buttonId).className="selected";
}

function stopEditing() {
  select("hand_b");
}

function getColor(named) {
  return COLORS[(colorIndex_++) % COLORS.length][named ? 0 : 1];
}

function getIcon(color) {
  var icon = {
  		url:"http://google.com/mapfiles/ms/micons/" + color + ".png",
  		size: new google.maps.Size(32, 32),
  		anchor: new google.maps.Point(15, 32)
  };
  return icon;
}

function startShape() {
  select("shape_b");
  drawPolygon();
}

function startLine() {
  select("line_b");
  drawPolygon(false);
}

function drawPolygon(filled){
  var color = getColor(false);
  var poly = new google.maps.Polygon(shape);
  if ( filled == false ) {
  	poly.setOptions({fillOpacity: 0});
  }
  poly.setMap($map);
  google.maps.event.addListener($map, 'click', addPoint);
}

function addPoint(e) {
	var vertices = shape.getPath();
	vertices.push(e.latLng);
}

function addFeatureEntry(name, color) {
  currentRow_ = document.createElement("tr");
  var colorCell = document.createElement("td");
  currentRow_.appendChild(colorCell);
  colorCell.style.backgroundColor = color;
  colorCell.style.width = "1em";
  var nameCell = document.createElement("td");
  currentRow_.appendChild(nameCell);
  nameCell.innerHTML = name;
  var descriptionCell = document.createElement("td");
  currentRow_.appendChild(descriptionCell);
  featureTable_.appendChild(currentRow_);
  return {desc: descriptionCell, color: colorCell};
}



function placeMarkerOld() {
	  select("placemark_b");
	  listener = google.maps.event.addListener($map, "click", function(event) {
	    if (event.latLng) {
	      select("hand_b");
	      google.maps.event.removeListener(listener);
	      var color = getColor(true);
	      marker = placeMarkerNow(event.latLng,color);
	      var cells = addFeatureEntry("Placemark " + (++markerCounter_), color);
	      updateMarker(marker, cells);
	      google.maps.event.addListener(marker, "dragend", function() {
	        updateMarker(marker, cells);
	      });
	      google.maps.event.addListener(marker, "click", function() {
	        updateMarker(marker, cells, true);
	      });
	    }
	  });
	}

function placeMarkerNow(location,color) {
	  var marker = new google.maps.Marker({
	      position: location,
	      draggable: true,
	      map: $map,
	      icon: getIcon(color)
	  });
	  return marker
}
	
function updateMarker(marker, cells, opt_changeColor) {
  if (opt_changeColor) {
    var color = getColor(true);
    marker.setIcon(getIcon(color));
    cells.color.style.backgroundColor = color;
  }
  var latLng = marker.getPosition();
  cells.desc.innerHTML = "(" + Math.round(latLng.lng() * 1000) / 1000 + ", " +
  Math.round(latLng.lat() * 1000) / 1000 + ")";
}


var $map;
var $latlng;
var overlay;




function initialize() {
var $latlng = new google.maps.LatLng(47.381211, 8.68);
var myOptions = {
  zoom: 14,
  center: $latlng,
  mapTypeId: google.maps.MapTypeId.ROADMAP,
  mapTypeControlOptions: {
    style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
    position: google.maps.ControlPosition.TOP_RIGHT },
     zoomControl: true,
zoomControlOptions: {
    style: google.maps.ZoomControlStyle.LARGE,
    position: google.maps.ControlPosition.RIGHT_TOP
},
scaleControl: true,
scaleControlOptions: {
    position: google.maps.ControlPosition.TOP_RIGHT
},
streetViewControl: false,

  panControl:false,

};

$map = new google.maps.Map(document.getElementById("map_canvas"),
    myOptions);

overlay = new google.maps.OverlayView();
overlay.draw = function() {};
overlay.setMap($map);
} 


function placeMarker(location,image) {
  var marker = new google.maps.Marker({
  position: location, 
  map: $map,
  draggable: true,
  icon: image
  });

}

var COLORS = [["red", "#ff0000"], ["orange", "#ff8800"], ["green","#008000"],
              ["blue", "#000080"], ["purple", "#800080"]];
var options = {};
var lineCounter_ = 0;
var shapeCounter_ = 0;
var markerCounter_ = 0;
var colorIndex_ = 0;
var featureTable_;
var map;

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
  var icon = new google.maps.Icon();
  icon.image = "http://google.com/mapfiles/ms/micons/" + color + ".png";
  icon.iconSize = new google.maps.Size(32, 32);
  icon.iconAnchor = new google.maps.Point(15, 32);
  return icon;
}

function startShape() {
  select("shape_b");
  var color = getColor(false);
  var polygon = new google.maps.Polygon([], color, 2, 0.7, color, 0.2);
  startDrawing(polygon, "Shape " + (++shapeCounter_), function() {
    var cell = this;
    var area = polygon.getArea();
    cell.innerHTML = (Math.round(area / 10000) / 100) + "km<sup>2</sup>";
  }, color);
}

function startLine() {
  select("line_b");
  var color = getColor(false);
  var line = new google.maps.Polyline([], color);
  startDrawing(line, "Line " + (++lineCounter_), function() {
    var cell = this;
    var len = line.getLength();
    cell.innerHTML = (Math.round(len / 10) / 100) + "km";
  }, color);
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

function startDrawing(poly, name, onUpdate, color) {
  poliy.draw($map);
  poly.enableDrawing(options);
  poly.enableEditing({onEvent: "mouseover"});
  poly.disableEditing({onEvent: "mouseout"});
  google.maps.event.addListener(poly, "endline", function() {
    select("hand_b");
    var cells = addFeatureEntry(name, color);
    google.maps.event.bind(poly, "lineupdated", cells.desc, onUpdate);
    google.maps.event.addListener(poly, "click", function($latlng, index) {
      if (typeof index == "number") {
        poly.deleteVertex(index);
      } else {
        var newColor = getColor(false);
        cells.color.style.backgroundColor = newColor
        poly.setStrokeStyle({color: newColor, weight: 4});
      }
    });
  });
}

function placeMarkerOld() {
  select("placemark_b");
  var listener = google.maps.event.addListener(map, "click", function(event) {
    if (event.latlng) {
      select("hand_b");
      google.maps.event.removeListener(listener);
      var color = getColor(true);
      var marker = new google.maps.Marker($latlng, {icon: getIcon(color), draggable: true});
      $map.addOverlay(poly);
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

function updateMarker(marker, cells, opt_changeColor) {
  if (opt_changeColor) {
    var color = getColor(true);
    marker.setImage(getIcon(color).image);
    cells.color.style.backgroundColor = color;
  }
  var latlng = marker.getPoint();
  cells.desc.innerHTML = "(" + Math.round(latlng.y * 100) / 100 + ", " +
  Math.round(latlng.x * 100) / 100 + ")";
}
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

d3.json(queryUrl).then(function(earthquakeData) {
    // console.log(earthquakeData)
   
    var features = earthquakeData.features;
    var markers = [];
    
    for (var i = 0; i < features.length; i++){
    
        var feature = features[i];
        var lon = feature.geometry.coordinates[0];
        var lat = feature.geometry.coordinates[1];
        var depth = feature.geometry.coordinates[2];
        var location = feature.properties.place;
        var time = feature.properties.time;
        var color = '';


        if (depth >= 90){
            color = "darkred"
        } else if (depth >= 70){
            color = "red"
        } else if (depth >= 50){
            color = "orange"
        } else if (depth >= 30){
            color = "yellow"
        } else if (depth >= 10){
            color = "lightgreen"
        } else {
            color = "lightblue"
        }

        var marker = L.circle([lat, lon], {
            radius: feature.properties.mag * 10000,
            fillColor: color,
            fillOpacity: 0.5,
            weight: 0.5
        }).bindPopup(`<h2> Magnitude: ${feature.properties.mag} </h2> <hr> <h4> Location: ${location} </h4> <p> Time: ${new Date(time)} </p>`)

        markers.push(marker);
    }

    var earthquakes = L.layerGroup(markers)
    createMap(earthquakes);
});

function createMap(earthquakes){
   
    var streetmap = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',{
        attribution: 'Tiles &copy; CartoDB'});

    var map = L.map("map", {
        center: [45.715736, -117.161087],
        zoom: 4,
        layers: [streetmap, earthquakes]
    });

    var baseMap = {
        "Gray map": streetmap
    };
     
    var overlayMaps = {
        "Earthquake": earthquakes
    };

    L.control.layers(baseMap, overlayMaps, {
        collapsed: false,
    }).addTo(map);

    function getColor(mags) {
        return mags > 90 ? "darkred":
        mags > 70 ? "red":
        mags > 50 ? "orange":
        mags > 30 ? "yellow":
        mags > 10 ? "lightgreen":
        "lightblue";
    }

    var legendDisplay = L.control({
        position: "bottomright"
    });

    legendDisplay.onAdd = () => {
        var div = L.DomUtil.create("div", "info legend");
        mags = [-10, 10, 30, 50, 70, 90];

        for (var i=0; i < mags.length; i++) {
            div.innerHTML += 
            	'<i style="background:'+ getColor(mags[i]+1)+'"></i>' + 
              mags[i]+(mags[i+1] ? '&ndash;' + mags[i+1] + '<br>': '+')
        }
        return div;
    };

    legendDisplay.addTo(map);
}
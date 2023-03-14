map.on('click', function(e) {
    //var clickedmap = '{ "number": "", "x": "' + e.latlng.lat + '", "y": "' + e.latlng.lng + '" },';
    //var clickedmap = 'new L.LatLng(' + e.latlng.lat + ', ' + e.latlng.lng + '),';
    //
    var theLat = Math.round(e.latlng.lat * 100) / 100;
    var theLng = Math.round(e.latlng.lng * 100) / 100;
    //var clickedmap = '{ "number": "??", "x": "' + theLat + '", "y": "' + theLng + '" },';
    var clickedmap = '[' +theLat+ ',' +theLng+ '],';
    console.log(clickedmap);
});
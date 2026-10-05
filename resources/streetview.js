// Google Street View – pick a point on the map to preview Street View there,
// or open it in Google Maps. No API key required.
(function () {
    if (typeof map === 'undefined') {
        return;
    }

    var picking = false;

    // ---------- DOM ----------
    var control = document.createElement('div');
    control.className = 'ol-unselectable ol-control streetview-control';

    var toggleButton = document.createElement('button');
    toggleButton.type = 'button';
    toggleButton.className = 'streetview-button';
    toggleButton.title = 'Google Street View';
    control.appendChild(toggleButton);

    var panel = document.createElement('div');
    panel.className = 'streetview-panel';
    panel.hidden = true;
    panel.innerHTML =
        '<div class="streetview-header">' +
            '<strong>Google Street View</strong>' +
            '<button type="button" class="streetview-close" title="Tutup">&times;</button>' +
        '</div>' +
        '<p class="streetview-hint">Klik lokasi pada peta untuk melihat Street View.</p>' +
        '<div class="streetview-result" hidden>' +
            '<div class="streetview-frame"><iframe title="Google Street View" loading="lazy" allowfullscreen referrerpolicy="no-referrer-when-downgrade"></iframe></div>' +
            '<div class="streetview-coords"></div>' +
            '<a class="streetview-open" target="_blank" rel="noopener">' +
                '<i class="fas fa-external-link-alt"></i> Buka di Google Maps' +
            '</a>' +
            '<small>Jika pratinjau kosong, Street View mungkin tidak tersedia di titik ini.</small>' +
        '</div>';
    control.appendChild(panel);

    var resultEl = panel.querySelector('.streetview-result');
    var iframe = panel.querySelector('iframe');
    var coordsEl = panel.querySelector('.streetview-coords');
    var openLink = panel.querySelector('.streetview-open');

    var container = document.getElementById('top-left-container') || map.getTargetElement();
    container.appendChild(control);

    // Marker for the picked location
    var markerFeature = new ol.Feature();
    var markerLayer = new ol.layer.Vector({
        source: new ol.source.Vector({ features: [markerFeature] }),
        style: new ol.style.Style({
            image: new ol.style.Circle({
                radius: 8,
                fill: new ol.style.Fill({ color: '#f9ab00' }),
                stroke: new ol.style.Stroke({ color: '#fff', width: 3 })
            })
        }),
        zIndex: 1000
    });

    // ---------- Events ----------
    toggleButton.addEventListener('click', function () {
        setActive(panel.hidden);
    });
    panel.querySelector('.streetview-close').addEventListener('click', function () {
        setActive(false);
    });
    // Keep map interactions (popups, drag) from firing through the panel
    ['pointerdown', 'pointermove', 'click', 'dblclick', 'wheel'].forEach(function (type) {
        panel.addEventListener(type, function (e) { e.stopPropagation(); });
    });

    map.on('singleclick', function (evt) {
        if (!picking) {
            return;
        }
        var lonLat = ol.proj.toLonLat(evt.coordinate, map.getView().getProjection());
        showStreetView(lonLat[1], lonLat[0], evt.coordinate);
        // Hide the attribute popup opened by the same click
        setTimeout(function () {
            if (typeof overlayPopup !== 'undefined') {
                overlayPopup.setPosition(undefined);
            }
            var popup = document.getElementById('popup');
            if (popup) {
                popup.style.display = 'none';
            }
        }, 0);
    });

    // ---------- Logic ----------
    function setActive(active) {
        picking = active;
        panel.hidden = !active;
        toggleButton.classList.toggle('is-active', active);
        map.getTargetElement().classList.toggle('streetview-picking', active);
        if (active) {
            if (map.getLayers().getArray().indexOf(markerLayer) === -1) {
                map.addLayer(markerLayer);
            }
        } else {
            map.removeLayer(markerLayer);
            markerFeature.setGeometry(null);
            resultEl.hidden = true;
            iframe.removeAttribute('src');
        }
    }

    function showStreetView(lat, lng, coordinate) {
        var ll = lat.toFixed(6) + ',' + lng.toFixed(6);
        markerFeature.setGeometry(new ol.geom.Point(coordinate));
        iframe.src = 'https://maps.google.com/maps?layer=c&cbll=' + ll + '&cbp=11,0,0,0,0&output=svembed';
        openLink.href = 'https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=' + ll;
        coordsEl.textContent = ll;
        resultEl.hidden = false;
    }
})();

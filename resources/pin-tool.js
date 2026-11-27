// Titik / Pin – click the map (or type coordinates) to drop labelled pins.
// Pins can be dragged, renamed, zoomed to, removed and exported (GeoJSON / KML).
// Pins are kept in this browser only (localStorage); nothing is sent to a server.
(function () {
    if (typeof map === 'undefined') {
        return;
    }

    var STORAGE_KEY = 'giskuv2.pins';
    var COLORS = ['#e11d48', '#2563eb', '#16a34a', '#f59e0b', '#7c3aed', '#0f172a'];
    var placing = false;
    var nextId = 1;
    var currentColor = COLORS[0];
    var viewProj = map.getView().getProjection();

    // ---------- DOM ----------
    var control = document.createElement('div');
    control.className = 'ol-unselectable ol-control pin-control';

    var toggleButton = document.createElement('button');
    toggleButton.type = 'button';
    toggleButton.className = 'pin-button';
    toggleButton.title = 'Titik / Pin';
    control.appendChild(toggleButton);

    var panel = document.createElement('div');
    panel.className = 'pin-panel';
    panel.hidden = true;
    panel.innerHTML =
        '<div class="pin-header">' +
            '<strong>Titik / Pin</strong>' +
            '<button type="button" class="pin-close" title="Tutup">&times;</button>' +
        '</div>' +
        '<label class="pin-mode"><input type="checkbox" class="pin-mode-toggle" checked> Klik peta untuk menambah titik</label>' +
        '<div class="pin-colors" role="radiogroup" aria-label="Warna pin"></div>' +
        '<form class="pin-coord-form">' +
            '<input type="text" class="pin-coord-input" placeholder="Lat, Lon (mis. 2.1, 99.8)" aria-label="Koordinat lat, lon">' +
            '<button type="submit" class="pin-add" title="Tambah titik dari koordinat">Tambah</button>' +
        '</form>' +
        '<div class="pin-status" role="status"></div>' +
        '<ul class="pin-list"></ul>' +
        '<div class="pin-actions">' +
            '<button type="button" class="pin-export-geojson">GeoJSON</button>' +
            '<button type="button" class="pin-export-kml">KML</button>' +
            '<button type="button" class="pin-clear">Hapus semua</button>' +
        '</div>';
    control.appendChild(panel);

    var modeToggle = panel.querySelector('.pin-mode-toggle');
    var colorsEl = panel.querySelector('.pin-colors');
    var coordForm = panel.querySelector('.pin-coord-form');
    var coordInput = panel.querySelector('.pin-coord-input');
    var statusEl = panel.querySelector('.pin-status');
    var listEl = panel.querySelector('.pin-list');
    var actionsEl = panel.querySelector('.pin-actions');

    COLORS.forEach(function (color) {
        var swatch = document.createElement('button');
        swatch.type = 'button';
        swatch.className = 'pin-color' + (color === currentColor ? ' is-active' : '');
        swatch.style.setProperty('--pin-color', color);
        swatch.title = color;
        swatch.setAttribute('role', 'radio');
        swatch.setAttribute('aria-checked', color === currentColor ? 'true' : 'false');
        swatch.addEventListener('click', function () {
            currentColor = color;
            Array.prototype.forEach.call(colorsEl.children, function (el) {
                var on = el === swatch;
                el.classList.toggle('is-active', on);
                el.setAttribute('aria-checked', on ? 'true' : 'false');
            });
        });
        colorsEl.appendChild(swatch);
    });

    var container = document.getElementById('top-left-container') || map.getTargetElement();
    container.appendChild(control);

    // ---------- Map layer ----------
    var styleCache = {};
    function pinStyle(feature) {
        var color = feature.get('color') || COLORS[0];
        var name = feature.get('name') || '';
        var key = color + '|' + name;
        if (!styleCache[key]) {
            var svg =
                '<svg xmlns="http://www.w3.org/2000/svg" width="30" height="40" viewBox="0 0 30 40">' +
                '<path d="M15 1C7.3 1 1 7.2 1 14.9 1 25.3 15 39 15 39s14-13.7 14-24.1C29 7.2 22.7 1 15 1z" fill="' + color + '" stroke="#fff" stroke-width="2"/>' +
                '<circle cx="15" cy="15" r="5" fill="#fff"/></svg>';
            styleCache[key] = new ol.style.Style({
                image: new ol.style.Icon({
                    src: 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg),
                    anchor: [0.5, 1],
                    anchorXUnits: 'fraction',
                    anchorYUnits: 'fraction'
                }),
                text: name ? new ol.style.Text({
                    text: name,
                    offsetY: 12,
                    font: '600 12px ' + getComputedStyle(document.body).fontFamily,
                    fill: new ol.style.Fill({ color: '#111827' }),
                    stroke: new ol.style.Stroke({ color: '#fff', width: 3 })
                }) : undefined
            });
        }
        return styleCache[key];
    }

    var pinSource = new ol.source.Vector();
    var pinLayer = new ol.layer.Vector({
        source: pinSource,
        style: pinStyle,
        zIndex: 1001
    });
    map.addLayer(pinLayer);

    var translate = new ol.interaction.Translate({ layers: [pinLayer] });
    translate.setActive(false);
    map.addInteraction(translate);
    translate.on('translateend', function () {
        save();
        renderList();
    });

    // ---------- Events ----------
    toggleButton.addEventListener('click', function () {
        setOpen(panel.hidden);
    });
    panel.querySelector('.pin-close').addEventListener('click', function () {
        setOpen(false);
    });
    modeToggle.addEventListener('change', function () {
        setPlacing(modeToggle.checked && !panel.hidden);
    });
    coordForm.addEventListener('submit', function (e) {
        e.preventDefault();
        var parsed = parseLatLon(coordInput.value);
        if (!parsed) {
            setStatus('Format koordinat tidak valid. Contoh: 2.1, 99.8', true);
            return;
        }
        var feature = addPin(ol.proj.fromLonLat([parsed[1], parsed[0]], viewProj));
        coordInput.value = '';
        zoomTo(feature);
    });
    panel.querySelector('.pin-export-geojson').addEventListener('click', exportGeoJSON);
    panel.querySelector('.pin-export-kml').addEventListener('click', exportKML);
    panel.querySelector('.pin-clear').addEventListener('click', function () {
        if (pinSource.getFeatures().length && window.confirm('Hapus semua titik?')) {
            pinSource.clear();
            save();
            renderList();
        }
    });
    // Keep map interactions (popups, drag) from firing through the panel
    ['pointerdown', 'pointermove', 'click', 'dblclick', 'wheel'].forEach(function (type) {
        panel.addEventListener(type, function (e) { e.stopPropagation(); });
    });

    map.on('singleclick', function (evt) {
        if (!placing || map.getTargetElement().classList.contains('streetview-picking')) {
            return;
        }
        // Clicking an existing pin should not create another one
        var hit = map.forEachFeatureAtPixel(evt.pixel, function (f) { return f; }, {
            layerFilter: function (l) { return l === pinLayer; }
        });
        if (!hit) {
            addPin(evt.coordinate);
        }
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
    function setOpen(open) {
        panel.hidden = !open;
        toggleButton.classList.toggle('is-active', open);
        translate.setActive(open);
        setPlacing(open && modeToggle.checked);
    }

    function setPlacing(on) {
        placing = on;
        map.getTargetElement().classList.toggle('pin-placing', on);
    }

    function setStatus(text, isError) {
        statusEl.textContent = text || '';
        statusEl.classList.toggle('is-error', !!isError);
    }

    function parseLatLon(text) {
        var parts = String(text).trim().split(/[\s,;]+/).filter(Boolean);
        if (parts.length !== 2) {
            return null;
        }
        var lat = parseFloat(parts[0]);
        var lon = parseFloat(parts[1]);
        if (!isFinite(lat) || !isFinite(lon) || Math.abs(lat) > 90 || Math.abs(lon) > 180) {
            return null;
        }
        return [lat, lon];
    }

    function addPin(coordinate, props) {
        props = props || {};
        var id = props.id || nextId;
        nextId = Math.max(nextId, id) + 1;
        var feature = new ol.Feature({
            geometry: new ol.geom.Point(coordinate),
            name: props.name != null ? props.name : 'Titik ' + id,
            color: props.color || currentColor,
            pinId: id
        });
        pinSource.addFeature(feature);
        if (!props.silent) {
            setStatus('');
            save();
            renderList();
        }
        return feature;
    }

    function lonLatOf(feature) {
        return ol.proj.toLonLat(feature.getGeometry().getCoordinates(), viewProj);
    }

    function formatLatLon(feature) {
        var ll = lonLatOf(feature);
        return ll[1].toFixed(6) + ', ' + ll[0].toFixed(6);
    }

    function zoomTo(feature) {
        var view = map.getView();
        view.animate({
            center: feature.getGeometry().getCoordinates(),
            zoom: Math.max(view.getZoom() || 0, 16),
            duration: 400
        });
    }

    function sortedFeatures() {
        return pinSource.getFeatures().slice().sort(function (a, b) {
            return a.get('pinId') - b.get('pinId');
        });
    }

    function renderList() {
        var features = sortedFeatures();
        listEl.innerHTML = '';
        actionsEl.hidden = features.length === 0;
        features.forEach(function (feature) {
            var li = document.createElement('li');

            var swatch = document.createElement('span');
            swatch.className = 'pin-swatch';
            swatch.style.background = feature.get('color');

            var body = document.createElement('div');
            body.className = 'pin-body';
            var nameInput = document.createElement('input');
            nameInput.type = 'text';
            nameInput.className = 'pin-name';
            nameInput.value = feature.get('name');
            nameInput.setAttribute('aria-label', 'Nama titik');
            nameInput.addEventListener('input', function () {
                feature.set('name', nameInput.value);
                save();
            });
            var coords = document.createElement('small');
            coords.className = 'pin-coords';
            coords.textContent = formatLatLon(feature);
            body.appendChild(nameInput);
            body.appendChild(coords);

            var copyBtn = iconButton('fas fa-copy', 'Salin koordinat', function () {
                copyText(formatLatLon(feature));
            });
            var zoomBtn = iconButton('fas fa-search-plus', 'Perbesar ke titik', function () {
                zoomTo(feature);
            });
            var gmapsBtn = iconButton('fas fa-external-link-alt', 'Buka di Google Maps', function () {
                var ll = lonLatOf(feature);
                window.open('https://www.google.com/maps/search/?api=1&query=' + ll[1].toFixed(6) + ',' + ll[0].toFixed(6), '_blank', 'noopener');
            });
            var delBtn = iconButton('fas fa-trash-alt', 'Hapus titik', function () {
                pinSource.removeFeature(feature);
                save();
                renderList();
            });

            li.appendChild(swatch);
            li.appendChild(body);
            li.appendChild(copyBtn);
            li.appendChild(zoomBtn);
            li.appendChild(gmapsBtn);
            li.appendChild(delBtn);
            listEl.appendChild(li);
        });
        if (!features.length) {
            setStatus('Belum ada titik.');
        } else if (!statusEl.classList.contains('is-error')) {
            setStatus(features.length + ' titik · seret pin untuk memindahkan');
        }
    }

    function iconButton(icon, title, onClick) {
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'pin-icon-btn';
        btn.title = title;
        btn.setAttribute('aria-label', title);
        btn.innerHTML = '<i class="' + icon + '"></i>';
        btn.addEventListener('click', onClick);
        return btn;
    }

    function copyText(text) {
        function done() { setStatus('Koordinat disalin: ' + text); }
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).then(done, function () { window.prompt('Salin koordinat:', text); });
        } else {
            window.prompt('Salin koordinat:', text);
        }
    }

    // ---------- Persistence ----------
    function toGeoJSON() {
        return {
            type: 'FeatureCollection',
            features: sortedFeatures().map(function (feature) {
                var ll = lonLatOf(feature);
                return {
                    type: 'Feature',
                    properties: { id: feature.get('pinId'), name: feature.get('name'), color: feature.get('color') },
                    geometry: { type: 'Point', coordinates: [+ll[0].toFixed(7), +ll[1].toFixed(7)] }
                };
            })
        };
    }

    function save() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(toGeoJSON()));
        } catch (e) { /* storage unavailable */ }
    }

    function load() {
        try {
            var data = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
            if (!data || !Array.isArray(data.features)) {
                return;
            }
            data.features.forEach(function (f) {
                if (!f || !f.geometry || !Array.isArray(f.geometry.coordinates)) {
                    return;
                }
                var p = f.properties || {};
                addPin(ol.proj.fromLonLat(f.geometry.coordinates, viewProj), {
                    id: p.id, name: p.name, color: p.color, silent: true
                });
            });
        } catch (e) { /* ignore corrupt data */ }
    }

    // ---------- Export ----------
    function download(filename, mime, content) {
        var blob = new Blob([content], { type: mime });
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
    }

    function exportGeoJSON() {
        download('titik.geojson', 'application/geo+json', JSON.stringify(toGeoJSON(), null, 2));
    }

    function escapeXml(s) {
        return String(s).replace(/[<>&'"]/g, function (c) {
            return { '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' }[c];
        });
    }

    function exportKML() {
        var placemarks = toGeoJSON().features.map(function (f) {
            var c = f.geometry.coordinates;
            // KML colours are aabbggrr
            var hex = (f.properties.color || '#e11d48').replace('#', '');
            var kmlColor = 'ff' + hex.substr(4, 2) + hex.substr(2, 2) + hex.substr(0, 2);
            return '<Placemark><name>' + escapeXml(f.properties.name) + '</name>' +
                '<Style><IconStyle><color>' + kmlColor + '</color></IconStyle></Style>' +
                '<Point><coordinates>' + c[0] + ',' + c[1] + ',0</coordinates></Point></Placemark>';
        }).join('\n');
        var kml = '<?xml version="1.0" encoding="UTF-8"?>\n' +
            '<kml xmlns="http://www.opengis.net/kml/2.2"><Document><name>Titik</name>\n' +
            placemarks + '\n</Document></kml>';
        download('titik.kml', 'application/vnd.google-earth.kml+xml', kml);
    }

    load();
    renderList();
})();

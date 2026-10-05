// Upload SHP (.zip) – adds a zipped shapefile to the map as a temporary layer.
// Parsing happens entirely in the browser (shpjs); nothing is sent to a server.
(function () {
    if (typeof map === 'undefined' || typeof shp === 'undefined') {
        return;
    }

    var MAX_SIZE = 100 * 1024 * 1024; // 100 MB
    var PALETTE = ['#e6194b', '#3cb44b', '#4363d8', '#f58231', '#911eb4', '#42d4f4', '#f032e6', '#bfef45'];
    var uploadCount = 0;
    var uploadedLayers = [];

    // ---------- DOM ----------
    var control = document.createElement('div');
    control.className = 'ol-unselectable ol-control shp-upload-control';

    var toggleButton = document.createElement('button');
    toggleButton.type = 'button';
    toggleButton.className = 'shp-upload-button fas fa-upload';
    toggleButton.title = 'Upload SHP (.zip)';
    control.appendChild(toggleButton);

    var panel = document.createElement('div');
    panel.className = 'shp-upload-panel';
    panel.hidden = true;
    panel.innerHTML =
        '<div class="shp-upload-header">' +
            '<strong>Upload SHP (.zip)</strong>' +
            '<button type="button" class="shp-upload-close" title="Tutup">&times;</button>' +
        '</div>' +
        '<label class="shp-upload-drop">' +
            '<input type="file" accept=".zip,application/zip,application/x-zip-compressed" multiple hidden>' +
            '<i class="fas fa-file-archive"></i>' +
            '<span>Klik atau seret file <b>.zip</b> ke sini</span>' +
            '<small>Berisi .shp, .shx, .dbf (dan .prj)</small>' +
        '</label>' +
        '<div class="shp-upload-status" role="status"></div>' +
        '<ul class="shp-upload-list"></ul>';
    control.appendChild(panel);

    var fileInput = panel.querySelector('input[type="file"]');
    var dropZone = panel.querySelector('.shp-upload-drop');
    var statusEl = panel.querySelector('.shp-upload-status');
    var listEl = panel.querySelector('.shp-upload-list');

    var container = document.getElementById('top-left-container') || map.getTargetElement();
    container.appendChild(control);

    // ---------- Events ----------
    toggleButton.addEventListener('click', function () {
        panel.hidden = !panel.hidden;
    });
    panel.querySelector('.shp-upload-close').addEventListener('click', function () {
        panel.hidden = true;
    });
    fileInput.addEventListener('change', function () {
        handleFiles(fileInput.files);
        fileInput.value = '';
    });
    ['dragenter', 'dragover'].forEach(function (type) {
        dropZone.addEventListener(type, function (e) {
            e.preventDefault();
            dropZone.classList.add('is-dragover');
        });
    });
    ['dragleave', 'drop'].forEach(function (type) {
        dropZone.addEventListener(type, function (e) {
            e.preventDefault();
            dropZone.classList.remove('is-dragover');
        });
    });
    dropZone.addEventListener('drop', function (e) {
        handleFiles(e.dataTransfer.files);
    });
    // Keep map interactions (popups, drag) from firing through the panel
    ['pointerdown', 'pointermove', 'click', 'dblclick', 'wheel'].forEach(function (type) {
        panel.addEventListener(type, function (e) { e.stopPropagation(); });
    });

    // ---------- Logic ----------
    function setStatus(message, type) {
        statusEl.textContent = message || '';
        statusEl.className = 'shp-upload-status' + (type ? ' is-' + type : '');
    }

    function handleFiles(files) {
        Array.prototype.forEach.call(files || [], function (file) {
            if (!/\.zip$/i.test(file.name)) {
                setStatus('"' + file.name + '" bukan file .zip.', 'error');
                return;
            }
            if (file.size > MAX_SIZE) {
                setStatus('"' + file.name + '" terlalu besar (maks. 100 MB).', 'error');
                return;
            }
            setStatus('Memproses "' + file.name + '"…', 'loading');
            file.arrayBuffer()
                .then(function (buffer) { return shp(buffer); })
                .then(function (result) {
                    // A zip may contain several shapefiles -> array of FeatureCollections
                    var collections = Array.isArray(result) ? result : [result];
                    var added = 0;
                    collections.forEach(function (geojson) {
                        if (addLayer(geojson, file.name, collections.length > 1)) {
                            added++;
                        }
                    });
                    if (!added) {
                        throw new Error('Tidak ada fitur yang ditemukan.');
                    }
                    setStatus('"' + file.name + '" berhasil ditambahkan.', 'success');
                })
                .catch(function (err) {
                    console.error(err);
                    setStatus('Gagal membaca "' + file.name + '": ' + (err && err.message ? err.message : err), 'error');
                });
        });
    }

    function buildStyle(color) {
        var fill = new ol.style.Fill({ color: hexToRgba(color, 0.25) });
        var stroke = new ol.style.Stroke({ color: color, width: 2 });
        return new ol.style.Style({
            fill: fill,
            stroke: stroke,
            image: new ol.style.Circle({ radius: 6, fill: new ol.style.Fill({ color: color }), stroke: new ol.style.Stroke({ color: '#fff', width: 1.5 }) })
        });
    }

    function hexToRgba(hex, alpha) {
        var n = parseInt(hex.slice(1), 16);
        return 'rgba(' + (n >> 16 & 255) + ',' + (n >> 8 & 255) + ',' + (n & 255) + ',' + alpha + ')';
    }

    function addLayer(geojson, fileName, useInnerName) {
        if (!geojson || !geojson.features || !geojson.features.length) {
            return false;
        }
        var features = new ol.format.GeoJSON().readFeatures(geojson, {
            dataProjection: 'EPSG:4326',
            featureProjection: map.getView().getProjection()
        });
        if (!features.length) {
            return false;
        }

        var title = (useInnerName && geojson.fileName ? geojson.fileName : fileName.replace(/\.zip$/i, '')).split('/').pop();
        var color = PALETTE[uploadCount++ % PALETTE.length];
        var source = new ol.source.Vector({ features: features });
        var layer = new ol.layer.Vector({
            source: source,
            style: buildStyle(color),
            title: '<i class="fas fa-upload" style="color:' + color + '"></i> ' + escapeHtml(title),
            interactive: true,
            popuplayertitle: escapeHtml(title)
        });

        // Popup configuration expected by qgis2web.js
        var aliases = {}, labels = {};
        Object.keys(features[0].getProperties()).forEach(function (key) {
            if (key === 'geometry') { return; }
            aliases[key] = escapeHtml(key);
            labels[key] = 'inline label - visible with data';
        });
        features.forEach(function (f) {
            Object.keys(f.getProperties()).forEach(function (key) {
                if (key !== 'geometry' && !(key in labels)) {
                    aliases[key] = escapeHtml(key);
                    labels[key] = 'inline label - visible with data';
                }
            });
        });
        layer.set('fieldAliases', aliases);
        layer.set('fieldLabels', labels);
        layer.set('fieldImages', {});

        map.addLayer(layer);
        uploadedLayers.push(layer);
        refreshLayerSwitcher();
        zoomTo(layer);
        addListItem(layer, title, color, features.length);
        return true;
    }

    function zoomTo(layer) {
        var extent = layer.getSource().getExtent();
        if (extent && isFinite(extent[0])) {
            map.getView().fit(extent, { padding: [60, 60, 60, 60], maxZoom: 18, duration: 400 });
        }
    }

    function addListItem(layer, title, color, count) {
        var li = document.createElement('li');
        li.innerHTML =
            '<span class="shp-upload-swatch" style="background:' + color + '"></span>' +
            '<span class="shp-upload-name" title="' + escapeHtml(title) + '">' + escapeHtml(title) +
                ' <small>(' + count + ')</small></span>' +
            '<button type="button" class="shp-upload-zoom fas fa-search-plus" title="Zoom ke layer"></button>' +
            '<button type="button" class="shp-upload-remove fas fa-trash-alt" title="Hapus layer"></button>';
        li.querySelector('.shp-upload-zoom').addEventListener('click', function () { zoomTo(layer); });
        li.querySelector('.shp-upload-remove').addEventListener('click', function () {
            map.removeLayer(layer);
            uploadedLayers.splice(uploadedLayers.indexOf(layer), 1);
            li.remove();
            refreshLayerSwitcher();
            var popup = map.getOverlays().item(0);
            if (popup) { popup.setPosition(undefined); }
        });
        listEl.appendChild(li);
    }

    function refreshLayerSwitcher() {
        if (typeof layerSwitcher !== 'undefined' && layerSwitcher.renderPanel) {
            layerSwitcher.renderPanel();
        }
    }

    function escapeHtml(str) {
        return String(str).replace(/[&<>"']/g, function (c) {
            return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
        });
    }
})();

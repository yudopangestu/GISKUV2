// Upload menu for on-screen overlays.
// Accepts zipped ESRI Shapefiles (.zip containing .shp/.dbf and, ideally, .prj),
// parses them in the browser with shpjs and adds them to the map as vector layers.
// Nothing is sent to a server: overlays live only in the current browser tab.

(function () {
    if (typeof shp === 'undefined' || typeof map === 'undefined') {
        return;
    }

    var MAX_FILE_SIZE = 100 * 1024 * 1024;
    var PALETTE = ['#e11d48', '#2563eb', '#f59e0b', '#7c3aed', '#059669', '#db2777', '#0891b2', '#ea580c'];
    var overlayCount = 0;
    var overlays = [];

    // Uploaded layers sit in their own group so they show up in the layer switcher too.
    var group_UploadedOverlays = new ol.layer.Group({
        layers: [],
        fold: 'open',
        title: 'Uploaded Overlays'
    });
    map.addLayer(group_UploadedOverlays);

    function escapeHtml(value) {
        return String(value).replace(/[&<>"']/g, function (c) {
            return {'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[c];
        });
    }

    function hexToRgba(hex, alpha) {
        var n = parseInt(hex.slice(1), 16);
        return 'rgba(' + (n >> 16 & 255) + ',' + (n >> 8 & 255) + ',' + (n & 255) + ',' + alpha + ')';
    }

    function buildStyle(color, opacity) {
        // Always return an array: qgis2web.js highlight code reads styleFunction(feature)[0].
        var style = [new ol.style.Style({
            stroke: new ol.style.Stroke({color: color, width: 2}),
            fill: new ol.style.Fill({color: hexToRgba(color, opacity)}),
            image: new ol.style.Circle({
                radius: 5,
                fill: new ol.style.Fill({color: color}),
                stroke: new ol.style.Stroke({color: '#ffffff', width: 1.5})
            })
        })];
        return function () { return style; };
    }

    function refreshLayerSwitcher() {
        if (typeof layerSwitcher !== 'undefined' && layerSwitcher.renderPanel) {
            layerSwitcher.renderPanel();
        }
    }

    function addOverlay(name, geojson) {
        var features = new ol.format.GeoJSON().readFeatures(geojson, {
            dataProjection: 'EPSG:4326',
            featureProjection: 'EPSG:3857'
        });
        if (!features.length) {
            throw new Error('"' + name + '" contains no features.');
        }

        var color = PALETTE[overlayCount % PALETTE.length];
        overlayCount++;

        // Field metadata so the existing click popup lists the attributes.
        var fieldAliases = {}, fieldImages = {}, fieldLabels = {};
        features.forEach(function (f) {
            f.getKeys().forEach(function (k) {
                if (k === 'geometry' || k in fieldAliases) { return; }
                fieldAliases[k] = k;
                fieldImages[k] = 'TextEdit';
                fieldLabels[k] = 'inline label - visible with data';
            });
        });

        var layer = new ol.layer.Vector({
            declutter: false,
            source: new ol.source.Vector({features: features}),
            style: buildStyle(color, 0.25),
            popuplayertitle: escapeHtml(name),
            interactive: true,
            title: '<span class="upload-swatch" style="background:' + color + '"></span> ' + escapeHtml(name)
        });
        layer.set('fieldAliases', fieldAliases);
        layer.set('fieldImages', fieldImages);
        layer.set('fieldLabels', fieldLabels);

        group_UploadedOverlays.getLayers().push(layer);
        var overlay = {name: name, layer: layer, color: color, opacity: 0.25, count: features.length};
        overlays.push(overlay);
        refreshLayerSwitcher();
        renderList();
        zoomTo(layer);
        return overlay;
    }

    function removeOverlay(overlay) {
        group_UploadedOverlays.getLayers().remove(overlay.layer);
        overlays.splice(overlays.indexOf(overlay), 1);
        refreshLayerSwitcher();
        renderList();
    }

    function zoomTo(layer) {
        var extent = layer.getSource().getExtent();
        if (extent && isFinite(extent[0])) {
            map.getView().fit(extent, {padding: [60, 60, 60, 60], maxZoom: 18, duration: 400});
        }
    }

    function baseName(fileName) {
        return fileName.replace(/^.*[\\\/]/, '').replace(/\.(zip|shp)$/i, '');
    }

    function handleFiles(fileList) {
        var files = Array.prototype.slice.call(fileList);
        if (!files.length) { return; }
        setStatus('', '');
        files.reduce(function (chain, file) {
            return chain.then(function () { return handleFile(file); });
        }, Promise.resolve());
    }

    function handleFile(file) {
        if (!/\.zip$/i.test(file.name)) {
            setStatus('error', '"' + file.name + '" is not a .zip file. Compress the .shp, .shx, .dbf and .prj files into a single .zip.');
            return Promise.resolve();
        }
        if (file.size > MAX_FILE_SIZE) {
            setStatus('error', '"' + file.name + '" is larger than 100 MB.');
            return Promise.resolve();
        }
        setStatus('loading', 'Reading ' + file.name + '…');
        return file.arrayBuffer()
            .then(function (buffer) { return shp(buffer); })
            .then(function (result) {
                // shpjs returns an array when the zip holds more than one shapefile.
                var collections = Array.isArray(result) ? result : [result];
                var added = 0;
                collections.forEach(function (fc) {
                    var name = fc.fileName ? baseName(fc.fileName) : baseName(file.name);
                    addOverlay(name, fc);
                    added++;
                });
                setStatus('success', 'Added ' + added + ' layer' + (added === 1 ? '' : 's') + ' from ' + file.name + '.');
            })
            .catch(function (err) {
                console.error(err);
                var msg = err && err.message ? err.message : String(err);
                if (/no layers|shp/i.test(msg) && !/contains no features/.test(msg)) {
                    msg = 'No valid shapefile (.shp + .dbf) was found inside the zip.';
                }
                setStatus('error', 'Could not load "' + file.name + '": ' + msg);
            });
    }

    // ---------- UI ----------

    var control = document.createElement('div');
    control.className = 'upload-overlay-control ol-unselectable ol-control';

    var toggleButton = document.createElement('button');
    toggleButton.type = 'button';
    toggleButton.className = 'upload-overlay-button';
    toggleButton.title = 'Upload overlay (.zip shapefile)';
    toggleButton.setAttribute('aria-label', 'Upload overlay');
    toggleButton.setAttribute('aria-expanded', 'false');
    control.appendChild(toggleButton);

    var panel = document.createElement('div');
    panel.className = 'upload-overlay-panel';
    panel.hidden = true;
    panel.innerHTML =
        '<div class="upload-overlay-header">' +
            '<span>Upload overlay</span>' +
        '</div>' +
        '<label class="upload-dropzone" tabindex="0">' +
            '<input type="file" accept=".zip,application/zip,application/x-zip-compressed" multiple hidden>' +
            '<span class="upload-dropzone-icon" aria-hidden="true"></span>' +
            '<strong>Drop a .zip here or click to browse</strong>' +
            '<small>Zipped shapefile: .shp, .shx, .dbf and .prj</small>' +
        '</label>' +
        '<div class="upload-status" role="status" aria-live="polite"></div>' +
        '<ul class="upload-list"></ul>';
    control.appendChild(panel);

    var fileInput = panel.querySelector('input[type=file]');
    var dropzone = panel.querySelector('.upload-dropzone');
    var statusEl = panel.querySelector('.upload-status');
    var listEl = panel.querySelector('.upload-list');

    function setStatus(type, message) {
        statusEl.className = 'upload-status' + (type ? ' is-' + type : '');
        statusEl.textContent = message;
    }

    function setOpen(open) {
        panel.hidden = !open;
        toggleButton.classList.toggle('active', open);
        toggleButton.setAttribute('aria-expanded', String(open));
    }

    toggleButton.addEventListener('click', function () { setOpen(panel.hidden); });

    fileInput.addEventListener('change', function () {
        handleFiles(fileInput.files);
        fileInput.value = '';
    });

    dropzone.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            fileInput.click();
        }
    });

    ['dragenter', 'dragover'].forEach(function (type) {
        dropzone.addEventListener(type, function (e) {
            e.preventDefault();
            dropzone.classList.add('is-dragging');
        });
    });
    ['dragleave', 'drop'].forEach(function (type) {
        dropzone.addEventListener(type, function (e) {
            e.preventDefault();
            dropzone.classList.remove('is-dragging');
        });
    });
    dropzone.addEventListener('drop', function (e) {
        handleFiles(e.dataTransfer.files);
    });

    // Dropping a zip anywhere on the map opens the panel and loads it.
    var mapEl = map.getTargetElement();
    mapEl.addEventListener('dragover', function (e) {
        if (e.dataTransfer && Array.prototype.indexOf.call(e.dataTransfer.types, 'Files') !== -1) {
            e.preventDefault();
        }
    });
    mapEl.addEventListener('drop', function (e) {
        if (!e.dataTransfer || !e.dataTransfer.files.length || dropzone.contains(e.target)) { return; }
        e.preventDefault();
        setOpen(true);
        handleFiles(e.dataTransfer.files);
    });

    function renderList() {
        listEl.innerHTML = '';
        overlays.forEach(function (overlay) {
            var li = document.createElement('li');
            li.className = 'upload-item';
            li.innerHTML =
                '<div class="upload-item-row">' +
                    '<label class="upload-item-visible" title="Show / hide">' +
                        '<input type="checkbox"' + (overlay.layer.getVisible() ? ' checked' : '') + '>' +
                    '</label>' +
                    '<input type="color" class="upload-item-color" value="' + overlay.color + '" title="Colour">' +
                    '<span class="upload-item-name" title="' + escapeHtml(overlay.name) + '">' + escapeHtml(overlay.name) + '</span>' +
                    '<span class="upload-item-count">' + overlay.count + '</span>' +
                    '<button type="button" class="upload-item-zoom" title="Zoom to layer" aria-label="Zoom to layer"></button>' +
                    '<button type="button" class="upload-item-remove" title="Remove" aria-label="Remove"></button>' +
                '</div>' +
                '<label class="upload-item-opacity">' +
                    '<span>Fill</span>' +
                    '<input type="range" min="0" max="1" step="0.05" value="' + overlay.opacity + '">' +
                '</label>';

            li.querySelector('.upload-item-visible input').addEventListener('change', function (e) {
                overlay.layer.setVisible(e.target.checked);
                refreshLayerSwitcher();
            });
            li.querySelector('.upload-item-color').addEventListener('input', function (e) {
                overlay.color = e.target.value;
                overlay.layer.setStyle(buildStyle(overlay.color, overlay.opacity));
                overlay.layer.set('title', '<span class="upload-swatch" style="background:' + overlay.color + '"></span> ' + escapeHtml(overlay.name));
                refreshLayerSwitcher();
            });
            li.querySelector('.upload-item-opacity input').addEventListener('input', function (e) {
                overlay.opacity = parseFloat(e.target.value);
                overlay.layer.setStyle(buildStyle(overlay.color, overlay.opacity));
            });
            li.querySelector('.upload-item-zoom').addEventListener('click', function () { zoomTo(overlay.layer); });
            li.querySelector('.upload-item-remove').addEventListener('click', function () { removeOverlay(overlay); });
            listEl.appendChild(li);
        });
    }

    // Keep the panel checkbox in sync when visibility is toggled from the layer switcher.
    group_UploadedOverlays.getLayers().on('add', function (e) {
        e.element.on('change:visible', renderList);
    });

    // Mirror qgis2web behaviour: no hover highlight while the pointer is over a control.
    control.addEventListener('mouseover', function () { doHover = false; doHighlight = false; });
    control.addEventListener('mouseout', function () {
        doHover = preDoHover;
        if (!isPopupAllActive) { doHighlight = preDoHighlight; }
    });
    // Keep map gestures from firing while using the panel.
    ['pointerdown', 'wheel', 'dblclick'].forEach(function (type) {
        control.addEventListener(type, function (e) { e.stopPropagation(); });
    });

    map.addControl(new ol.control.Control({element: control}));
    topLeftContainerDiv.appendChild(control);
})();

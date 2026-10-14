// Citra Satelit Histori – Google Earth Pro style "Historical Imagery" time
// slider. Toggling the clock button shows a dark timeline with one tick per
// imagery date available at the current view, step / play controls and an
// "Tanggal citra" status bar, just like Google Earth Pro.
// Google does not publish its historical imagery as web map tiles, so the
// imagery comes from Esri World Imagery Wayback; the globe button opens the
// same view in Google Earth. No API key required.
(function () {
    if (typeof map === 'undefined') {
        return;
    }

    var CONFIG_URL = 'https://s3-us-west-2.amazonaws.com/config.maptiles.arcgis.com/waybackconfig.json';
    var TILEMAP_URL = 'https://wayback.maptiles.arcgis.com/arcgis/rest/services/World_Imagery/MapServer/tilemap/';
    var PLAY_INTERVAL = 1500;

    var releases = null;      // all Wayback releases, newest → oldest
    var releaseIndex = {};    // releaseNum → index in releases
    var versions = [];        // imagery available at the view, oldest → newest
    var currentVersion = -1;
    var active = false;
    var scanId = 0;
    var playTimer = null;
    var moveTimer = null;

    // ---------- DOM ----------
    var control = document.createElement('div');
    control.className = 'ol-unselectable ol-control sathistory-control';

    var toggleButton = document.createElement('button');
    toggleButton.type = 'button';
    toggleButton.className = 'sathistory-button';
    toggleButton.title = 'Tampilkan citra historis';
    control.appendChild(toggleButton);

    var container = document.getElementById('top-left-container') || map.getTargetElement();
    container.appendChild(control);

    var bar = document.createElement('div');
    bar.className = 'ol-unselectable gep-timeslider';
    bar.hidden = true;
    bar.innerHTML =
        '<div class="gep-row">' +
            '<span class="gep-clock" title="Citra historis"></span>' +
            '<button type="button" class="gep-btn gep-prev" title="Citra sebelumnya"><i class="fas fa-step-backward"></i></button>' +
            '<div class="gep-track-wrap">' +
                '<div class="gep-label"></div>' +
                '<div class="gep-track">' +
                    '<div class="gep-ticks"></div>' +
                    '<div class="gep-thumb" tabindex="0" role="slider" aria-label="Tanggal citra"></div>' +
                '</div>' +
                '<div class="gep-years"><span class="gep-oldest"></span><span class="gep-newest"></span></div>' +
            '</div>' +
            '<button type="button" class="gep-btn gep-next" title="Citra berikutnya"><i class="fas fa-step-forward"></i></button>' +
            '<button type="button" class="gep-btn gep-play" title="Putar animasi"><i class="fas fa-play"></i></button>' +
            '<a class="gep-btn gep-earth" target="_blank" rel="noopener" title="Buka lokasi ini di Google Earth"><i class="fas fa-globe"></i></a>' +
            '<button type="button" class="gep-btn gep-close" title="Tutup">&times;</button>' +
        '</div>' +
        '<div class="gep-message"></div>';

    var statusBar = document.createElement('div');
    statusBar.className = 'ol-unselectable gep-statusbar';
    statusBar.hidden = true;

    var mapEl = map.getTargetElement();
    mapEl.appendChild(bar);
    mapEl.appendChild(statusBar);

    var labelEl = bar.querySelector('.gep-label');
    var trackEl = bar.querySelector('.gep-track');
    var ticksEl = bar.querySelector('.gep-ticks');
    var thumbEl = bar.querySelector('.gep-thumb');
    var oldestEl = bar.querySelector('.gep-oldest');
    var newestEl = bar.querySelector('.gep-newest');
    var playButton = bar.querySelector('.gep-play');
    var earthLink = bar.querySelector('.gep-earth');
    var messageEl = bar.querySelector('.gep-message');

    // Historical imagery layer, placed just above the base maps
    var historySource = new ol.source.XYZ({
        attributions: 'Citra historis: Esri World Imagery Wayback',
        maxZoom: 23
    });
    var historyLayer = new ol.layer.Tile({ source: historySource });

    // ---------- Events ----------
    toggleButton.addEventListener('click', function () {
        setActive(!active);
    });
    bar.querySelector('.gep-close').addEventListener('click', function () {
        setActive(false);
    });
    bar.querySelector('.gep-prev').addEventListener('click', function () {
        stopPlay();
        selectVersion(currentVersion - 1);
    });
    bar.querySelector('.gep-next').addEventListener('click', function () {
        stopPlay();
        selectVersion(currentVersion + 1);
    });
    playButton.addEventListener('click', function () {
        if (playTimer) {
            stopPlay();
        } else {
            startPlay();
        }
    });
    thumbEl.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
            e.preventDefault();
            stopPlay();
            selectVersion(currentVersion + (e.key === 'ArrowLeft' ? -1 : 1));
        }
    });

    // Drag the thumb or click the track; snaps to the nearest imagery date
    var dragging = false;
    trackEl.addEventListener('pointerdown', function (e) {
        if (!versions.length) {
            return;
        }
        dragging = true;
        stopPlay();
        trackEl.setPointerCapture(e.pointerId);
        snapToPointer(e);
    });
    trackEl.addEventListener('pointermove', function (e) {
        if (dragging) {
            snapToPointer(e);
        }
    });
    trackEl.addEventListener('pointerup', function () {
        dragging = false;
    });

    // Keep map interactions (popups, drag) from firing through the slider
    [bar, statusBar].forEach(function (el) {
        ['pointerdown', 'pointermove', 'click', 'dblclick', 'wheel'].forEach(function (type) {
            el.addEventListener(type, function (e) { e.stopPropagation(); });
        });
    });

    map.on('moveend', function () {
        if (!active) {
            return;
        }
        updateStatusBar();
        clearTimeout(moveTimer);
        moveTimer = setTimeout(scanVersions, 400);
    });

    // ---------- Logic ----------
    function setActive(on) {
        active = on;
        bar.hidden = !on;
        statusBar.hidden = !on;
        toggleButton.classList.toggle('is-active', on);
        toggleButton.title = on ? 'Sembunyikan citra historis' : 'Tampilkan citra historis';
        if (on) {
            if (map.getLayers().getArray().indexOf(historyLayer) === -1) {
                var layers = map.getLayers();
                var baseIndex = typeof group_BaseMaps !== 'undefined' ? layers.getArray().indexOf(group_BaseMaps) : -1;
                layers.insertAt(baseIndex + 1, historyLayer);
            }
            updateStatusBar();
            if (releases) {
                scanVersions();
            } else {
                loadReleases();
            }
        } else {
            stopPlay();
            scanId++;
            map.removeLayer(historyLayer);
        }
    }

    function loadReleases() {
        showMessage('Memuat arsip citra…');
        fetch(CONFIG_URL)
            .then(function (res) {
                if (!res.ok) {
                    throw new Error(res.status);
                }
                return res.json();
            })
            .then(function (config) {
                releases = Object.keys(config).map(function (num) {
                    var item = config[num];
                    var match = /(\d{4}-\d{2}-\d{2})/.exec(item.itemTitle || '');
                    return {
                        num: Number(num),
                        date: match ? match[1] : '',
                        url: item.itemURL
                            .replace('{level}', '{z}')
                            .replace('{row}', '{y}')
                            .replace('{col}', '{x}'),
                        metadataUrl: item.metadataLayerUrl
                    };
                }).sort(function (a, b) {
                    return a.date < b.date ? 1 : -1;
                });
                releases.forEach(function (r, i) { releaseIndex[r.num] = i; });
                if (active) {
                    scanVersions();
                }
            })
            .catch(function () {
                showMessage('Gagal memuat arsip citra. Coba lagi nanti.');
            });
    }

    // Find every release in which the imagery at the view centre actually
    // changed, like the ticks on Google Earth Pro's time slider.
    function scanVersions() {
        if (!releases || !releases.length) {
            return;
        }
        var id = ++scanId;
        var view = map.getView();
        var lonLat = getCenterLonLat();
        var level = Math.max(3, Math.min(18, Math.round(view.getZoom())));
        var tile = lonLatToTile(lonLat[0], lonLat[1], level);
        var found = [];
        showMessage('Mencari tanggal citra di lokasi ini…');

        function step(i) {
            if (id !== scanId) {
                return;
            }
            if (i >= releases.length) {
                return finish();
            }
            var release = releases[i];
            fetch(TILEMAP_URL + release.num + '/' + level + '/' + tile.y + '/' + tile.x)
                .then(function (res) { return res.json(); })
                .then(function (data) {
                    if (!data.data || data.data[0] !== 1) {
                        return finish();
                    }
                    var selected = data.select && data.select[0] !== undefined ? data.select[0] : release.num;
                    var index = releaseIndex[selected];
                    if (index === undefined) {
                        index = i;
                    }
                    found.push(releases[index]);
                    step(index + 1);
                })
                .catch(function () {
                    finish();
                });
        }

        function finish() {
            if (id !== scanId) {
                return;
            }
            if (!found.length) {
                found = [releases[0]];
            }
            Promise.all(found.map(function (r) {
                return fetchCaptureInfo(r, lonLat, view.getZoom());
            })).then(function (infos) {
                if (id !== scanId) {
                    return;
                }
                var previous = versions[currentVersion];
                var seen = {};
                versions = found.map(function (r, i) {
                    var info = infos[i] || {};
                    return {
                        release: r,
                        date: info.date || r.date,
                        resolution: info.resolution,
                        source: info.source
                    };
                }).filter(function (v) {
                    // Releases that republish the same capture show as one tick
                    if (seen[v.date]) {
                        return false;
                    }
                    seen[v.date] = true;
                    return true;
                }).sort(function (a, b) {
                    return a.date < b.date ? -1 : 1;
                });
                hideMessage();
                renderTicks();
                selectVersion(previous ? nearestVersion(previous.date) : versions.length - 1);
            });
        }

        step(0);
    }

    function fetchCaptureInfo(release, lonLat, zoom) {
        if (!release.metadataUrl) {
            return Promise.resolve(null);
        }
        var layerId = Math.max(0, Math.min(13, 23 - Math.round(zoom)));
        var url = release.metadataUrl + '/' + layerId + '/query?f=json&returnGeometry=false' +
            '&geometryType=esriGeometryPoint&inSR=4326&spatialRel=esriSpatialRelIntersects' +
            '&outFields=SRC_DATE2,SRC_RES,NICE_DESC' +
            '&geometry=' + lonLat[0].toFixed(6) + ',' + lonLat[1].toFixed(6);
        return fetch(url)
            .then(function (res) { return res.json(); })
            .then(function (data) {
                var feature = data.features && data.features[0];
                if (!feature) {
                    return null;
                }
                var a = feature.attributes;
                return {
                    date: a.SRC_DATE2 ? new Date(a.SRC_DATE2).toISOString().slice(0, 10) : null,
                    resolution: a.SRC_RES,
                    source: a.NICE_DESC
                };
            })
            .catch(function () { return null; });
    }

    function renderTicks() {
        ticksEl.innerHTML = '';
        if (!versions.length) {
            return;
        }
        var first = versions[0].date;
        var last = versions[versions.length - 1].date;
        oldestEl.textContent = first.slice(0, 4);
        newestEl.textContent = last.slice(0, 4);
        versions.forEach(function (v, i) {
            var tick = document.createElement('span');
            tick.className = 'gep-tick';
            tick.style.left = positionOf(i) + '%';
            tick.title = formatDate(v.date);
            ticksEl.appendChild(tick);
        });
    }

    // Ticks are spaced by time, so gaps between captures are visible
    function positionOf(i) {
        if (versions.length < 2) {
            return 100;
        }
        var t0 = Date.parse(versions[0].date);
        var t1 = Date.parse(versions[versions.length - 1].date);
        return (Date.parse(versions[i].date) - t0) / (t1 - t0) * 100;
    }

    function snapToPointer(e) {
        var rect = trackEl.getBoundingClientRect();
        var pct = Math.max(0, Math.min(100, (e.clientX - rect.left) / rect.width * 100));
        var best = 0;
        versions.forEach(function (v, i) {
            if (Math.abs(positionOf(i) - pct) < Math.abs(positionOf(best) - pct)) {
                best = i;
            }
        });
        selectVersion(best);
    }

    function nearestVersion(date) {
        var target = Date.parse(date);
        var best = versions.length - 1;
        versions.forEach(function (v, i) {
            if (Math.abs(Date.parse(v.date) - target) < Math.abs(Date.parse(versions[best].date) - target)) {
                best = i;
            }
        });
        return best;
    }

    function selectVersion(i) {
        if (i < 0 || i >= versions.length) {
            return;
        }
        currentVersion = i;
        var v = versions[i];
        var pos = positionOf(i);
        thumbEl.style.left = pos + '%';
        labelEl.style.left = pos + '%';
        labelEl.textContent = formatShortDate(v.date);
        thumbEl.setAttribute('aria-valuetext', formatDate(v.date));
        Array.prototype.forEach.call(ticksEl.children, function (tick, n) {
            tick.classList.toggle('is-current', n === i);
        });
        historySource.setUrl(v.release.url);
        updateStatusBar();
    }

    function startPlay() {
        if (versions.length < 2) {
            return;
        }
        playButton.innerHTML = '<i class="fas fa-pause"></i>';
        playButton.title = 'Jeda animasi';
        if (currentVersion >= versions.length - 1) {
            selectVersion(0);
        }
        playTimer = setInterval(function () {
            if (currentVersion >= versions.length - 1) {
                stopPlay();
            } else {
                selectVersion(currentVersion + 1);
            }
        }, PLAY_INTERVAL);
    }

    function stopPlay() {
        clearInterval(playTimer);
        playTimer = null;
        playButton.innerHTML = '<i class="fas fa-play"></i>';
        playButton.title = 'Putar animasi';
    }

    function updateStatusBar() {
        var lonLat = getCenterLonLat();
        var lat = lonLat[1];
        var lng = lonLat[0];
        var zoom = map.getView().getZoom() || 12;
        // Approximate eye altitude (m) for the current map scale
        var distance = Math.round(156543 * Math.cos(lat * Math.PI / 180) / Math.pow(2, zoom) * 1000);
        distance = Math.max(300, Math.min(distance, 20000000));
        earthLink.href = 'https://earth.google.com/web/@' + lat.toFixed(6) + ',' + lng.toFixed(6) +
            ',0a,' + distance + 'd,35y,0h,0t,0r';

        var v = versions[currentVersion];
        var parts = [];
        if (v) {
            parts.push('Tanggal citra: <strong>' + formatDate(v.date) + '</strong>');
            if (v.resolution) {
                parts.push(v.resolution + ' m');
            }
            if (v.source) {
                parts.push(escapeHtml(v.source));
            }
        }
        parts.push(formatDms(lat, 'U', 'S') + ' ' + formatDms(lng, 'T', 'B'));
        parts.push('ketinggian mata ' + formatAltitude(distance));
        statusBar.innerHTML = parts.join('<span class="gep-sep"></span>');
    }

    function showMessage(text) {
        messageEl.textContent = text;
        messageEl.hidden = false;
    }

    function hideMessage() {
        messageEl.hidden = true;
    }

    // ---------- Helpers ----------
    function getCenterLonLat() {
        var view = map.getView();
        return ol.proj.toLonLat(view.getCenter(), view.getProjection());
    }

    function lonLatToTile(lon, lat, z) {
        var n = Math.pow(2, z);
        var rad = lat * Math.PI / 180;
        return {
            x: Math.floor((lon + 180) / 360 * n),
            y: Math.floor((1 - Math.log(Math.tan(rad) + 1 / Math.cos(rad)) / Math.PI) / 2 * n)
        };
    }

    var MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    function formatDate(iso) {
        var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
        return m ? Number(m[3]) + ' ' + MONTHS[Number(m[2]) - 1] + ' ' + m[1] : iso;
    }

    // Google Earth Pro labels the slider thumb as month/year
    function formatShortDate(iso) {
        var m = /^(\d{4})-(\d{2})/.exec(iso);
        return m ? Number(m[2]) + '/' + m[1] : iso;
    }

    function formatDms(value, pos, neg) {
        var abs = Math.abs(value);
        var d = Math.floor(abs);
        var minFloat = (abs - d) * 60;
        var mnt = Math.floor(minFloat);
        var sec = ((minFloat - mnt) * 60).toFixed(2);
        return d + '°' + (mnt < 10 ? '0' : '') + mnt + '\'' + (sec < 10 ? '0' : '') + sec + '"' + (value >= 0 ? pos : neg);
    }

    function formatAltitude(m) {
        return m >= 1000 ? (m / 1000).toFixed(2).replace('.', ',') + ' km' : m + ' m';
    }

    function escapeHtml(s) {
        return String(s).replace(/[&<>"']/g, function (c) {
            return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
        });
    }
})();

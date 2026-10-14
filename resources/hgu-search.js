// Cari HGU – search HGU parcels by PEMILIK, TIPEHAK, NIB or NO_HAK, then zoom to and
// highlight the selected parcel(s). Runs entirely in the browser on the HGU layer.
(function () {
    if (typeof map === 'undefined' || typeof lyr_HGU_13 === 'undefined') {
        return;
    }

    var MAX_RESULTS = 100;
    var FIELDS = {
        ALL: { label: 'Semua (Pemilik / Tipe Hak / NIB / No. Hak)', keys: ['PEMILIK', 'TIPEHAK', 'NIB', 'NIBEL_NIB', 'NO_HAK'] },
        PEMILIK: { label: 'Pemilik', keys: ['PEMILIK'] },
        TIPEHAK: { label: 'Tipe Hak', keys: ['TIPEHAK'] },
        NIB: { label: 'NIB', keys: ['NIB', 'NIBEL_NIB'] },
        NO_HAK: { label: 'No. Hak', keys: ['NO_HAK'] }
    };

    var source = lyr_HGU_13.getSource();

    // ---------- Highlight layer ----------
    var highlightLayer = new ol.layer.Vector({
        source: new ol.source.Vector(),
        style: new ol.style.Style({
            fill: new ol.style.Fill({ color: 'rgba(255, 214, 0, 0.35)' }),
            stroke: new ol.style.Stroke({ color: '#ffd600', width: 3 })
        }),
        zIndex: 1000
    });
    highlightLayer.setMap(map);

    // ---------- DOM ----------
    var control = document.createElement('div');
    control.className = 'ol-unselectable ol-control hgu-search-control';

    var toggleButton = document.createElement('button');
    toggleButton.type = 'button';
    toggleButton.className = 'hgu-search-button';
    toggleButton.title = 'Cari HGU';
    control.appendChild(toggleButton);

    var fieldOptions = Object.keys(FIELDS).map(function (key) {
        return '<option value="' + key + '">' + FIELDS[key].label + '</option>';
    }).join('');

    var panel = document.createElement('div');
    panel.className = 'hgu-search-panel';
    panel.hidden = true;
    panel.innerHTML =
        '<div class="hgu-search-header">' +
            '<strong>Cari HGU</strong>' +
            '<button type="button" class="hgu-search-close" title="Tutup">&times;</button>' +
        '</div>' +
        '<form class="hgu-search-form" autocomplete="off">' +
            '<label class="hgu-search-label">Cari berdasarkan' +
                '<select class="hgu-search-field">' + fieldOptions + '</select>' +
            '</label>' +
            '<input type="search" class="hgu-search-input" placeholder="Ketik nama pemilik, tipe hak, NIB, atau no. hak…">' +
            '<select class="hgu-search-tipehak" hidden></select>' +
        '</form>' +
        '<div class="hgu-search-status" role="status"></div>' +
        '<ul class="hgu-search-results"></ul>' +
        '<div class="hgu-search-actions" hidden>' +
            '<button type="button" class="hgu-search-zoomall">Zoom ke semua hasil</button>' +
            '<button type="button" class="hgu-search-clear">Bersihkan</button>' +
        '</div>';
    control.appendChild(panel);

    var form = panel.querySelector('.hgu-search-form');
    var fieldSelect = panel.querySelector('.hgu-search-field');
    var input = panel.querySelector('.hgu-search-input');
    var tipeSelect = panel.querySelector('.hgu-search-tipehak');
    var statusEl = panel.querySelector('.hgu-search-status');
    var resultsEl = panel.querySelector('.hgu-search-results');
    var actionsEl = panel.querySelector('.hgu-search-actions');

    // TIPEHAK has only a handful of values, so offer them as a dropdown
    var tipeCounts = {};
    source.getFeatures().forEach(function (f) {
        var v = f.get('TIPEHAK');
        if (v) { tipeCounts[v] = (tipeCounts[v] || 0) + 1; }
    });
    tipeSelect.innerHTML = '<option value="">— Pilih tipe hak —</option>' +
        Object.keys(tipeCounts).sort().map(function (v) {
            return '<option value="' + escapeHtml(v) + '">' + escapeHtml(v) + ' (' + tipeCounts[v] + ')</option>';
        }).join('');

    var container = document.getElementById('top-left-container') || map.getTargetElement();
    container.appendChild(control);

    // ---------- Events ----------
    toggleButton.addEventListener('click', function () {
        panel.hidden = !panel.hidden;
        if (!panel.hidden && !input.hidden) {
            input.focus();
        }
    });
    panel.querySelector('.hgu-search-close').addEventListener('click', function () {
        panel.hidden = true;
    });
    form.addEventListener('submit', function (e) {
        e.preventDefault();
        runSearch();
    });
    fieldSelect.addEventListener('change', function () {
        var isTipe = fieldSelect.value === 'TIPEHAK';
        input.hidden = isTipe;
        tipeSelect.hidden = !isTipe;
        input.placeholder = {
            ALL: 'Ketik nama pemilik, tipe hak, NIB, atau no. hak…',
            PEMILIK: 'Ketik nama pemilik, mis. PTPN III…',
            NIB: 'Ketik NIB, mis. 01639…',
            NO_HAK: 'Ketik no. hak, mis. 01342…'
        }[fieldSelect.value] || '';
        runSearch();
    });
    var debounce;
    input.addEventListener('input', function () {
        clearTimeout(debounce);
        debounce = setTimeout(runSearch, 200);
    });
    tipeSelect.addEventListener('change', runSearch);
    panel.querySelector('.hgu-search-zoomall').addEventListener('click', function () {
        zoomTo(currentResults);
    });
    panel.querySelector('.hgu-search-clear').addEventListener('click', function () {
        input.value = '';
        tipeSelect.value = '';
        runSearch();
    });
    // Keep map interactions (popups, drag) from firing through the panel
    ['pointerdown', 'pointermove', 'click', 'dblclick', 'wheel'].forEach(function (type) {
        panel.addEventListener(type, function (e) { e.stopPropagation(); });
    });

    // ---------- Logic ----------
    var currentResults = [];

    function normalize(value) {
        return String(value == null ? '' : value).toLowerCase().replace(/\s+/g, ' ').trim();
    }

    function escapeHtml(value) {
        return String(value == null ? '' : value).replace(/[&<>"']/g, function (c) {
            return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
        });
    }

    function setStatus(message, type) {
        statusEl.textContent = message || '';
        statusEl.className = 'hgu-search-status' + (type ? ' is-' + type : '');
    }

    function runSearch() {
        var field = fieldSelect.value;
        var matches;
        if (field === 'TIPEHAK') {
            var tipe = tipeSelect.value;
            matches = tipe ? source.getFeatures().filter(function (f) { return f.get('TIPEHAK') === tipe; }) : [];
        } else {
            var query = normalize(input.value);
            if (!query) {
                matches = [];
            } else {
                var keys = FIELDS[field].keys;
                // Every word must appear in one of the searched fields
                var terms = query.split(' ');
                matches = source.getFeatures().filter(function (f) {
                    var haystack = keys.map(function (k) { return normalize(f.get(k)); }).join(' | ');
                    return terms.every(function (t) { return haystack.indexOf(t) !== -1; });
                });
            }
        }
        matches.sort(function (a, b) {
            return normalize(a.get('PEMILIK')).localeCompare(normalize(b.get('PEMILIK'))) ||
                String(a.get('NIB') || '').localeCompare(String(b.get('NIB') || ''));
        });
        currentResults = matches;
        renderResults(matches);
        highlight(matches);
    }

    function renderResults(matches) {
        resultsEl.innerHTML = '';
        var hasQuery = fieldSelect.value === 'TIPEHAK' ? !!tipeSelect.value : !!normalize(input.value);
        actionsEl.hidden = !hasQuery;
        if (!hasQuery) {
            setStatus('');
            return;
        }
        if (!matches.length) {
            setStatus('Tidak ada HGU yang cocok.', 'error');
            return;
        }
        setStatus(matches.length + ' HGU ditemukan' +
            (matches.length > MAX_RESULTS ? ' (menampilkan ' + MAX_RESULTS + ' pertama)' : '') + '.', 'success');

        matches.slice(0, MAX_RESULTS).forEach(function (f) {
            var li = document.createElement('li');
            var btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'hgu-search-item';
            var luas = f.get('LUASTERTUL') || f.get('LUASPETA');
            btn.innerHTML =
                '<span class="hgu-search-owner">' + escapeHtml(f.get('PEMILIK') || '(tanpa nama pemilik)') + '</span>' +
                '<span class="hgu-search-meta">' +
                    'NIB ' + escapeHtml(f.get('NIB') || '-') + ' · No. Hak ' + escapeHtml(f.get('NO_HAK') || '-') +
                    ' · ' + escapeHtml(f.get('TIPEHAK') || '-') +
                '</span>' +
                '<span class="hgu-search-meta">' +
                    escapeHtml([f.get('DESA'), f.get('KECAMATAN')].filter(Boolean).join(', ') || '-') +
                    (luas ? ' · ' + formatArea(luas) : '') +
                '</span>';
            btn.addEventListener('click', function () {
                Array.prototype.forEach.call(resultsEl.querySelectorAll('.is-active'), function (el) {
                    el.classList.remove('is-active');
                });
                btn.classList.add('is-active');
                highlight([f]);
                zoomTo([f]);
            });
            li.appendChild(btn);
            resultsEl.appendChild(li);
        });
    }

    function formatArea(m2) {
        return (Number(m2) / 10000).toLocaleString('id-ID', { maximumFractionDigits: 2 }) + ' ha';
    }

    function highlight(features) {
        var hlSource = highlightLayer.getSource();
        hlSource.clear();
        features.forEach(function (f) {
            hlSource.addFeature(new ol.Feature(f.getGeometry()));
        });
    }

    function zoomTo(features) {
        if (!features.length) {
            return;
        }
        if (!lyr_HGU_13.getVisible()) {
            lyr_HGU_13.setVisible(true);
        }
        var extent = ol.extent.createEmpty();
        features.forEach(function (f) {
            ol.extent.extend(extent, f.getGeometry().getExtent());
        });
        map.getView().fit(extent, { padding: [60, 60, 60, 60], duration: 500, maxZoom: 17 });
    }
})();

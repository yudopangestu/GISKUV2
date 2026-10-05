//north direction menu
(function() {
    var view = map.getView();
    var STEP = 15;

    function toDeg(rad) {
        var deg = Math.round(rad * 180 / Math.PI) % 360;
        return deg < 0 ? deg + 360 : deg;
    }
    function rotateTo(deg) {
        view.animate({ rotation: deg * Math.PI / 180, duration: 250 });
    }

    var element = document.createElement('div');
    element.className = 'ol-unselectable ol-control north-control';
    element.innerHTML =
        '<button type="button" class="north-button" title="North direction" aria-haspopup="true" aria-expanded="false">' +
            '<svg class="north-arrow" viewBox="0 0 40 40" width="34" height="34" aria-hidden="true">' +
                '<text x="20" y="9" text-anchor="middle" font-size="8" font-weight="700" fill="#c0392b">N</text>' +
                '<polygon points="20,11 25,21 20,19 15,21" fill="#c0392b"/>' +
                '<polygon points="20,31 25,21 20,23 15,21" fill="#9ca3af"/>' +
                '<text x="20" y="38.5" text-anchor="middle" font-size="6" fill="#6b7280">S</text>' +
            '</svg>' +
        '</button>' +
        '<div class="north-menu" role="menu" hidden>' +
            '<div class="north-menu-header">' +
                '<span>North direction</span>' +
                '<span class="north-bearing">0°</span>' +
            '</div>' +
            '<button type="button" role="menuitem" data-action="reset"><i class="fas fa-location-arrow"></i> Reset to north</button>' +
            '<div class="north-menu-row">' +
                '<button type="button" role="menuitem" data-action="left" title="Rotate left ' + STEP + '°"><i class="fas fa-undo"></i> ' + STEP + '°</button>' +
                '<button type="button" role="menuitem" data-action="right" title="Rotate right ' + STEP + '°"><i class="fas fa-redo"></i> ' + STEP + '°</button>' +
            '</div>' +
            '<label class="north-slider">Bearing' +
                '<input type="range" min="0" max="359" step="1" value="0">' +
            '</label>' +
            '<div class="north-menu-row north-presets">' +
                '<button type="button" data-deg="0">N</button>' +
                '<button type="button" data-deg="90">E</button>' +
                '<button type="button" data-deg="180">S</button>' +
                '<button type="button" data-deg="270">W</button>' +
            '</div>' +
            '<p class="north-hint">Tip: Alt + Shift + drag to rotate freely</p>' +
        '</div>';

    var button = element.querySelector('.north-button');
    var arrow = element.querySelector('.north-arrow');
    var menu = element.querySelector('.north-menu');
    var bearing = element.querySelector('.north-bearing');
    var slider = element.querySelector('input[type="range"]');

    function setOpen(open) {
        menu.hidden = !open;
        button.setAttribute('aria-expanded', String(open));
        element.classList.toggle('open', open);
    }
    button.addEventListener('click', function() {
        setOpen(menu.hidden);
    });
    document.addEventListener('click', function(evt) {
        if (!element.contains(evt.target)) {
            setOpen(false);
        }
    });
    document.addEventListener('keydown', function(evt) {
        if (evt.key === 'Escape') {
            setOpen(false);
        }
    });

    menu.addEventListener('click', function(evt) {
        var target = evt.target.closest('button');
        if (!target) {
            return;
        }
        var current = toDeg(view.getRotation());
        if (target.dataset.action === 'reset') {
            rotateTo(0);
        } else if (target.dataset.action === 'left') {
            rotateTo(current - STEP);
        } else if (target.dataset.action === 'right') {
            rotateTo(current + STEP);
        } else if (target.dataset.deg) {
            rotateTo(Number(target.dataset.deg));
        }
    });
    slider.addEventListener('input', function() {
        view.setRotation(Number(slider.value) * Math.PI / 180);
    });

    function update() {
        var rotation = view.getRotation();
        var deg = toDeg(rotation);
        arrow.style.transform = 'rotate(' + rotation + 'rad)';
        bearing.textContent = deg + '°';
        if (document.activeElement !== slider) {
            slider.value = deg;
        }
    }
    view.on('change:rotation', update);
    update();

    var northControl = new ol.control.Control({ element: element });
    map.addControl(northControl);
    var bottomRight = document.getElementById('bottom-right-container');
    if (bottomRight) {
        bottomRight.insertBefore(element, bottomRight.firstChild);
    }
})();

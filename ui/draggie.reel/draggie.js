/**
 * @module ui/draggie.reel
 */
var Component = require("montage/ui/component").Component,
    TranslateComposer = require("montage/composer/translate-composer").TranslateComposer;

/**
 * @class Draggie
 * @extends Component
 */
exports.Draggie = Component.specialize(/** @lends Draggie.prototype */ {

    constructor: {
        value: function Draggie() {
            this.super();
        }
    },

    map: {
        value: null // Set in the parent's template serialization
    },

    _image: {
        value: null // The image of Draggie.
    },

    _offsets: {
        value: {x: 0, y: 0} // Relative to the default position.
    },

    _needsResize: {
        value: true
    },

    _needsImage: {
        value: true
    },

    _needsReposition: {
        value: true
    },

    _isListening: {
        value: false
    },

    _translateComposer: {
        value: false
    },

    _isNextEventIgnored: {
        value: false
    },

    _hitTest: {
        value: function (clientX, clientY) {
            var canvas = this.element,
                bounds = canvas.getBoundingClientRect(),
                canvasX = Math.round(clientX - bounds.left),
                canvasY = Math.round(clientY - bounds.top);
            return canvas.getContext('2d').getImageData(canvasX, canvasY, 1, 1).data[3] !== 0;
        }
    },

    _cloneMouseEvent: {
        value: function (original) {
            var clone = document.createEvent("MouseEvent");
            clone.initMouseEvent(
                original.type,
                original.bubbles,
                original.cancelable,
                original.view,
                original.detail,
                original.screenX,
                original.screenY,
                original.clientX,
                original.clientY,
                original.ctrlKey,
                original.altKey,
                original.shiftKey,
                original.metaKey,
                original.button,
                original.relatedTarget);
            return clone;
        }
    },

    enterDocument: {
        value: function () {
            if (!this._isListening) {
                this._isListening = true;
                this.element.addEventListener("mousemove", this, false);
                window.addEventListener("resize", this, false);
            }
        }
    },

    prepareForActivationEvents: {
        value: function () {
            if (!this._translateComposer) {
                this._translateComposer = new TranslateComposer();
                this._translateComposer.allowsFloats = true;
                this._translateComposer.hasMomentum = false;
                this._translateComposer.enabled = false;
                this._translateComposer.addEventListener("translate", this);
                this._translateComposer.addEventListener("translateEnd", this);
                this.element.addEventListener("mousedown", this, false);
                this.element.addEventListener("dblclick", this, false);
                this.addComposerForElement(this._translateComposer, this.element);
            }
        }
    },

    handleResize: {
        value: function (event) {
            this._needsResize = true;
            this.needsDraw = true;
        }
    },

    handleMousemove: {
        value: function (event) {
            var hit = this._hitTest(event.clientX, event.clientY);
            if (hit != this.classList.has("Draggie--hit")) {
                this.classList.toggle("Draggie--hit");
            }
        }
    },

    handleMousedown: {
        value: function (event) {
            if (this._isNextEventIgnored) {
                this._isNextEventIgnored = false;
            } else if (this._hitTest(event.clientX, event.clientY)) {
                this._isNextEventIgnored = true;
                this._translateComposer.enabled = true;
                event.target.dispatchEvent(this._cloneMouseEvent(event));
            } else {
                this.map.dispatchEvent(this._cloneMouseEvent(event));
            }
        }
    },

    handleDblclick: {
        value: function (event) {
            // TO DO.
            console.log("handleDblclick():", event);
        }
    },

    handleTranslate: {
        value: function (event) {
            if (this._offsets.x !== event.translateX || this._offsets.y !== event.translateY) {
                this._offsets.x = event.translateX;
                this._offsets.y = event.translateY;
                this._needsReposition = true;
                this.needsDraw = true;
            }
        }
    },

    handleTranslateEnd: {
        value: function (event) {
            this._translateComposer.enabled = false;
        }
    },

    willDraw: {
        value: function () {
            var self = this,
                image = this._image;
            if (!image) {
                image = new Image();
                image.src = "asset/image/draggie.png";
                image.addEventListener("load", function() {
                    self._image = image;
                    self._needsImage = true;
                    self.needsDraw = true;
                }, false);
            }
        }
    },

    draw: {
        value: function () {
            var canvas = this.element,
                bounds,
                translation;
            if (this._needsReposition) {
                translation = "translate3d(" + this._offsets.x + "px, " + this._offsets.y + "px, 0)";
                canvas.style["-webkit-transform"] = translation;
                canvas.style["transform"] = translation;
                this._needsReposition = false;
            }
            if (this._needsResize) {
                bounds = canvas.getBoundingClientRect();
                canvas.width = bounds.width;
                canvas.height = bounds.height;
                this._needsImage = true;
                this._needsResize = false;
            }
            if (this._needsImage && this._image) {
                canvas.getContext('2d').drawImage(this._image, 0, 0, canvas.width, canvas.height);
                this._needsImage = false;
            }
        }
    }

});

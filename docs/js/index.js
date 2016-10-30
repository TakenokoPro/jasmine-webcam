(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Barcode = function () {
  function Barcode() {
    _classCallCheck(this, Barcode);
  }

  _createClass(Barcode, [{
    key: "add",
    value: function add(isbn) {
      console.log("ISBN GET!!");
    }
  }]);

  return Barcode;
}();

exports.default = Barcode;

},{}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// start local video

var Camera = function () {
  function Camera() {
    _classCallCheck(this, Camera);

    this.video = null;
    this.canvas = null;
    this.ctx = null;
    this.image = null;
    this.localMediaStream = null;
  }

  /**
   * カメラのセットアップ
  */


  _createClass(Camera, [{
    key: 'startVideo',
    value: function startVideo() {
      var _this = this;

      // 初期化
      this.video = document.querySelector('video');
      this.canvas = document.querySelector('canvas');
      this.ctx = this.canvas.getContext('2d');
      this.image = document.querySelector('img');
      navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
      window.URL = window.URL || window.webkitURL;

      // サポート外
      if (!navigator.getUserMedia) {
        console.error("getUserMedia() not supported.");
        return;
      }

      // カメラ映す
      navigator.getUserMedia({ video: true, audio: false }, function (stream) {
        _this.localMediaStream = stream;
        _this.video.src = window.URL.createObjectURL(stream);
      }, function (error) {
        console.error('mediaDevice.getUserMedia() error:');
        return;
      });
    }

    /**
     * スナップショット
    */

  }, {
    key: 'takeSnapshot',
    value: function takeSnapshot() {
      if (this.localMediaStream) {
        this.ctx.drawImage(this.video, 0, 0, 320, 240);
        this.image.src = this.canvas.toDataURL('image/jpeg');
        console.log("TAKE SNAP SHOT");
      }
      return this.image.src || "";
    }
  }]);

  return Camera;
}();

exports.default = Camera;

},{}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Barcode = require("./Barcode");

var _Barcode2 = _interopRequireDefault(_Barcode);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var App = function () {
  function App() {
    _classCallCheck(this, App);

    this.resultCollector = Quagga.ResultCollector.create({
      capture: true,
      capacity: 20,
      blacklist: [{ code: "2167361334", format: "i2of5" }],
      filter: function filter(codeResult) {
        return true;
      }
    });
    this.inputMapper = {
      inputStream: {
        constraints: function constraints(value) {
          var values = value.split('x');
          return { width: { min: parseInt(values[0]) }, height: { min: parseInt(values[1]) } };
        }
      },
      numOfWorkers: function numOfWorkers(value) {
        console.log("aa=" + value);return parseInt(value);
      },
      decoder: {
        readers: function readers(value) {
          console.log("ss=" + value);
          if (value === 'ean_extended') return [{ format: "ean_reader", config: { supplements: ['ean_5_reader', 'ean_2_reader'] } }];
          return [{ format: value + "_reader", config: {} }];
        }
      }
    };
    this.state = {
      inputStream: {
        type: "LiveStream",
        constraints: { width: { min: 640 }, height: { min: 480 }, facingMode: "environment", aspectRatio: { min: 1, max: 2 } }
      },
      locator: { patchSize: "medium", halfSample: true },
      numOfWorkers: 4,
      decoder: { readers: [{ format: "ean_reader", config: {} }] },
      locate: true
    };
    this.lastResult = null;
  }

  _createClass(App, [{
    key: "init",
    value: function init() {
      var _this = this;

      var self = this;
      Quagga.init(this.state, function (err) {
        if (err) return self.handleError(err);
        Quagga.registerResultCollector(_this.resultCollector);
        _this.attachListeners();
        Quagga.start();
      });
    }
  }, {
    key: "handleError",
    value: function handleError(err) {
      console.log(err);
    }
  }, {
    key: "attachListeners",
    value: function attachListeners() {
      var self = this;
      $(".controls").on("click", "button.stop", function (e) {
        e.preventDefault();
        Quagga.stop();
        self._printCollectedResults();
      });
      $(".controls .reader-config-group").on("change", "input, select", function (e) {
        e.preventDefault();
        var $target = $(e.target),
            value = $target.attr("type") === "checkbox" ? $target.prop("checked") : $target.val(),
            name = $target.attr("name"),
            state = self._convertNameToState(name);
        console.log("Value of " + state + " changed to " + value);
        self.setState(state, value);
      });
    }
  }, {
    key: "_printCollectedResults",
    value: function _printCollectedResults() {
      var results = this.resultCollector.getResults(),
          $ul = $("#result_strip ul.collector");

      results.forEach(function (result) {
        var $li = $('<li><div class="thumbnail"><div class="imgWrapper"><img /></div><div class="caption"><h4 class="code"></h4></div></div></li>');
        $li.find("img").attr("src", result.frame);
        $li.find("h4.code").html(result.codeResult.code + " (" + result.codeResult.format + ")");
        $ul.prepend($li);
      });
    }
  }, {
    key: "_accessByPath",
    value: function _accessByPath(obj, path, val) {
      var parts = path.split('.'),
          depth = parts.length,
          setter = typeof val !== "undefined" ? true : false;

      return parts.reduce(function (o, key, i) {
        if (setter && i + 1 === depth) o[key] = val;
        return key in o ? o[key] : {};
      }, obj);
    }
  }, {
    key: "_convertNameToState",
    value: function _convertNameToState(name) {
      return name.replace("_", ".").split("-").reduce(function (result, value) {
        return result + value.charAt(0).toUpperCase() + value.substring(1);
      });
    }
  }, {
    key: "detachListeners",
    value: function detachListeners() {
      $(".controls").off("click", "button.stop");
      $(".controls .reader-config-group").off("change", "input, select");
    }
  }, {
    key: "setState",
    value: function setState(path, value) {
      var self = this;
      if (typeof self._accessByPath(self.inputMapper, path) === "function") value = self._accessByPath(self.inputMapper, path)(value);
      self._accessByPath(self.state, path, value);
      console.log(JSON.stringify(self.state));
      this.detachListeners();
      Quagga.stop();
      this.init();
    }
  }]);

  return App;
}();

exports.default = App;


Quagga.onProcessed(function (result) {
  var drawingCtx = Quagga.canvas.ctx.overlay,
      drawingCanvas = Quagga.canvas.dom.overlay;

  if (result && result.boxes) {
    drawingCtx.clearRect(0, 0, parseInt(drawingCanvas.getAttribute("width")), parseInt(drawingCanvas.getAttribute("height")));
    result.boxes.filter(function (box) {
      return box !== result.box;
    }).forEach(function (box) {
      Quagga.ImageDebug.drawPath(box, { x: 0, y: 1 }, drawingCtx, { color: "green", lineWidth: 2 });
    });
  }

  if (result && result.box) {
    Quagga.ImageDebug.drawPath(result.box, { x: 0, y: 1 }, drawingCtx, { color: "#00F", lineWidth: 2 });
  }

  if (result && result.codeResult && result.codeResult.code) {
    Quagga.ImageDebug.drawPath(result.line, { x: 'x', y: 'y' }, drawingCtx, { color: 'red', lineWidth: 3 });
  }
});

Quagga.onDetected(function (result) {
  var code = result.codeResult.code;
  console.log(code, App.lastResult);
  if (App.lastResult !== code) {
    App.lastResult = code;
    var $node = null,
        canvas = Quagga.canvas.dom.image;
    $node = $('<li><div class="thumbnail"><div class="imgWrapper"><img /></div><div class="caption"><h4 class="code"></h4></div></div></li>');
    $node.find("img").attr("src", canvas.toDataURL());
    $node.find("h4.code").html(code);
    $("#result_strip ul.thumbnails").prepend($node);
  }
  new _Barcode2.default().add(code);
});

},{"./Barcode":1}],4:[function(require,module,exports){
"use strict";

var _Camera = require("./camera/Camera");

var _Camera2 = _interopRequireDefault(_Camera);

var _Quagga = require("./camera/Quagga");

var _Quagga2 = _interopRequireDefault(_Quagga);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var quaga = new _Quagga2.default();
var camera = new _Camera2.default();

// 実行したい処理
window.onload = function () {

  console.log("load");

  jQuery('#startVideo').click(function () {
    camera.startVideo();
  });

  jQuery('#takeSnapshot').click(function () {
    camera.takeSnapshot();
  });

  quaga.init();
};

},{"./camera/Camera":2,"./camera/Quagga":3}]},{},[4]);

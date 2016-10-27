(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// Barcode Class

var Barcode = function () {
  function Barcode() {
    _classCallCheck(this, Barcode);

    console.log("aaa");
    JOB.Init();
  }

  _createClass(Barcode, [{
    key: "_SetImageCallback",
    value: function _SetImageCallback(result) {
      if (result.length > 0) {
        var tempArray = [];
        for (var i = 0; i < result.length; i++) {
          tempArray.push(result[i].Format + " : " + result[i].Value);
        }Result.innerHTML = tempArray.join("<br />");
      } else {
        if (result.length === 0) Result.innerHTML = "Decoding failed.";
      }
    }
  }, {
    key: "_OrientationCallback",
    value: function _OrientationCallback(result) {
      canvas.width = result.width;
      canvas.height = result.height;
      var data = ctx.getImageData(0, 0, canvas.width, canvas.height);
      for (var i = 0; i < data.data.length; i++) {
        data.data[i] = result.data[i];
      }ctx.putImageData(data, 0, 0);
    }
  }, {
    key: "_SetLocalizationCallback",
    value: function _SetLocalizationCallback(result) {
      ctx.beginPath();
      ctx.lineWIdth = "2";
      ctx.strokeStyle = "red";
      for (var i = 0; i < result.length; i++) {
        ctx.rect(result[i].x, result[i].y, result[i].width, result[i].height);
      }ctx.stroke();
    }
  }, {
    key: "onload",
    value: function onload() {
      var _this = this;

      var takePicture = document.querySelector("#Take-Picture");
      var showPicture = document.createElement("img");
      var Result = document.querySelector("#textbit");
      var canvas = document.getElementById("picture");
      var ctx = canvas.getContext("2d");

      JOB.SetImageCallback(function (result) {
        return _this._SetImageCallback(result);
      });
      JOB.PostOrientation = true;
      JOB.OrientationCallback = function (result) {
        return _this._OrientationCallback(result);
      };
      JOB.SwitchLocalizationFeedback(true);
      JOB.SetLocalizationCallback(function (result) {
        return _this._SetLocalizationCallback(result);
      });
      if (takePicture && showPicture) {
        takePicture.onchange = function (event) {
          var files = event.target.files;
          if (files && files.length > 0) {
            file = files[0];
            try {
              var URL = window.URL || window.webkitURL;
              showPicture.onload = function (event) {
                Result.innerHTML = "";
                JOB.DecodeImage(showPicture);
                URL.revokeObjectURL(showPicture.src);
              };
              showPicture.src = URL.createObjectURL(file);
            } catch (e) {
              try {
                var fileReader = new FileReader();
                fileReader.onload = function (event) {
                  showPicture.onload = function (event) {
                    Result.innerHTML = "";
                    JOB.DecodeImage(showPicture);
                  };
                  showPicture.src = event.target.result;
                };
                fileReader.readAsDataURL(file);
              } catch (e) {
                Result.innerHTML = "Neither createObjectURL or FileReader are supported";
              }
            }
          }
        };
      }
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

// Camera Class

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

var _Camera = require("./camera/Camera");

var _Camera2 = _interopRequireDefault(_Camera);

var _Barcode = require("./camera/Barcode");

var _Barcode2 = _interopRequireDefault(_Barcode);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var camera = new _Camera2.default();
var barcode = new _Barcode2.default();

// 実行したい処理
window.onload = function () {

  console.log("load");
  barcode.onload();

  jQuery('#startVideo').click(function () {
    camera.startVideo();
  });

  jQuery('#takeSnapshot').click(function () {
    camera.takeSnapshot();
  });

  //Google Books APIs
  function handleResponse(response) {
    for (var i = 0; i < response.items.length; i++) {
      var item = response.items[i];
      document.getElementById("content").innerHTML += "<br>" + item.volumeInfo.title;
    }
  }
};

},{"./camera/Barcode":1,"./camera/Camera":2}]},{},[3]);

(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
        console.log("getUserMedia() not supported.");
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
    }
  }]);

  return Camera;
}();

exports.default = Camera;

},{}],2:[function(require,module,exports){
"use strict";

var _Camera = require("./camera/Camera");

var _Camera2 = _interopRequireDefault(_Camera);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
};

},{"./camera/Camera":1}]},{},[2]);

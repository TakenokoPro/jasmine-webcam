import Barcode from "./Barcode";

export default class App {
  constructor() {
    this.resultCollector = Quagga.ResultCollector.create({
        capture: true,
        capacity: 20,
        blacklist: [{code: "2167361334", format: "i2of5"}],
        filter: function(codeResult) {return true;}
    });
    this.inputMapper = {
      inputStream: {
        constraints:(value) => {
          var values = value.split('x');
          return {width: {min: parseInt(values[0])}, height: {min: parseInt(values[1])}};
        }
      },
      numOfWorkers:(value) => {console.log("aa="+value); return parseInt(value);},
      decoder: {
        readers: (value) => {
          console.log("ss="+value); 
          if (value === 'ean_extended') return [{format: "ean_reader",config: {supplements: ['ean_5_reader', 'ean_2_reader']}}];
          return [{format: value + "_reader", config: {}}];
        }
      }
    }
    this.state = {
      inputStream: {
        type : "LiveStream",
        constraints: {width: {min: 640}, height: {min: 480}, facingMode: "environment", aspectRatio: {min: 1, max: 2}}
      },
      locator: {patchSize: "medium", halfSample: true},
      numOfWorkers: 4,
      decoder: {readers : [{format: "ean_reader", config: {}}]},
      locate: true
    }
    this.lastResult = null
  }
  init() {
    var self = this;
    Quagga.init(this.state, (err) => {
      if (err) return self.handleError(err);
      Quagga.registerResultCollector(this.resultCollector);
      this.attachListeners();
      Quagga.start();
    });
  }
  handleError(err) {
    console.log(err);
  }
  attachListeners() {
    var self = this;
    $(".controls").on("click", "button.stop", (e) => {
      e.preventDefault();
      Quagga.stop();
      self._printCollectedResults();
    });
    $(".controls .reader-config-group").on("change", "input, select", (e) => {
      e.preventDefault();
      var $target = $(e.target),
      value = $target.attr("type") === "checkbox" ? $target.prop("checked") : $target.val(),
      name = $target.attr("name"),
      state = self._convertNameToState(name);
      console.log("Value of "+ state + " changed to " + value);
      self.setState(state, value);
    });
  }
  _printCollectedResults() {
    var results = this.resultCollector.getResults(),
    $ul = $("#result_strip ul.collector");

    results.forEach(function(result) {
      var $li = $('<li><div class="thumbnail"><div class="imgWrapper"><img /></div><div class="caption"><h4 class="code"></h4></div></div></li>');
      $li.find("img").attr("src", result.frame);
      $li.find("h4.code").html(result.codeResult.code + " (" + result.codeResult.format + ")");
      $ul.prepend($li);
    });
  }
  _accessByPath(obj, path, val) {
    var parts = path.split('.'),
    depth = parts.length,
    setter = (typeof val !== "undefined") ? true : false;

    return parts.reduce(function(o, key, i) {
      if (setter && (i + 1) === depth) o[key] = val;
      return key in o ? o[key] : {};
    }, obj);
  }
  _convertNameToState(name) {
    return name.replace("_", ".").split("-").reduce(function(result, value) {
      return result + value.charAt(0).toUpperCase() + value.substring(1);
    });
  }
  detachListeners() {
    $(".controls").off("click", "button.stop");
    $(".controls .reader-config-group").off("change", "input, select");
  }
  setState(path, value) {
    var self = this;
    if (typeof self._accessByPath(self.inputMapper, path) === "function") value = self._accessByPath(self.inputMapper, path)(value);
    self._accessByPath(self.state, path, value);
    console.log(JSON.stringify(self.state));
    this.detachListeners();
    Quagga.stop();
    this.init();
  }
}

Quagga.onProcessed((result) => {
  var drawingCtx = Quagga.canvas.ctx.overlay,
  drawingCanvas = Quagga.canvas.dom.overlay;

  if (result && result.boxes) {
    drawingCtx.clearRect(0, 0, parseInt(drawingCanvas.getAttribute("width")), parseInt(drawingCanvas.getAttribute("height")));
    result.boxes.filter((box) => {
      return box !== result.box;
    }).forEach((box) => {Quagga.ImageDebug.drawPath(box, {x: 0, y: 1}, drawingCtx, {color: "green", lineWidth: 2});});
  }

  if (result && result.box) {
    Quagga.ImageDebug.drawPath(result.box, {x: 0, y: 1}, drawingCtx, {color: "#00F", lineWidth: 2});
  }

  if (result && result.codeResult && result.codeResult.code) {
    Quagga.ImageDebug.drawPath(result.line, {x: 'x', y: 'y'}, drawingCtx, {color: 'red', lineWidth: 3});
  }
});

Quagga.onDetected((result) => {
  var code = result.codeResult.code;
  console.log(code, App.lastResult);
  if (App.lastResult !== code) {
    App.lastResult = code;
    var $node = null, canvas = Quagga.canvas.dom.image;
    $node = $('<li><div class="thumbnail"><div class="imgWrapper"><img /></div><div class="caption"><h4 class="code"></h4></div></div></li>');
    $node.find("img").attr("src", canvas.toDataURL());
    $node.find("h4.code").html(code);
    $("#result_strip ul.thumbnails").prepend($node);
  }
  new Barcode().add(code);
});

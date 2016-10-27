import Camera from "./camera/Camera";
import Barcode from "./camera/Barcode";

let camera = new Camera();
let barcode = new Barcode();

// 実行したい処理
window.onload = () => {

  console.log("load");
  barcode.onload();

  jQuery('#startVideo').click(() => {
    camera.startVideo();
  });

  jQuery('#takeSnapshot').click(() => {
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



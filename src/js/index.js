import {startVideo} from "./camera/index";

// 実行したい処理
 window.onload = () => {

  console.log("load");
  jQuery('#startVideo').click(function() {
    startVideo();
  });

};
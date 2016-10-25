// start local video

export default class Camera {

  constructor(){
    this.video = null;
    this.canvas = null;
    this.ctx = null;
    this.image = null;
    this.localMediaStream = null;
  }

  startVideo() {

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
    navigator.getUserMedia({video: true, audio: false},
      (stream) => {
        this.localMediaStream = stream;
        this.video.src = window.URL.createObjectURL(stream);
      },
      (error) => {
        console.error('mediaDevice.getUserMedia() error:');
        return;
      });
  }

  /**
   * スナップショット
  */
  takeSnapshot() {
    if(this.localMediaStream){
      this.ctx.drawImage(this.video, 0, 0, 320, 240);
      this.image.src = this.canvas.toDataURL('image/jpeg');
      console.log("TAKE SNAP SHOT")
    }
  }

}
// Barcode Class

export default class Barcode {

  constructor(){
    console.log("aaa");
    JOB.Init();
  }

  _SetImageCallback(result){
    if(result.length > 0){
      let tempArray = [];
      for(let i = 0; i < result.length; i++) tempArray.push(result[i].Format+" : "+result[i].Value);
      Result.innerHTML=tempArray.join("<br />");
    } else {
      if(result.length === 0) Result.innerHTML="Decoding failed.";
    }
  }
  _OrientationCallback(result){
    canvas.width = result.width;
    canvas.height = result.height;
    let data = ctx.getImageData(0,0,canvas.width,canvas.height);
    for(var i = 0; i < data.data.length; i++) data.data[i] = result.data[i];
    ctx.putImageData(data,0,0);
  }
  _SetLocalizationCallback(result){
    ctx.beginPath();
    ctx.lineWIdth = "2";
    ctx.strokeStyle="red";
    for(var i = 0; i < result.length; i++) ctx.rect(result[i].x,result[i].y,result[i].width,result[i].height);
    ctx.stroke();
  };

  onload(){
    let takePicture = document.querySelector("#Take-Picture");
    let showPicture = document.createElement("img");
    let Result = document.querySelector("#textbit");
    var canvas =document.getElementById("picture");
    var ctx = canvas.getContext("2d");

    JOB.SetImageCallback((result)=>this._SetImageCallback(result));
    JOB.PostOrientation = true;
    JOB.OrientationCallback = (result)=>this._OrientationCallback(result);
    JOB.SwitchLocalizationFeedback(true);
    JOB.SetLocalizationCallback((result)=>this._SetLocalizationCallback(result));
    if(takePicture && showPicture) {
        takePicture.onchange = (event) => {
          var files = event.target.files;
          if (files && files.length > 0) {
            file = files[0];
            try {
              var URL = window.URL || window.webkitURL;
              showPicture.onload = (event) => {
                Result.innerHTML="";
                JOB.DecodeImage(showPicture);
                URL.revokeObjectURL(showPicture.src);
              };
              showPicture.src = URL.createObjectURL(file);
            }
            catch (e) {
              try {
                var fileReader = new FileReader();
                fileReader.onload = function (event) {
                  showPicture.onload = function(event) {
                    Result.innerHTML="";
                    JOB.DecodeImage(showPicture);
                  };
                  showPicture.src = event.target.result;
                };
                fileReader.readAsDataURL(file);
              }
              catch (e) {
                Result.innerHTML = "Neither createObjectURL or FileReader are supported";
              }
            }
          }
        }
      }
  }
}
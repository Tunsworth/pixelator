var slider = document.getElementById("BrightnessSlider");
var slider1 = document.getElementById("ContrastSlider");
var slider2 = document.getElementById("redSlider");
var slider3 = document.getElementById("greenSlider");
var slider4 = document.getElementById("blueSlider");
var slider5 = document.getElementById("pixelSlider");

var output = document.getElementById("BrightnessValue");
var output1 = document.getElementById("ContrastValue");
var output2 = document.getElementById("redValue");
var output3 = document.getElementById("greenValue");
var output4 = document.getElementById("blueValue");
var output5 = document.getElementById("pixelValue");

brightnessSlider = document.getElementById('BrightnessSlider');
brightnessValue = document.getElementById('BrightnessValue');
contrastSlider = document.getElementById('ContrastSlider');
contrastValue = document.getElementById('ContrastValue');


output.innerHTML = slider.value;
output1.innerHTML = Math.floor(slider1.value/ 1.2) + 17; //change slider range to display between 0-100 
output2.innerHTML = Math.floor(slider2.value / 1.75) -45; 
output3.innerHTML = Math.floor(slider3.value / 1.75) -45;
output4.innerHTML = Math.floor(slider4.value / 1.75) -45;
output5.innerHTML = slider5.value;

slider.oninput = function () {
  localStorage.setItem('BrightnessValue', slider.value);
  output.innerHTML = this.value;
}

slider1.oninput = function () {
  output1.innerHTML = Math.floor(this.value /1.2) +17 ;//change slider range to display between 0-100 when adjusted
}

slider2.oninput = function () {
  output2.innerHTML = Math.floor(this.value / 1.75) -45; 
}

slider3.oninput = function () {
  output3.innerHTML = Math.floor(this.value / 1.75) -45;
}

slider4.oninput = function () {
  output4.innerHTML = Math.floor(this.value / 1.75) -45;
}

slider5.oninput = function (opts) {
  output5.innerHTML = this.value;
}

function button() {
      init();
}

function init() {
  var pixel = parseInt(pixelSlider.value * 2, 10);
  manipulation();

  document.getElementById('portrait-image').Pixelate([
    { resolution: pixel },
    { shape: 'square', resolution: 40, size: 10, offset: 12, alpha: 0.5 },
  ]);

};

function manipulation() {
  // utility functions
  function isArray(obj) {
    return Object.prototype.toString.call(obj) === "[object Array]"
  }

  function isObject(obj) {
    return Object.prototype.toString.call(obj) === "[object Object]"
  }

  var console = window.console

  // check for canvas support
  var canvas = document.createElement('canvas')
  var isCanvasSupported = canvas.getContext && canvas.getContext('2d')

  // don't proceed if canvas is no supported
  if (!isCanvasSupported) {
    return
  }

  class pixelation {
    constructor(img, options) {
      this.img = img;
      // creat canvas
      var canvas = this.canvas = document.createElement('canvas');
      this.ctx = canvas.getContext('2d');
      // copy attributes from img to canvas
      canvas.className = img.className;
      canvas.id = img.id;

      this.render(options);

      // replace image with canvas
      img.parentNode.replaceChild(canvas, img);
    }
    render(options) {
      this.options = options;
      // set size
      var w = this.width = this.canvas.width = this.img.width;
      var h = this.height = this.canvas.height = this.img.height;

      // draw image on canvas
      this.ctx.globalCompositeOperation = 'portrait-image';
      this.ctx.drawImage(this.img, 0, 0, this.img.width, this.img.height);
      // get imageData
      try {
        this.imgData = this.ctx.getImageData(0, 0, w, h).data;
      } catch (error) {
        if (console) {
          console.error(error);
        }
        return;
      }

      this.ctx.clearRect(0, 0, w, h);

      for (var i = 0, len = options.length; i < len; i++) {
        this.renderPixels(options[i]);
      }
    }
    renderPixels(opts) {
      var w = this.width;
      var h = this.height;
      var ctx = this.ctx;
      var imgData = this.imgData;


      // option defaults
      var res = opts.resolution || 16;
      var size = opts.size || res;
      var alpha = opts.alpha || 1;
      var offset = opts.offset || 0;
      var offsetX = 0;
      var offsetY = 0;
      var cols = w / res + 1;
      var rows = h / res + 1;
      var halfSize = size / 2;

      if (isObject(offset)) {
        offsetX = offset.x || 0;
        offsetY = offset.y || 0;
      } else if (isArray(offset)) {
        offsetX = offset[0] || 0;
        offsetY = offset[1] || 0;
      } else {
        offsetX = offsetY = offset;
      }

      var row, col, x, y, pixelY, pixelX, pixelIndex, red, green, blue, pixelAlpha;
      var brightness = parseInt(brightnessSlider.value, 10);
      var contrast = parseInt(contrastSlider.value, 10);
      var contrast = (contrast / 100) + 1; //convert to decimal & shift range: [0..2]
      var intercept = 128 * (1 - contrast);
      var redCut = parseInt(redSlider.value, 10);
      var greenCut = parseInt(greenSlider.value, 10);
      var blueCut = parseInt(blueSlider.value, 10);

      for (row = 0; row < rows; row++) {
        y = (row - 0.5) * res + offsetY;
        // normalize y so shapes around edges get color
        pixelY = Math.max(Math.min(y, h - 1), 0);

        for (col = 0; col < cols; col++) {
          x = (col - 0.5) * res + offsetX;
          // normalize y so shapes around edges get color
          pixelX = Math.max(Math.min(x, w - 1), 0);
          pixelIndex = (pixelX + pixelY * w) * 4;

          red = imgData[pixelIndex + 0] * contrast + intercept;
          if (red >= 64 && red <= redCut) {
            red = 255 * (brightness / 100);
          } else { red = 0; }

          green = imgData[pixelIndex + 1] * contrast + intercept;
          if (green >= 64 && green <= greenCut) {
            green = 255 * (brightness / 100);
          } else { green = 0; }

          blue = imgData[pixelIndex + 2] * contrast + intercept;
          if (blue >= 64 && blue <= blueCut) {
            blue = 255 * (brightness / 100);
          } else { blue = 0; }

          pixelAlpha = alpha * (imgData[pixelIndex + 3] / 255);

          function updateRect() {
            ctx.fillStyle = 'rgba(' + red + ',' + green + ',' + blue + ',' + pixelAlpha + ')';
            ctx.fillRect(x - halfSize, y - halfSize, size, size);
          }
          updateRect();
        } // col
      } // row
    }
  }

  // enable img.Pixelate
  HTMLImageElement.prototype.Pixelate = function (options) {
    return new pixelation(this, options)
  }

  // put in global namespace
  window.pixelation = pixelation
}

function download() {
  var download = document.getElementById("download");
  var image = document.getElementById("portrait-image").toDataURL("image/png")
    .replace("image/png", "image/octet-stream");
  download.setAttribute("href", image);
  //download.setAttribute("download","archive.png");
}
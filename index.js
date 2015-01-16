var Promise = require('bluebird');
var PNG = require('png-js');
var rgb2xterm = require('color2xterm').rgb2xterm;
var clc = require('cli-color');

var getPNGPixels = function(path){
  return new Promise(function(resolve, reject){
    PNG.decode(path, function(pixels){
      resolve(pixels);
    });
  });
};

var framePaths = Array.apply(null, Array(8)).map(function(_, index){
  return './images/' + index + '.png';
});

var getPNGsPixels = function(paths){
  return Promise.all(paths.map(getPNGPixels));
};

var pixelsToASCII = function(pixels, width, transparentColor){
  var result = ""
  var sign = "  "

  for(var i=0, l=pixels.length; i<l; i+=4) {
    // What is the xTerm equivalent of this color?

    var c = null

    if(transparentColor && pixels[i+3] === 0) {
      c = rgb2xterm(transparentColor.r, transparentColor.g, transparentColor.b);
    } else {
      // Generate colored element
      c = rgb2xterm(pixels[i], pixels[i+1], pixels[i+2]);
    }

    result += clc.bgXterm(c)(sign);

    // If we reached end of the line, break it and start from the beginning
    // again
    if ((i+4)%((4*width)) === 0) {
      result += '\n';
    }
  }

  return result;
}

module.exports = saucisse = {
  pixelsToASCII: pixelsToASCII,
  getPNGsPixels: getPNGsPixels,
  getPNGPixels: getPNGPixels,
  framePaths: framePaths
}

const fs = require('fs')
const path = require('path')
const tmp = require('tmp')
const getPixels = require('get-pixels')
const getRgbaPalette = require('get-rgba-palette')
const chroma = require('chroma-js')
const getSvgColors = require('get-svg-colors')

const patterns = {
  image: /\.(gif|jpg|png|svg)$/i,
  raster: /\.(gif|jpg|png)$/i,
  svg: /svg$/i
}

module.exports = function colorPalette (file, filetype, callback) {
  if (!callback) {
    callback = filetype;
    filetype = '';
  }

  // SVG
  if (!Buffer.isBuffer(file) && file.match(patterns.svg)) {
    return callback(null, getSvgColors(file, {flat: true}))
  }

  // PNG, GIF, JPG
  return paletteFromBitmap(file, filetype, callback)
}

function paletteFromBitmap (file, filetype, callback) {
  getPixels(file, filetype, function (err, pixels) {
    if (err) return callback(err)
    const palette = getRgbaPalette(pixels.data, 5).map(function (rgba) {
      return chroma(rgba)
    })
    return callback(null, palette)
  })
}

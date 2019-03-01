<!-- FlipSlide CANVAS -->
<!--

  -->
<template>
  <div>
    <canvas
      :id="'canvas'+id"
      :ref="'canvas'+id"
      :width="width"
      :style="{
        width: size.width,
        height: size.height,
        zIndex: zindx,
        transform: 'matrix('+cScale+','+cRot+','+(-1*cRot)+','+cScale+','+cXPos+','+cYPos+')'
      }"
      :height="height" />
  </div>
</template>

<script>
import Point from './util/Point'

export default {
  name: 'FSCanvas',

  props: {
    size: Object,
    id: Number,
    zindx: Number
  },

  data: function () {
    // var color = this.$eventHub.colors[0]

    var styles = {
      'width': this.size.width + 'px',
      'height': this.size.height + 'px',
      'z-index': this.zindx
    }

    return {
      cScale: 1,
      cRot: 0,
      cXPos: 0,
      cYPos: 0,
      points: [],
      color: "#000000",
      styles: styles,
      width: this.size.width,
      height: this.size.height,
      can: null,
      ctx: null,
      maxRecursion: 100
    }
  },

  mounted: function() {

    var id = 'canvas' + this.id

    this.can = this.$refs[id]
    this.ctx = this.can.getContext('2d')

    // var size = this.$eventHub.size

    // var point1 = {x: 200, y: 200}
    // var point2 = {x: 0, y: 0}

    this.$eventHub.$on("scale", this.setScale)
    this.$eventHub.$on("rotate", this.setRotate)

    /*
    this.$eventHub.$on('mpos', (e) =>{
      point2 = e

      this.clear()

      let xDiff = point2.x - point1.x
      let yDiff = point2.y - point1.y

      let slope = yDiff / xDiff
      let m = isFinite(slope) ? slope : 0

      let endX = 0
      let endY = 0

      for(var x = 0; x <= Math.abs(xDiff); x++) {
        endX = 0

        if (point2.x < point1.x) {
          endX = (x*-1) + point1.x
        } else {
          endX = (x) + point1.x
        }

        this.drawPoint({x: endX, y: point1.y})
      }

      for(var y = 0; y <= Math.abs(yDiff); y++) {
        endY = 0

        if (point2.y < point1.y) {
          endY = (y*-1) + point1.y
        } else {yDiff
          endY = (y) + point1.y
        }

        this.drawPoint({x: point1.x, y: endY})
      }

      for(var i = -1 * Math.abs(xDiff); i < Math.abs(xDiff); i += Math.abs(xDiff/200)) {

        var xpos = 0
        var ypos = 0
        var _m = 0
        var _xflip = 0

        if(point2.x < point1.x) {
          xpos = -1 * i
          _xflip = 1
        } else {
          xpos = i
          _xflip = -1
        }

        if(point2.y > point1.y) {
          ypos = -1 * i
          _m = m
        } else {
          ypos = i
          _m = -1 * m
        }

        var _x = point1.x + xpos
        var _y = point1.y + ypos * (_xflip * _m)

        for(var i2 = point1.x; i2 < point1.x + xpos; i2+= 4){
          this.drawPoint({x: _x, y: i2})
        }

        this.drawPoint({x: _x, y: _y})
      }

      this.drawPoint(point1)
      this.drawPoint(point2)
    })
    */

    this.$eventHub.$on("colorChange", this.setColor)
  },

  methods: {
    redraw() {
      this.clear()
      this.points.forEach((point)=>{
        this.drawPoint(point)
      })
    },

    setRotate(val) {
      this.cRot = val
    },

    setScale(val) {
      this.cScale = val
      this.cXPos = 100 * val
      this.cYPos = 100 * val

      // transform = 'matrix('+this.cScale+',0,0,'+this.cScale+','+this.cXPos+','+this.cYPos+')'
    },

    draw( point ) {
      this.drawPoint(point)
    },

    setColor(e) {
      this.color = e
    },

    drawSlopeIntercept(point1, point2, i = 0){

      let xDiff = point2.x - point1.x
      let yDiff = point2.y - point1.y

      let slope = yDiff / xDiff
      let m = isFinite(slope) ? slope : 0

      let _x = (m * i)
      let _y = point2.y

      this.drawPoint({x: _x, y: _y})

      if(i < 20){
        i++
        this.drawSlopeIntercept(point1, point2, i)
      }

    },

    drawPoint( point, size = this.$eventHub.size ) {
      this.ctx.fillStyle = this.color
      var _x = point.x
      var _y = point.y

      this.ctx.fillRect( _x, _y, size.h, size.w )
    },

    oldDraw() {

    },

    drawLine( point, i = 0 ) {
      if( i <= 20 ) {
        point.y += 2
        point.x += 0
        this.drawPoint( point )
        i++
        this.drawLine( point, i )
      } else {
        return
      }
    },

    drawPoly( ) {

    },

    drawImage( img, position ) {
      this.ctx.drawImage(img, position.x, position.y, img.width, img.height)
    },

    checkGaps( pntBounds ) {
        var xDif = pntBounds[0].x - pntBounds[1].x
        // var yDif = pntBounds[0].y - pntBounds[1].y

        var pntInner = []

        for( var xd = 0; xd <= xDif; xd++ ){
          let x = pntBounds[0].x - xd
          let y = pntBounds[0].y
          let pnt = new Point( x, y )

          pntInner.push( pnt )
        }

        this.drawStroke( pntInner )
    },

    drawStroke( stroke, i = 0 ) {
      // Recursive drawing

      if ( i <= stroke.length-1 ) {

        // Fill any gaps
        if( i > 0 ){
          var pnts = [ stroke[i], stroke[i-1] ]
          this.checkGaps(pnts)
        }

        this.drawPoint( stroke[i] )
        i++

        this.drawStroke( stroke, i )
      } else {

        return

      }
    },

    fill(){
      this.ctx.fillStyle = this.$eventHub.col.getColor()
      this.ctx.fillRect( 0, 0, this.width, this.height)
    },

    clear() {
      this.ctx.clearRect( 0, 0, this.width, this.height )
    },

    erase( point ) {
      var size = this.$eventHub.size
      this.ctx.clearRect( point.x, point.y, size.h, size.w )
    }

  }
}
</script>

<style>

canvas {
  position: absolute;
  top: 0px;
  left: 0px;
}

</style>

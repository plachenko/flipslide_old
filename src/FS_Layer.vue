<!-- FlipSlide LAYER -->
<!--
  A LAYER is a unit stored in a PANEL.

  Takes:
  - Width
  - Height
  - Offset

  Has:
  - Width: local Width
  - Height: local Height
  - Offset: Position offset from origin

  - Current frame: (0 by default)
  + Frames: An array of Frames
    + Frame: An array of Strokes
      + Stroke: An array of points
        - Offset: position
        + Points: Position with time

-->
<template>
  <div id="fsLayers">
    <!-- Layers -->
    <!--
    <fscanvas
      v-for="(layer, idx) in layers"
      :key="idx"
      :id="idx"
      :size="layer.size"
      ref="canvas"
      :zindx="idx"
      type="lyr" />
      -->
    <fscanvas
      ref="canvas"
      :size="panelSize"
      :z-index="1"
      />
  </div>
</template>

<script>
import Point from './util/Point'
import FSCanvas from './FS_Canvas'

export default {
  name: 'FSLayer',

  components: {
    fscanvas: FSCanvas
  },

  props: {
    panelSize: Object
  },

  mounted() {
    this.$nextTick(() => {
      // -- Post render here
    })
    this.addLayer()

    this.$eventHub.$on('pDown', this.pDown)
    this.$eventHub.$on('pMove', this.pMove)
    this.$eventHub.$on('pUp', this.pUp)
  },

  data() {
    return {
      layers: [],
      frameIdx: 0,
      ctx: null,
      curLyrInd: 0,
      curLyrRef: null,
      curFrmInd: 0
    }
  },

  methods: {

    /* -- POINTER EVENTS --*/
    pDown(e) {
      var pnt = e[0]
      this.curLyrRef.draw({x: pnt.x, y: pnt.y})
    },

    pMove(e) {
      let ctx = this.curLyrRef.ctx

      let pnt = e[e.length-1]
      let pnt_pre = e[e.length-2]

      // Check for 'gaps' in the stroke and fill in between
      let xDiff = pnt.x - pnt_pre.x
      let yDiff = pnt.y - pnt_pre.y
      let size = this.$eventHub.size

      let slope = yDiff / xDiff
      let m = isFinite(slope) ? slope : 0

      var point1 = pnt_pre
      var point2 = pnt
      var endX = 0
      var endY = 0

      /*

      for(var x = 0; x<=Math.abs(xDiff); x++){
        if (point2.x < point1.x) {
          endX = (x*-1) + point1.x
        } else {
          endX = (x) + point1.x
        }

        this.curLyrRef.ctx.fillStyle = "#FF0000"
        this.curLyrRef.ctx.fillRect(endX, point2.y, size.h, size.w)

        // this.curLyrRef.draw({x: endX, y: point2.y})
        // this.curLyrRef.draw({x: endX, y: point1.y})
      }

      for(var y = 0; y <= Math.abs(yDiff); y++) {
        endY = 0

        if (point2.y < point1.y) {
          endY = (y*-1) + point1.y
        } else {yDiff
          endY = (y) + point1.y
        }

        this.curLyrRef.ctx.fillStyle = "#0000FF"
        this.curLyrRef.ctx.fillRect(point2.x, endY, size.h, size.w)
        // this.curLyrRef.draw({x: point1.x, y: endY})
      }
      */

      if(Math.abs(xDiff) < 1) {
        var _y = 0
        var _x = pnt.x
        var flip = 1

        if(point2.y > point1.y){
          flip = -1
        } else {
          flip = 1
        }

        for(var i = 0; i < Math.abs(yDiff); i += .1){
          _y = pnt.y + i * flip

          this.curLyrRef.draw({x: _x, y: _y})
        }
      }

      for(var i = 0; i < Math.abs(xDiff); i += .01) {

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

        // this.curLyrRef.ctx.fillStyle = "#00FF00"
        // this.curLyrRef.ctx.fillRect(_x, _y, size.h, size.w)


        this.curLyrRef.draw({x: _x, y: _y})

      }

      // Draw the point
      this.curLyrRef.draw({x: pnt.x, y: pnt.y})
    },

    pUp(e) {
      // this.curLyrRef[0].drawStroke(e)
    },

    addLayer () {
      let layerObj = {
        size: this.panelSize,
        name: 'Layer',
        frames: []
      }

      this.layers.push(layerObj)
      this.curLyrRef = this.$refs.canvas
    },

    removeLayer() {

    },

    storeStroke(e){
      this.layers[this.curLyrInd].frames[this.curFrmInd].push(e)
    },

    fillLayer( layer = this.curLyrRef ) {
      layer.fill()
    }
  }

}
</script>

<style>
  #fsLayers{
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;
  }
  #fsLayerSlot{
    z-index:100;
    top: 0px;
    left: 0px;
    position: absolute;
  }
</style>

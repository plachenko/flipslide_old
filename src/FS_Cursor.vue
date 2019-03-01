<!-- FlipSlide CURSOR -->
<!--
  The cursor component takes the position of the current
  pointer and renders a cursor at the specified point.

  There can be multiple cursors.

  On pointer down send down event


  -->
<template>
  <div>
    <div id="fs_capturePointer"
        ref="capture"
        @pointerdown="pointerDown"
        @pointerup="pointerUp"
        @pointermove="pointerMove" />

    <div id="cursors">
      <fscanvas
        v-for="(cur, idx) in cursors"
        type="cur"
        ref="cursor"
        :key="idx"
        :id="idx"
        :zindx="1000"
        :size="size" />
    </div>
  </div>
</template>

<script>

import Point from './util/Point'
import Stroke from './util/Stroke'

import FSCanvas from './FS_Canvas'

export default {
  name: 'FSCursor',

  props: {
    bookSize: Object
  },

  components: {
    fscanvas: FSCanvas
  },

  data () {
    var size = this.bookSize

    return {

      cScale: 1,
      cRot: 0,
      xOffset: 0,
      yOffset: 0,

      cursors: [{
        position: 0
      }],

      pointArr: [],
      md: false,
      size: size,
      position: new Point(0,0)
    }

  },

  created () {

    this.$nextTick(() => {
      // prevent right clicking
      this.$refs.capture.oncontextmenu = (e) => e.preventDefault()
    })

  },

  mounted () { },

  methods: {

    pointerDown( e ) {
      e.preventDefault()

      this.md = true
      var startPoint = new Point( e.clientX, e.clientY )
      this.pointArr.push( startPoint )

      // Send Pointer Down event
      this.$eventHub.$emit('pDown', [...this.pointArr])
    },

    pointerMove( e ) {
      e.preventDefault()

      this.position.x = e.clientX + ( this.$eventHub.size.w / 2 )
      this.position.y = e.clientY + ( this.$eventHub.size.w / 2 )

      var position = {
        x: this.position.x,
        y: this.position.y
      }

      this.$refs.cursor[0].clear()
      this.drawCursor( position )

      this.$eventHub.$emit('mpos', {x: e.clientX, y: e.clientY})

      // If the mouse is down send Pointer Move event
      if ( this.md ) {
        var point = new Point( e.clientX, e.clientY )
        this.pointArr.push( point )
        this.$eventHub.$emit( 'pMove', [...this.pointArr] )
      }
    },

    drawCursor( point ) {
      var _size = this.$eventHub.size.w
      var size = this.$eventHub.size

      let pointOffset = {
        x: Math.round( point.x - _size / 2 ),
        y: Math.round( point.y - _size / 2 )
      }

      this.$refs.cursor[0].drawPoint(pointOffset, size)

      // Draw cursor cross.
      this.$refs.cursor[0].ctx.fillStyle = "#000000"

      // Draw the horizontal line
      for (var hCross = -_size; hCross < _size; hCross += 3) {
        let pnt = {
          x: Math.round( hCross + point.x ),
          y: Math.round( point.y )
        }
        this.$refs.cursor[0].ctx.fillRect(pnt.x, pnt.y, 2, 2)
      }

      // Draw the vertical line
      for (var vCross = -_size; vCross < _size; vCross += 3) {
        let pnt = {
          x: Math.round( point.x ),
          y: Math.round( vCross + point.y )
        }
        this.$refs.cursor[0].ctx.fillRect(pnt.x, pnt.y, 2, 2)
      }

    },

    pointerUp(e) {
      e.preventDefault()

      this.md = false
      var endPoint = new Point( e.clientX, e.clientY )
      this.pointArr.push( endPoint )
      this.$eventHub.$emit('pUp', [...this.pointArr])
      this.pointArr = []
    }

  }
}
</script>
<style>
  #debug{
    background-color:#CCC;
    position: absolute;
    width: 150px;
    height: 100px;
    z-index: 9999;
    padding: 10px;
  }

  .canvas{
    position: absolute;
    top: 0px;
    left:0px;
  }

  #fs_capturePointer{
    /* cursor: none; */
    position: absolute;
    user-select: none;
    cursor: none;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    touch-action: none;
    z-index: 9000;
  }
</style>

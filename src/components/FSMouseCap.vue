<template>
  <div>
    <div id="captureDiv" @pointerdown="dnEvt" @pointermove="mvEvt" @pointerup="upEvt"  ref="capture" />
    <canvas v-for="(i, c) in 4" :key="i" ref="can"></canvas>
    <!-- 0: Grid -->
    <!-- 1: Mouse Position -->
    <!-- 2: Stroke Prediction -->
    <!-- 3: Rendered Position -->
  </div>
</template>
<script>
export default {
  name: "FSMouseCap",
  data(){
    return{
      mousePos: null,
      md: false,
      middle: false,
      firstPoint: {x: 0, y: 0},
      can: [],
      size: 4
    }
  },
  mounted(){
    this.can = this.$refs.can.slice()

    window.addEventListener('resize', this.resizeEvt)

    this.sizeCanvas()
  },
  methods: {

    /* COMPONENT EVENTS */
    resizeEvt(){
      // Todo: look into moving this method into a parent component
      this.sizeCanvas()
    },
    dnEvt(e){
      this.mousePos = {x: e.clientX, y: e.clientY}
      this.$eh.$emit('mouseDn', this.mousePos)
      this.md = true
    },
    mvEvt(e){
      let _ctx = this.can[2].getContext('2d')
      let _x = e.clientX
      let _y = e.clientY

      this.mousePos = {x: _x, y: _y}

      this.drawCursor()
      this.drawPos()

      // TODO: remove this
      if(this.md){
        this.$eh.$emit('mouseMv', this.mousePos)
      }

      /*
      // TODO: !!! Use this instead !!!
      // Leaving this here to keep focus on task
      let _ret = {
        pos: this.mousePos,
        md: this.md
      }
      this.$eh.$emit('mouseMv', _ret)
      */
    },
    upEvt(e){
      this.md = false
      this.$eh.$emit('mouseUp', this.mousePos)
    },

    /*-- CANVAS METHODS --*/
    sizeCanvas(){
      this.can.forEach((e) => {
        e.width = window.innerWidth
        e.height = window.innerHeight
      })

      this.drawGrid()
    },

    /*-- DRAWING METHODS --*/
    drawGrid(){
      let _size = this.size

      let _can = this.can[0]

      let _w = _can.clientWidth
      let _h = _can.clientHeight

      let _ctx = _can.getContext('2d')
        _ctx.lineWidth = .2

      // Draw Y Lines
      for(var y = 0; y < _h / _size; y++){
        _ctx.beginPath()
        _ctx.moveTo(0, y * _size)
        _ctx.lineTo(_w, y * _size)
        _ctx.stroke()
        _ctx.closePath()
      }

      // Draw X Lines
      for(var x = 0; x < _w / _size; x++){
        _ctx.beginPath()
        _ctx.moveTo(x * _size, 0)
        _ctx.lineTo(x * _size, _h)
        _ctx.stroke()
        _ctx.closePath()
      }

    },
    drawCursor(){
      let _pt = this.mousePos
      let _can = this.can[1]
      let _ctx = _can.getContext('2d')
      let _size = this.size

      let _w = _can.clientWidth
      let _h = _can.clientHeight

      let _x = 0
      let _y = 0

      let _step = 4

      // _ctx.fillRect(_pt.x, _pt.y, _pt.x+1, _pt.y+1)
      this.clearCan(1)

      for(var y1 = 0; y1 <= (_pt.y / _size); y1 ++){
        _y = y1 * _size
        _ctx.fillRect(0, _y, _size, _size)
      }

      for(var x1 = 0; x1 <= (_pt.x / _size); x1 += 1){
        _x = x1 * _size
        _ctx.fillRect(_x, 0, _size, _size)
      }

      for(var i = _x; i<= _pt.x; i += _step){
        for(var j = _y; j<= _pt.y; j += _step){
          _ctx.fillRect(i, j, 2, 2)
        }
      }

    },
    drawPos(){
      let _pt = this.mousePos
      let _can = this.can[2]
      let _ctx = _can.getContext('2d')
      let _size = this.size * 4
      _ctx.fillStyle = "#31F"

      let _w = _can.clientWidth
      let _h = _can.clientHeight

      let _timer = null

      clearTimeout(_timer)
      _timer = setTimeout(()=>{
        this.clearCan(2)
      },100)

      _ctx.fillStyle="rgba(244,0,0,.2)"
      _ctx.fillRect(0, 0, _size, _size)
      _ctx.fillRect((_w - _size), 0, _size, _size)
      _ctx.fillRect(0, (_h - _size), _size, _size)
      _ctx.fillRect((_w - _size), (_h - _size), _size, _size)

      _ctx.fillRect(_pt.x, _pt.y, 5, 5)
    },
    fillCan(idx){
      let _can = this.can[idx]
      let _ctx = _can.getContext('2d')
      let _w = _can.clientWidth
      let _h = _can.clientHeight

     _ctx.fillRect(0, 0, this.size, this.size)
    },
    clearCan(idx){
      let _can = this.can[idx]
      let _ctx = _can.getContext('2d')
      let _w = _can.clientWidth
      let _h = _can.clientHeight

     _ctx.clearRect(0, 0, _w, _h)
    }
  }
}
</script>
<style>
canvas {
  position: absolute;
  top: 0px;
  left: 0px;
  image-rendering: pixelated;
}

#captureDiv {
  width: 100%;
  height: 100%;
  position:relative;
  z-index: 9999
}

#fspointer {
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: 9999;
  background-color: #F00
}

</style>

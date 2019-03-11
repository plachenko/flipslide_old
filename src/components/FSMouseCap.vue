<template>
  <div>
    <div id="captureDiv" @pointerdown="dnEvt" @pointermove="mvEvt" @pointerup="upEvt"  ref="capture" />
    <canvas v-for="(i, c) in 4" :key="i" ref="can"></canvas>
    <!-- 0: Grid -->
    <!-- 1: Mouse Position -->
    <!-- 1: Stroke Prediction -->
    <!-- 2: Rendered Position -->
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
      size: 10
    }
  },
  mounted(){
    this.can = this.$refs.can.slice()

    window.addEventListener('resize', this.resizeEvt)

    this.test(10)

    this.sizeCanvas()
  },
  methods: {
    resizeEvt(){
      this.sizeCanvas()
    },
    test(num){
    },
    sizeCanvas(){
      this.can.forEach((e) => {
        e.width = window.innerWidth
        e.height = window.innerHeight
      })

      this.drawGrid()
    },
    drawGrid(){
      let _size = this.size

      let _can = this.can[0]

      let _w = _can.clientWidth
      let _h = _can.clientHeight

      let _ctx = _can.getContext('2d')
        _ctx.lineWidth = .5

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
      // this.clearCan(1)
      let _pt = this.mousePos
      let _can = this.can[1]
      let _ctx = _can.getContext('2d')
      let _size = this.size

      let _w = _can.clientWidth
      let _h = _can.clientHeight

      // _ctx.fillRect(_pt.x, _pt.y, _pt.x+1, _pt.y+1)

      for(var x = 0; x < _pt.x-_size; x += _size){
        if(_pt.x < x){
          _ctx.fillRect(x, 0, _size, _size)
        }
        /*
        for(var y = 0; y < _pt.y; y += _size){
        }
        */
      }

    },
    drawPos(){
      let _pt = this.mousePos
      let _can = this.can[2]
      let _ctx = _can.getContext('2d')
      _ctx.fillStyle = "#31F"

      let _w = _can.clientWidth
      let _h = _can.clientHeight

      _ctx.fillRect(_pt.x, _pt.y, 5, 5)
    },
    dnEvt(e){
      this.mousePos = {x: e.clientX, y: e.clientY}
      this.$eh.$emit('mouseDn', this.mousePos)
      this.md = true
    },
    mvEvt(e){
      let _timer = null
      let _ctx = this.can[2].getContext('2d')

      let _x = e.clientX
      let _y = e.clientY

      this.mousePos = {x: e.clientX, y: e.clientY}

      clearTimeout(_timer)

      _timer = setTimeout(()=>{
        this.clearCan(2)
        console.log('timer')
      },100)

      this.fillCan(2)

      if((e.movementX < 0 && e.movementY < 0)){
        _ctx.beginPath()
        _ctx.moveTo(_x, _y)
        _ctx.lineTo(_x + (2 * e.movementX), _y + (2 * e.movementY))
        _ctx.stroke()
        _ctx.closePath()
      }
      if(e.movementX > 0 && e.movementY > 0){
        _ctx.beginPath()
        _ctx.moveTo(_x, _y)
        _ctx.lineTo(_x - (2 * e.movementX), _y - (2 * e.movementY))
        _ctx.stroke()
        _ctx.closePath()
      }
      console.log(e.movementX)

      this.drawCursor()
      this.drawPos()

      if(this.md){
        this.$eh.$emit('mousePos', this.mousePos)
      }
    },
    fillCan(idx){
      let _can = this.can[idx]
      let _ctx = _can.getContext('2d')
      let _w = _can.clientWidth
      let _h = _can.clientHeight
      _ctx.fillStyle="rgba(244,0,0,.2)"

     _ctx.fillRect(0, 0, _w, _h)
    },
    clearCan(idx){
      let _can = this.can[idx]
      let _ctx = _can.getContext('2d')
      let _w = _can.clientWidth
      let _h = _can.clientHeight

     _ctx.clearRect(0, 0, _w, _h)
    },
    upEvt(e){
      this.md = false
      this.$eh.$emit('mouseUp', this.mousePos)
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

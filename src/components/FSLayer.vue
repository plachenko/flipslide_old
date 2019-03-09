<template>
    <div id="canContainer">
       <div v-if="testing" style="position: absolute; bottom: 100px;">{{JSON.stringify(layerObj)}}</div>
       <canvas ref='can' style="opacity: 1"></canvas>
    </div>
</template>
<script>
export default {
    name: 'FSLayer',
    data(){
        return{
            ctx: null,
            can: null,
            opacity: 1,
            size: {w: 5, h: 5},
            testing: false,
            method: 1,
            historyPosition: 0,
            stroke: [],
            strokes: [],
            strokesTmp: [],
            color: {
                red: 0,
                green: 0,
                blue: 0
            }
        }
    },
    props:{
        width: Number,
        height: Number,
        layerObj: Object
    },
    mounted(){
        this.can = this.$refs.can
        this.can.width = this.width
        this.can.height = this.height

        this.ctx = this.can.getContext('2d')

        // ++TESTING: Dense and simple fill --
        // this._simpleFill()
        // this._denseFill()
        // --TESTING

        this.color = this.$eh.color

        this.$eh.$on('mousePos', this.draw)
        this.$eh.$on('brush', this.brushChange)
        this.$eh.$on('mouseDn', this.drawStart)
        this.$eh.$on('mouseUp', this.drawDone)
        this.$eh.$on('brushEvt', this.brushEvt)
        this.$eh.$on('colorEvt', this.colorEvt)

        this.$eh.$on('undo', this.undo)
        this.$eh.$on('redo', this.redo)
    },
    methods: {
        _simpleFill(){
            let _col = "#FFF"
            _col = "rgb("+
                Math.round(Math.random()*255) + "," +
                Math.round(Math.random()*255) + "," +
                Math.round(Math.random()*255)
            +")"
            this.ctx.fillStyle = _col
            this.ctx.fillRect(0, 0, this.width, this.height)
            this.$eh.$emit('imageSet', {'idx':this.layerObj.idx, 'data':this.can.toDataURL()})
        },
        _denseFill(){
            let _col = "#FFF"
            let _size = 5
            for(var i = 0; i< this.width/_size; i++){
                for(var j = 0; j< this.height/_size; j++){
                    _col = "rgb("+
                        Math.round(Math.random()*255) + "," +
                        Math.round(Math.random()*255) + "," +
                        Math.round(Math.random()*255)
                    +")"
                    this.ctx.fillStyle = _col
                    this.ctx.fillRect(i * _size, j * _size, _size, _size)
                }
            }
            this.$eh.$emit('imageSet', {'idx':this.layerObj.idx, 'data':this.can.toDataURL()})
        },
        colorEvt(e){
          this.color = e
        },
        drawStart(e){
          this.stroke.push(e)
        },
        brushEvt(e){
            this.opacity = e.opacity
            this.size = {w: e.size, h: e.size}
        },
        brushChange(e){
            this.method = e
        },
        draw(e){
            let _obj = {
                x: e.x,
                y: e.y
            }
            this.stroke.push(e)
            switch(this.method){
                case 1:
                    this.brush(_obj)
                    break;
                case 2:
                    this.eraser(_obj)
                    break
            }
        },
        brush(e){
          let _col = "rgb("+
              this.color.red + "," +
              this.color.green + "," +
              this.color.blue + "," +
              this.opacity
          +")"
          this.ctx.fillStyle = _col

          let ctx = this.ctx

          let _strk = this.stroke

          let pnt = _strk[_strk.length-1]
          let pnt_pre = _strk[_strk.length-2]

          console.log(pnt, _strk)
          // Check for 'gaps' in the stroke and fill in between
          let xDiff = pnt.x - pnt_pre.x
          let yDiff = pnt.y - pnt_pre.y
          let size = this.size

          let slope = yDiff / xDiff
          let m = isFinite(slope) ? slope : 0

          var point1 = pnt_pre
          var point2 = pnt
          var endX = 0
          var endY = 0

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

              this.ctx.fillRect(_x, _y, this.size.w, this.size.h)
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


            this.ctx.fillRect(_x, _y, this.size.w, this.size.h)
          }
        },
        undo(){
          if(this.historyPosition > 0){
            this.historyPosition--

            this.strokesTmp = this.strokes.slice()
            this.strokesTmp.splice(this.historyPosition, this.strokes.length)

            this.redraw()
          }
        },
        redo(){
          if(this.historyPosition < this.strokes.length){

            this.historyPosition++

            this.strokesTmp = this.strokes.slice()
            this.strokesTmp.splice(this.historyPosition, this.strokes.length)

            this.redraw()
          }
        },
        eraser(e){
            this.ctx.clearRect(e.x, e.y, this.size.w, this.size.h)
        },
        redraw(){
          this.clear()
          this.strokesTmp.forEach((s) => {
            this.drawStroke(s)
          })
        },
        clear(){
          this.ctx.clearRect(0,0,this.width, this.height)
        },
        drawStroke(stroke){
          stroke.forEach((p) => {
            this.brush(p)
          })
        },
        drawDone(){
          if(this.strokesTmp.length > 0 ){
            this.strokes = this.strokesTmp.slice()
            this.historyPosition = this.strokes.length
            this.strokesTmp = []
          }

          this.strokes.push(this.stroke)
          this.historyPosition++

          this.stroke = []
          this.$eh.$emit('actions', this.strokes)
          this.$eh.$emit('imageSet', {'idx':this.layerObj.idx, 'data':this.can.toDataURL()})
        }
    }
}
</script>
<style>
#canContainer{
    position: absolute;
    top: 0px;
    left: 0px;
}

</style>

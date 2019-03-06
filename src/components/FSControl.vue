<template>
    <div>
        <div @pointerdown="dnEvt" @pointermove="mvEvt" @pointerup="upEvt" id="FSPointer" ref="capture" />
        <canvas id="canvas" ref="canvas" />
    </div>
</template>

<script>
import Vue from 'vue'

export default {
    name: "FSControl",
    data() {
        return{
            canvas: null,
            context: null,
            mousePos: null,
            points: [],
            md: false,
            middle: false,
            scaler: 0,
            rotOffset: 25,
            scaleBuffer: 0,
            firstAngle: 0,
            secondAngle: 0,
            firstPoint: {x: 0, y: 0}
        }
    },
    mounted(){
        this.canvas = this.$refs.canvas
        this.context = this.canvas.getContext('2d')
        this.context.imageSmoothingEnabled = true

        this.sizeCanvas()

        window.addEventListener('contextmenu', this.contextEvt)
        window.addEventListener('resize', this.resizeEvt)
    },
    computed: {
        yDiff: function() {
            // Rise
            return this.points[1].y - this.points[0].y
        },
        xDiff: function() {
            // Run
            return this.points[0].x - this.points[1].x
        },
        hyp: function() {
            //Hypotenuse
            let _ab = Math.pow(this.xDiff, 2) + Math.pow(this.yDiff,2)
            return Math.sqrt(_ab)
        },
        soh: function() {
            // Sin (Opposite / Hypotenuse)
            return Math.asin(this.yDiff / this.hyp)
        }
    },
    watch: {
        mousePos: {
            handler: function(){
                this.draw()
            },
            deep: true
        },
        points: {
            handler: function(){
                this.draw()
            },
            deep: true
        },
        scaler(){
            this.$eh.$emit('scaler', this.scaler) 
        }
    },
    methods: {
        resizeEvt() {
            // TODO: move to global evenhub
            this.sizeCanvas()
        },
        contextEvt(e) {
            e.preventDefault();
        },

        scrollEvt(e) {
            //Add scrolling event functionality
            let _scrollamt = .01
            if(e.deltaY > 0){
                this.scaler += 1 - _scrollamt / 2
            } else{
                this.scaler += 1 + _scrollamt / 2
            }
        },
        dnEvt(e) {
            // Capture the pointer
            let _x = Math.round(e.clientX)
            let _y = Math.round(e.clientY)

            Vue.set(this.points, 0, {x: _x, y: _y})
            Vue.set(this.points, 1, {x: _x, y: _y})

            if(e.which === 2){
                this.middle = true
                this.firstPoint = {x: e.clientX, y: e.clientY}
            } else {
                this.md = true
            }
        },
        mvEvt(e) {
            // If there is no pointer down, set mouse position
            let _x = Math.round(e.clientX)
            let _y = Math.round(e.clientY)

            if(this.md) {
                if(Math.abs(this.xDiff) < this.rotOffset + this.scaleBuffer && Math.abs(this.yDiff) < this.rotOffset + this.scaleBuffer){
                    if(this.points[0].x < this.points[1].x){
                        this.scaler = 1 - (this.hyp / this.rotOffset) / 2
                    }else{
                        this.scaler = 1 + (this.hyp / this.rotOffset) / 2
                    }
                } else {
                    this.scaler = 0
                }

                Vue.set(this.points, 0, {x: _x, y: _y})
            } else if(this.middle) {
                _x = (Math.round(e.clientX - this.firstPoint.x))
                _y = (Math.round(e.clientY - this.firstPoint.y))

                Vue.set(this.points, 0, {x: this.firstPoint.x, y: this.firstPoint.y})
                this.$eh.$emit('translate', {x: _x, y: _y}) 
            } else {
                this.context.clearRect(0, 0, window.innerWidth, window.innerHeight)
                this.mousePos = {x: _x, y: _y}
            }
        },
        upEvt() {
            // Clear the canvas.
            this.points = []
            this.md = false
            this.middle = false
            this.$eh.$emit('set') 

            this.context.clearRect(0,0,this.canvas.width, this.canvas.height)
        },

        sizeCanvas() {
            let _can = this.canvas

            let _w = window.innerWidth
            let _h = window.innerHeight

            _can.width = _w
            _can.height = _h
        },

        draw() {
            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)

            if(this.md){
                this.drawRotation()
                this.drawAngles()
                this.drawPoints()
                if(this.hyp > this.rotOffset){
                    this.drawText()
                }

            } else {
                this.drawMouse()
            }
        },

        drawMouse() {
            let _ctx = this.context

            _ctx.strokeStyle = "#000"
            _ctx.beginPath()
            _ctx.arc(this.mousePos.x, this.mousePos.y, 20, 0, Math.PI * 2)
            _ctx.stroke()
            _ctx.closePath()
        },
        drawText(){
            let _ctx = this.context
            let _yoffset = 0

            _ctx.font = '12px sans-serif'
            _ctx.fillText("Y: " + this.yDiff, (this.points[0].x + 10), this.points[0].y)

            if(this.points[1].y < this.points[0].y){
                _yoffset = 10
            } else {
                _yoffset = -10
            }

            if(this.points[1].x < this.points[0].x){
                _ctx.fillText("X: " + this.xDiff, this.points[0].x + 10, this.points[1].y - _yoffset)

                _ctx.beginPath()
                _ctx.moveTo(this.points[0].x, this.points[1].y)
                _ctx.lineTo(this.points[0].x, this.points[1].y-_yoffset)
                _ctx.lineTo(this.points[0].x + 5, this.points[1].y-_yoffset)
                _ctx.stroke()
                _ctx.closePath()
            } else {
                _ctx.fillText("X: " + this.xDiff, this.points[0].x - 45, this.points[1].y - _yoffset)

                _ctx.beginPath()
                _ctx.moveTo(this.points[0].x, this.points[1].y)
                _ctx.lineTo(this.points[0].x, this.points[1].y-_yoffset)
                _ctx.lineTo(this.points[0].x - 5, this.points[1].y-_yoffset)
                _ctx.stroke()
                _ctx.closePath()
            }

            // _ctx.fillText(Math.round(this.hyp), _midX, _midY - 25)
        },
        drawPoints() {
            let _ctx = this.context
            let colors = ["#FF0000", "#0000FF"]

            this.points.forEach((point, ind) => {
                _ctx.strokeStyle = colors[ind]
                // _ctx.fillText('(x: '+point.x+', y: '+point.y+')', point.x, point.y + 40)
                _ctx.beginPath()
                _ctx.arc(point.x, point.y, 20, 0, Math.PI * 2)
                _ctx.stroke()
                _ctx.closePath()
            })
        },
        drawRotation() {
            let _ctx = this.context
            let _x = this.points[1].x
            let _y = this.points[1].y
            let _offset = this.rotOffset
            let roter = 0

            //Draw InnerCircle
            if(this.hyp <= _offset){
                _ctx.lineWidth = 1
                _ctx.strokeStyle = "#000"

                _ctx.beginPath()
                _ctx.arc(_x, _y, _offset, 0, Math.PI * 2)
                _ctx.stroke()
                _ctx.closePath()
                this.firstAngle = 0
                this.secondAngle = 0
            } else {

                if(!this.firstAngle){
                    if(this.xDiff >= 0){
                        this.firstAngle = -1 * this.soh
                    } else {
                        this.firstAngle = Math.PI + this.soh
                    }
                }

                if(this.xDiff >= 0 && this.firstAngle){
                    this.secondAngle = -1 * this.soh
                } else {
                    this.secondAngle = Math.PI + this.soh
                }

                _ctx.lineWidth = 3
                _ctx.strokeStyle = "#000"

                //Draw InnerCircle
                _ctx.beginPath()

                roter = Math.round((this.secondAngle - this.firstAngle) * (180 / Math.PI))
                if(this.firstAngle < this.secondAngle && roter < 0){
                    _ctx.arc(_x, _y, _offset, this.firstAngle, this.secondAngle)
                } else {
                    _ctx.arc(_x, _y, _offset, this.secondAngle, this.firstAngle)
                }
                _ctx.stroke()
                _ctx.closePath()
            }


            this.$eh.$emit('rotater', roter) 
            _ctx.fillText(roter + "DEG", this.points[1].x + 40, this.points[1].y + 20)

            _ctx.lineWidth = 1
            /*
            //Draw OverCircle
            _ctx.beginPath()
            _ctx.arc(_midX, _midY, (this.hyp / 2), 0, (Math.PI * 2))
            _ctx.stroke()
            _ctx.closePath()
            */

            // Draw Ticks
            /*
            for(var i = 0; i <= 10; i ++) {
                _ctx.beginPath()
                _ctx.moveTo(_midX, _midY)
                _ctx.lineTo(_midX, _midY - 20)
                _ctx.stroke()
                _ctx.closePath()
            }
            */
        },
        drawTicks(type) {
            let _x = 0
            let _y = 0
            let _size = 3
            let _xsize = 0
            let _ysize = 0
            let _tickInt = 10
            let _max = 0
            let _ctx = this.context

            if(type === "x") {
                _y = this.points[1].y
                _max = Math.abs(this.xDiff)
                _ysize = _size
            } else if(type === "y") {
                _x = this.points[0].x
                _max = Math.abs(this.yDiff)
                _xsize = _size
            }

            for(var tick = 0; tick <= _max; tick += _tickInt){

                if(type === "x"){
                    if(this.points[0].y < this.points[1].y){
                        _ysize = _size
                    } else {
                        _ysize = -1*_size
                    }

                    if(this.points[1].x < this.points[0].x){
                        _x = tick + this.points[1].x
                    } else {
                        _x = tick + this.points[0].x
                    }
                }

                if(type === "y"){
                    if(this.points[1].x < this.points[0].x){
                        _xsize = _size
                    } else {
                        _xsize = 1 - _size
                    }

                    if(this.points[1].y < this.points[0].y){
                        _y = tick + this.points[1].y
                    } else {
                        _y = tick + this.points[0].y
                    }
                }

                _ctx.beginPath()
                _ctx.moveTo(_x, _y)
                _ctx.lineTo(_x + _xsize, _y + _ysize)
                _ctx.stroke()
                _ctx.closePath()
            }
        },
        drawAngles() {
            let _ctx = this.context

            this.drawTicks('x')
            this.drawTicks('y')

            _ctx.strokeStyle = "#000"
            // Draw the control triangle
            _ctx.beginPath()
            _ctx.moveTo(this.points[0].x, this.points[0].y)
            _ctx.lineTo(this.points[1].x, this.points[1].y)
            _ctx.lineTo(this.points[0].x, this.points[1].y)
            _ctx.lineTo(this.points[0].x, this.points[0].y)
            _ctx.stroke()
            _ctx.closePath()

            /*
            _ctx.beginPath()
            _ctx.moveTo(_midX, _midY)
            _ctx.lineTo(_midX, _midY - 20)
            _ctx.stroke()
            _ctx.closePath()
            */
        }
    }
}
</script>

<style>
    #FSPointer{
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0px;
        left: 0px;
        z-index: 9997;
    }
    #canvas{
        z-index: 9996;
        position: absolute;
        top: 0px;
        left: 0px;
        image-rendering: pixelated;
    }
</style>


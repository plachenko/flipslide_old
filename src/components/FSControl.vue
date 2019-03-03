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
        }
    },
    mounted(){
        this.canvas = this.$refs.canvas
        this.context = this.canvas.getContext('2d')

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
            return this.points[1].x - this.points[0].x
        },
        hyp: function() {
            //Hypotenuse
            let _ab = Math.pow(this.xDiff, 2) + Math.pow(this.yDiff,2)
            return Math.sqrt(_ab)
        },
        soh: function() {
            // Sin (Opposite / Hypotenuse)
            return Math.asin(this.yDiff / this.hyp) * (180 / Math.PI)
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

        dnEvt(e) {
            // Capture the pointer
            Vue.set(this.points, 0, {x: e.clientX, y: e.clientY})
            Vue.set(this.points, 1, {x: e.clientX, y: e.clientY})
        },
        mvEvt(e) {
            // If there is no pointer down, set mouse position
            if(this.points[0] && this.points[1]){
                Vue.set(this.points, 0, {x: e.clientX, y: e.clientY})
            } else {
                this.mousePos = {x: e.clientX, y: e.clientY}
            }
        },
        upEvt(e) {
            // Clear the canvas.
            this.points = []

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

            if(this.points.length >= 1){
                this.drawRotation()
                this.drawAngles()
                this.drawPoints()

                // this.$eh.$emit('rotater', this.soh) 
                // this.$eh.$emit('scaler', this.scaler) 
            } else {
                this.drawMouse()
            }
        },

        drawMouse() {
            let _ctx = this.context

            _ctx.strokeStyle = "#000"
            _ctx.beginPath()
            _ctx.arc(this.mousePos.x, this.mousePos.y, 50, 0, Math.PI * 2)
            _ctx.stroke()
            _ctx.closePath()
        },
        drawPoints() {
            let _ctx = this.context
            let colors = ["#FF0000", "#0000FF"]

            this.points.forEach((point, ind) => {
                _ctx.strokeStyle = colors[ind]
                _ctx.fillText(ind, point.x, point.y - 55)
                _ctx.beginPath()
                _ctx.arc(point.x, point.y, 50, 0, Math.PI * 2)
                _ctx.stroke()
                _ctx.closePath()
            })
        },

        drawRotation() {
            let _midX = (this.xDiff / 2) + this.points[0].x
            let _midY = (this.yDiff / 2) + this.points[0].y
            let _ctx = this.context

            _ctx.lineWidth = 1

            //Draw OverCircle
            _ctx.beginPath()
            _ctx.arc(_midX, _midY, (this.hyp / 2), 0, Math.PI *2)
            _ctx.stroke()
            _ctx.closePath()

            // Draw Ticks
            for(var i = 0; i <= 10; i ++) {
                _ctx.beginPath()
                _ctx.moveTo(_midX, _midY)
                _ctx.lineTo(_midX, _midY - 20)
                _ctx.stroke()
                _ctx.closePath()
            }
        },
        drawAngles() {
            let _midX = (this.xDiff / 2) + this.points[0].x
            let _midY = (this.yDiff / 2) + this.points[0].y
            let _ctx = this.context

            _ctx.font = '20px sans-serif'
            _ctx.fillText("y: " + this.yDiff, this.points[0].x, _midY + 20)
            _ctx.fillText("x: " + this.xDiff, _midX - 30, this.points[1].y)
            _ctx.fillText(this.hyp, _midX, _midY - 25)
            _ctx.fillText(this.soh, this.points[0].x, this.points[0].y)

            _ctx.strokeStyle = "#000"
            _ctx.lineWidth = 3
            // Draw the control triangle
            _ctx.beginPath()
            _ctx.moveTo(this.points[0].x, this.points[0].y)
            _ctx.lineTo(this.points[1].x, this.points[1].y)
            _ctx.lineTo(this.points[0].x, this.points[1].y)
            _ctx.lineTo(this.points[0].x, this.points[0].y)
            _ctx.stroke()
            _ctx.closePath()

            _ctx.beginPath()
            _ctx.moveTo(_midX, _midY)
            _ctx.lineTo(_midX, _midY - 20)
            _ctx.stroke()
            _ctx.closePath()
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
        z-index: 9999;
    }
    #canvas{
        z-index: 9998;
        position: absolute;
        top: 0px;
        left: 0px;
    }
</style>


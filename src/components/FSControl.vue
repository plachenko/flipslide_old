<template>
    <div>
        <div @pointerdown="dnEvt" @pointermove="mvEvt" @pointerup="upEvt" id="FSPointer" ref="capture" />
        <span style="position: absolute; right: 0px; z-index: 9999; top: 0px;">{{type}}</span>
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
            mdown: [
                false,
                false,
                false
            ],
            type: null
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
        midY: function() {
            // Mid Rise
            return (this.yDiff / 2) + this.points[0].x
        },
        xDiff: function() {
            // Run
            return this.points[1].x - this.points[0].x
        },
        midX: function() {
            // Mid Run
            return (this.xDiff / 2) + this.points[0].y
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
            /*
           let _pointIdx = this.points.length
           let _pointObj = {
               id: e.pointerId,
               type: e.which,
               x: e.clientX,
               y: e.clientY
            }

            Vue.set(this.points, _pointIdx, _pointObj)
            console.log(this.points)
            */

            // Vue.set(this.points, 0, {x: e.clientX, y: e.clientY})
            // Vue.set(this.points, 1, {x: e.clientX, y: e.clientY})

/*
            switch(e.which){
                case 1:
                    this.mdown[0] = true
                    Vue.set(this.points, 0, {x: e.clientX, y: e.clientY})
                    break
                case 2:
                    this.mdown[2] = true
                    Vue.set(this.points, 2, {x: e.clientX, y: e.clientY})
                    break
                case 3:
                    this.mdown[1] = true
                    Vue.set(this.points, 1, {x: e.clientX, y: e.clientY})
                    Vue.set(this.savePoints, 1, {x: e.clientX, y: e.clientY})
                    break
            }
            */
           this.type = e.which
        },
        mvEvt(e) {
            console.log(this.mouseArray)
            /*
            if(!this.points.length){
                this.mousePos = {x: e.clientX, y: e.clientY}
            }

            if(this.mdown[0] === true){
                Vue.set(this.points, 0, {x: e.clientX, y: e.clientY})
            }
            if(this.mdown[1] === true){
                Vue.set(this.points, 1, {x: e.clientX, y: e.clientY})
            }
            */

            // Vue.set(this.points, 0, {x: e.clientX, y: e.clientY})

            /*
            if(this.mdown[2] === true){
                let xOffset = e.clientX - this.points[2].x
                let yOffset = e.clientY - this.points[2].y

                // let _x1 = xOffset + this.points[0].x
                // let _y1 = yOffset + this.points[0].y
                // let _x2 = xOffset + this.points[1].x
                // let _y2 = yOffset + this.points[1].y

                // Vue.set(this.points, 0, {x: this.points[0].x += xOffset, y: this.points[0].y += yOffset})
                // Vue.set(this.points, 1, {x: this.points[1].x += xOffset, y: this.points[1].y += yOffset})
            }

            // console.log(this.mdown[0], this.mdown[1])

            if(this.mdown[0] === true && this.mdown[1] === true){
                Vue.set(this.points, 0, {x: e.clientX, y: e.clientY})
                Vue.set(this.points, 1, {x: e.clientX, y: e.clientY})
            }
            */
        },
        upEvt(e) {
            /*
            console.log(this.points)
            this.points.some((i,idx) => {
                this.points.splice(idx,1)
            })
            */
            switch(e.which){
                case 1:
                    this.mdown[0] = false
                    break
                case 2:
                    this.mdown[2] = false
                    break
                case 3:
                    this.mdown[1] = false
                    break
            }

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

            _ctx.beginPath()
            _ctx.arc(this.mousePos.x, this.mousePos.y, 50, 0, Math.PI * 2)
            _ctx.stroke()
            _ctx.closePath()
        },
        drawPoints() {
            let _ctx = this.context
            let colors = ["#FF0000", "#0000FF"]

            this.points.forEach((point, ind) => {
                console.log(point)
                _ctx.strokeStyle = colors[ind]
                _ctx.fillText(ind, point.x, point.y - 55)
                _ctx.beginPath()
                _ctx.arc(point.x, point.y, 50, 0, Math.PI * 2)
                _ctx.stroke()
                _ctx.closePath()
            })
        },

        drawRotation() {
            let _midX = this.midX
            let _midY = this.midY
            let _ctx = this.context

            //Draw OverCircle
            _ctx.beginPath()
            _ctx.arc(_midX, _midY, this.hyp, 0, Math.PI *2)
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
            let _midX = this.midX
            let _midY = this.midY
            let _ctx = this.context

            _ctx.font = '50px'
            _ctx.fillText(this.yDiff, this.points[0].x, _midY + 20)
            _ctx.fillText(this.xDiff, _midX - 30, this.points[1].y)
            _ctx.fillText(this.hyp, _midX, _midY - 25)
            _ctx.fillText(this.soh, this.points[0].x, this.points[0].y)

            // Draw the control triangle
            _ctx.beginPath()
            _ctx.moveTo(this.points[0].x, this.points[0].y)
            _ctx.lineTo(this.points[1].x, this.points[1].y)
            _ctx.lineTo(this.points[0].x, this.points[1].y)
            _ctx.lineTo(this.points[1].x, this.points[1].y)
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


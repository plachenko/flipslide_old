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
            points: [],
            savePoints: [],
            mdown: [
                false,
                false,
                false
            ]
        }
    },
    mounted(){
        this.canvas = this.$refs.canvas
        this.context = this.canvas.getContext('2d')
        // this.points.push({x: 100, y:100})

        this.sizeCanvas()

        window.addEventListener('contextmenu', this.contextEvt)
        window.addEventListener('resize', this.resizeEvt)

    },
    watch: {
        points: {
            handler: function(){
                this.draw()
            },
            deep: true
        }
    },
    methods: {
        resizeEvt() {
            this.sizeCanvas()
        },
        contextEvt(e) {
            e.preventDefault();
        },

        dnEvt(e) {
            switch(e.which){
                case 1:
                    this.mdown[0] = true
                    Vue.set(this.points, 0, {x: e.clientX, y: e.clientY})
                    Vue.set(this.savePoints, 0, {x: e.clientX, y: e.clientY})
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
        },
        mvEvt(e) {
            if(this.mdown[0] === true){
                Vue.set(this.points, 0, {x: e.clientX, y: e.clientY})
            }
            if(this.mdown[1] === true){
                Vue.set(this.points, 1, {x: e.clientX, y: e.clientY})
            }

            if(this.mdown[2] === true){
                let xOffset = e.clientX - this.points[2].x
                let yOffset = e.clientY - this.points[2].y

                console.log('moving...')

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
        },
        upEvt(e) {
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
            let _can = this.canvas
            let _ctx = this.context

            _ctx.clearRect(0, 0, _can.width, _can.height)
            let colors = ['#FF0000', '#0000FF']

            let xDiff = 0 
            let yDiff = 0 
            let cDiff = 0

            // SOHCAHTOA

            if(this.points.length > 1 && this.points[0] !== undefined){

                xDiff = this.points[1].x - this.points[0].x
                yDiff = this.points[1].y - this.points[0].y
                cDiff = Math.pow(xDiff, 2) + Math.pow(yDiff,2)

                let _midX = (xDiff / 2) + this.points[0].x 
                let _midY = (yDiff / 2) + this.points[0].y 

                _ctx.strokeStyle = "#000"

                // Draw angles
                _ctx.fillText(yDiff+"", this.points[0].x, _midY + 20)
                _ctx.fillText(xDiff+"", _midX - 30, this.points[1].y)

                _ctx.beginPath()
                _ctx.moveTo(this.points[0].x, this.points[0].y)
                _ctx.lineTo(this.points[0].x, this.points[1].y)
                _ctx.lineTo(this.points[1].x, this.points[1].y)
                _ctx.stroke()
                _ctx.closePath()

                // Draw Midpoint
                _ctx.fillText(Math.round(Math.sqrt(cDiff))+"", _midX, _midY - 25)

                _ctx.beginPath()
                _ctx.moveTo(_midX, _midY)
                _ctx.lineTo(_midX, _midY - 20)
                _ctx.stroke()
                _ctx.closePath()

                //Draw OverCircle
                _ctx.beginPath()
                _ctx.arc(_midX, _midY, Math.sqrt(cDiff)/2, 0, Math.PI *2)
                _ctx.stroke()
                _ctx.closePath()

                for(var i = 0; i <= 10; i ++) {
                    let _x1 = 
                    _ctx.beginPath()
                    _ctx.moveTo(_midX, _midY)
                    _ctx.lineTo(_midX, _midY - 20)
                    _ctx.stroke()
                    _ctx.closePath()
                }

                //Draw line
                _ctx.beginPath()
                _ctx.moveTo(this.points[0].x, this.points[0].y)
                _ctx.lineTo(this.points[1].x, this.points[1].y)
                _ctx.stroke()
                _ctx.closePath()

            }

            /*
            this.savePoints.forEach((point, ind) => {
                _ctx.strokeStyle = colors[ind]
                _ctx.beginPath()
                _ctx.arc(point.x, point.y, 20, 0, Math.PI * 2)
                _ctx.stroke()
                _ctx.closePath()
            })
            */

            this.points.forEach((point, ind) => {
                _ctx.strokeStyle = colors[ind]
                _ctx.fillText(ind+"", point.x, point.y - 55)
                _ctx.beginPath()
                _ctx.arc(point.x, point.y, 50, 0, Math.PI * 2)
                _ctx.stroke()
                _ctx.closePath()
            })

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


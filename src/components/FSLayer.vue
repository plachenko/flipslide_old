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

        this.$eh.$on('mousePos', this.draw)
        this.$eh.$on('brush', this.brushChange)
        this.$eh.$on('mouseUp', this.drawDone)
        this.$eh.$on('brushEvt', this.brushEvt)
        // this.$eh.$emit('imageSet', {'idx':this.layerObj.idx, 'data':this.can.toDataURL()})
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
                x: e.x * this.$eh.scale, y: e.y * this.$eh.scale
            } 
            console.log(e.x)
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
            this.ctx.fillRect(e.x, e.y, this.size.w, this.size.h)
        },
        eraser(e){
            this.ctx.clearRect(e.x, e.y, this.size.w, this.size.h)
        },
        drawDone(){
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
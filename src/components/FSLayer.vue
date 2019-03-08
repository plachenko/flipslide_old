<template>
    <div id="canContainer">
       <div style="position: absolute; bottom: 100px;">{{JSON.stringify(layerObj)}}</div>
       <canvas ref='can' style="opacity: 1"></canvas> 
    </div>
</template>
<script>
export default {
    name: 'FSLayer',
    data(){
        return{
            ctx: null,
            can: null
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
        this._simpleFill()
        // this._denseFill()
        // --TESTING

        this.$eh.$emit('imageSet', {'idx':this.layerObj.idx, 'data':this.can.toDataURL()})
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
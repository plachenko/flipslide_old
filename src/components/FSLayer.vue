<template>
    <div id="canContainer">
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
        index: Number
    },
    mounted(){
        this.can = this.$refs.can
        this.can.width = this.width
        this.can.height = this.height

        this.ctx = this.can.getContext('2d')
        let _col = ""

        for(var i = 0; i< this.width/3; i++){
            for(var j = 0; j< this.height/3; j++){
                _col = "rgb("+ 
                    Math.round(Math.random()*255) + "," + 
                    Math.round(Math.random()*255) + "," + 
                    Math.round(Math.random()*255) 
                +")"
                this.ctx.fillStyle = _col
                this.ctx.fillRect(i * 3, j * 3, 3,3)
            }
        }

        let _x = Math.round(Math.random()*100)
        let _y = Math.round(Math.random()*100)
        // this.ctx.fillRect(0, 0, this.can.width, this.can.height)
        this.$eh.$emit('imageSet', {'idx':this.index, 'data':this.can.toDataURL()})
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
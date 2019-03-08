<template>
    <div>
        <div @pointerdown="dnEvt" @pointermove="mvEvt" @pointerup="upEvt" id="FSPointer" ref="capture" />
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
            firstPoint: {x: 0, y: 0}
        }
    },
    mounted(){
        console.log('mounted!')
    },
    methods: {

        dnEvt(e){
            this.mousePos = {x: e.clientX, y: e.clientY}
            this.$eh.$emit('mousePos', this.mousePos)
            this.md = true
        },
        mvEvt(e){
            if(this.md){
                this.mousePos = {x: e.clientX, y: e.clientY}
                this.$eh.$emit('mousePos', this.mousePos)
            }
        },
        upEvt(e){
            this.md = false
            this.$eh.$emit('mouseUp', this.mousePos)
        }
    }
}
</script>
<style>
#fspointer {
    width: 100%;
    height: 100%;
    position: absolute;
    z-index: 9999;
    background-color: #F00
}

</style>

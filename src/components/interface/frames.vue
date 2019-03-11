<template>
  <div id="frame_container" ref="frame">
    <span>Current Frame: {{$eh.curFrame}}</span>
    <div @click="next" class="actionBtn">prev</div>
    <div @click="prev" class="actionBtn">next</div>
  </div>
</template>
<script>
export default {
  name: 'frames',
  props: {
    curFrame: Number
  },
  mounted(){

  },
  data(){
    return{

    }
  },
  methods: {
    next(){
      this.$eh.$emit('next')
    },
    prev(){
      this.$eh.$emit('prev')
    }
  }
}
</script>
<style>
.actionBtn{
  float: left;
}
#frame_container{
  background-color:#F00;
  height: 100px;
  width: 300px;
  position: absolute;
  bottom: 0px;
  right: 100px;
  z-index: 9999;
}
</style>

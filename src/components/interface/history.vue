<template>
  <div id="actionBar">
    <div @click="undo" class="actionBtn">undo</div>
    <div @click="redo" class="actionBtn">redo</div>
  </div>
</template>
<script>
export default {
  name: 'history',
  data(){
    return {
      actionIdx: 0,
      lastIdx: 0
    }
  },
  mounted() {
    this.$eh.$on('actions', this.actions)
  },
  methods: {
    actions(e){
      this.actionIdx = e.length
    },
    undo(){
      if(this.actionIdx > 0){
        this.$eh.$emit('undo')
        this.actionIdx --
      }
    },
    redo(){
      this.$eh.$emit('redo')
      this.actionIdx ++
    }
  }
}
</script>
<style>
#actionBar{
  position: absolute;
  bottom: 0px;
  right: 10px;
  height: 200px;
  user-select: none;
  float: left;
  background-color: #F00;
  z-index: 9999
}
.actionBtn{
  padding: 20px;
  cursor: pointer;
  background-color:#FFF;
  margin: 30px;
}
</style>


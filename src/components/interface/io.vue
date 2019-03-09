<template>
  <div id="ioMenu">
    <div @click="open">Open</div>

    <form action="#" ref="fileInp">
    </form>
    <input @change="fileChange" id="file" type="file" ref="file" />

    <div @click="save">Save</div>
  </div>
</template>
<script>
export default {
  name: 'io',
  data() {
    return{
      file: null
    }
  },
  methods: {
    open(){
      this.$refs.file.click()
    },
    save(){
      this.$emit('saveFile')
    },
    fileChange(e){
      this.$emit('openFile', e.target.files[0])
    }
  }
}
</script>
<style>
#file{
  display: none;
}
#ioMenu{
  position: absolute;
  z-index: 9999;
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100px;
  height: 100px;
  background-color: #F00;
}
</style>

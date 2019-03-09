<template>
  <div id="ioMenu">
    <div @click="open">Open</div>

    <form action="#" ref="fileInp">
    </form>
    <input id="file" type="file" ref="file" />

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
  watch: {
    file(e){
      console.log(e)
    }
  },
  methods: {
    open(){
      let _inputF = this.$refs.fileInp
      let _input = this.$refs.file
      let _img

      _input.click()
      this.file = _input.files[0]
      window.setTimeout(()=>{
        console.log(_img)
      }, 3000)
    },
    save(){

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

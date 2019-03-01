<!-- FlipSlide BOOK -->
<!--
  A BOOK is a unit stored in a COLLECTION

  TAKES:


  Has:
  - INT Width: width | Window Width
  - INT Height: height | Window Height
  - INT Current Page: page | 0
  + ARR Pages: An array of Pages

-->

<template>
  <div>
    <fscursor id="cursor" :bookSize="size" ref="cursor_container" v-on:strokeEvt="strokeEvt" />
    <fspage :bookSize="size" />
  </div>
</template>

<script>
import FSPage from './FS_Page.vue'
import FSCursor from './FS_Cursor.vue'

export default {
  name: 'FSBook',
  components: {
    fscursor: FSCursor,
    fspage: FSPage
  },
  data: function(){

    var w = window.innerWidth
    var h = window.innerHeight

    return{
      size:{
        width: w,
        height: h
      }
    }

  },
  methods: {
    strokeEvt(e){
      console.log(e)
    }
  },
}
</script>

<style lang="">

</style>

<template>
  <div>
    <v-layout class="interface" row>
      <v-flex xs4>
        <v-btn @click="brushShow = !brushShow">Brush</v-btn>
        <v-btn @click="colorShow = !colorShow">Color</v-btn>
        <v-btn @click="layerShow = !layerShow">Layers</v-btn>

        <!-- Lock -->
        <v-spacer />
        <v-btn @click="lock = !lock;">
          <span v-if="lock">lock</span>
          <span v-else>unlock</span>
          <!-- <v-icon v-if="lock">lock</v-icon>
          <v-icon v-else>lock_open</v-icon> -->
        </v-btn>

      </v-flex>
      <v-flex xs8 id="interfaceItems">
        <brushblock v-show="brushShow" ref="colblk" />
        <colorblock v-show="colorShow" ref="colblk" />
        <layer v-show="layerShow" />
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import Layer from './Layer'
import colorBlock from './ColorBlock'
import brushBlock from './BrushBlock'

export default {
  components:{
    layer: Layer,
    colorblock: colorBlock,
    brushblock: brushBlock
  },
  data() {
    return{
      lock: false,
      colorShow: false,
      layerShow: false,
      brushShow: false
    }
  },
  mounted() {
    this.$eventHub.col = this.$refs.colblk
  }
}
</script>

<style>
#interfaceItems > div{
  float: left;
  margin: 0px 5px;
  position: relative;
}

.interface {
  float:left;
  z-index: 9998;
  position: relative;
}
</style>

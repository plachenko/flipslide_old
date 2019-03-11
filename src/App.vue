<template>
  <div id="app" onresize="resizer()">
    <div id="topContainer">
      <div class="btn" @click="visible.io = !visible.io">File</div>
      <div class="btn" @click="visible.control = !visible.control; center">Control</div>
      <div class="btn" @click="sizeLeft">Brush</div>
      <div class="btn" @click="sizeRight">Layers</div>
    </div>
    <FSMouseCap v-show="!visible.control" />
    <FSControl v-show="visible.control" />

    <div class="menu left" ref="left_menu" v-show="visible.brush">
      <brush />
    </div>
    <div class="menu right" ref="right_menu" v-show="visible.layers" id="layer_menu">
      <layer @changeLayer="changeLayer" />
    </div>

    <frames :curFrame="$eh.curFrame" />

    <io v-show="visible.io" @openFile="openFile" @saveFile="saveFile" />
    <history v-show="visible.io" />

    <div ref="can" :style="{transform: 'translate('+translate.x1+'px,'+translate.y1+'px) rotate('+rotation+'deg'+') scale('+scale+')'}" id="canvas-container">
      <div v-show="!visible.control">
        <FSLayer
          ref="inner_can"
          v-show="!visible.control"
          :width="width"
          :height="height"
          v-for="(layer,idx) in layers" :layerObj="layer"
          :key="idx"
          :style="{zIndex: layer.zPosition}" />
      </div>
      <img v-show="visible.control" v-if="layers[layers.length-1]" :src="layers[layers.length-1].data" alt="">
    </div>
    <div id="control_center" @click="center" v-show="visible.control">center</div>
  </div>
</template>

<script>
import FSControl from './components/FSControl'
import layer from './components/interface/layer'
import frames from './components/interface/frames'
import brush from './components/interface/brush'
import history from './components/interface/history'
import io from './components/interface/io'

import FSLayer from './components/FSLayer'
import FSMouseCap from './components/FSMouseCap'

export default {
  name: 'app',
  components: {
    FSControl,
    FSLayer,
    FSMouseCap,
    layer,
    frames,
    brush,
    history,
    io
  },
  mounted(){
    this.canvas_container = this.$refs.can

    this.sizeCanvas()
    this.centerCanvas()

    window.addEventListener('resize', this.resizeEvt)

    this.$eh.$on('set', () => {
      this.translate.x2 = -1 * this.translate.x1
      this.translate.y2 = -1 * this.translate.y1

      this.setRotate = this.rotation

      this.setScale = this.scale
    })

    this.$eh.$on('translate', (e) => {
      this.translate.x1 = (e.x - this.translate.x2)
      this.translate.y1 = (e.y - this.translate.y2)
    })

    this.$eh.$on('rotater', (e) => {
      this.rotation = (this.setRotate + e)
    })

    this.$eh.$on('scaler', (e) => {
      if(e > 1){
        this.scale = e + (this.setScale - 1)
      } else if(e === 0) {
        this.scale = this.setScale
      } else {
        if(this.scale > .1){
          this.scale = this.setScale - (1 - e)
        }
      }
      this.$eh.scale = this.scale
    })
  },
  data() {
    return{
      canvas_container: null,
      width: 0,
      height: 0,
      scale: 1,
      margin: 0,
      layers: [],
      translate: {
        x1: 0,
        y1: 0,
        x2: 0,
        y2: 0
      },
      setScale: 1,
      visible: {
        control: false,
        layers: true,
        brush: true,
        io: false
      },
      temp_scale: 0,
      setRotate: 0,
      rotation: 0,
    }
  },
  methods: {
    openFile(e){
      var _img = new Image()
      var _ctx = this.$refs.inner_can[0].ctx
      var reader = new FileReader()

      reader.readAsDataURL(e)
      reader.addEventListener('load', (ev)=>{
        _img.src = ev.target.result
      })

      _img.onload = (e) => {
        _ctx.drawImage(_img,_img.width,_img.height)
      }
    },
    saveFile(){
      let _can = this.$refs.inner_can[0].can
      let _img = _can.toDataURL("image/png").replace("image/png", "image/octet-stream")

      window.location.href = _img
    },
    resizeEvt () {
      this.centerCanvas()
      this.sizeMenus()
    },
    sizeMenus(){
      if(this.$refs.left_menu.style.display !== "none"){
        this.sizeLeft()
      }

      if(this.$refs.right_menu.style.display !== "none"){
        this.sizeRight()
      }
    },
    sizeRight(){
      this.visible.layers = !this.visible.layers
      if(this.$refs.right_menu.style.display !== "none"){
        let margin = this.margin
        let _h = window.innerHeight - margin
        let _right = this.$refs.right_menu

        _right.style.top = (_h / 2) - (_right.clientHeight / 2) + "px"
      }
    },
    sizeLeft(){
      this.visible.brush = !this.visible.brush
      if(this.$refs.left_menu.style.display !== "none"){
        let margin = this.margin
        let _h = window.innerHeight - margin
        let _left = this.$refs.left_menu

        _left.style.top = (_h / 2) - (_left.clientHeight / 2) + "px"
      }
    },
    sizeCanvas(){
      let _can = this.canvas_container

      let margin = this.margin
      let _w = window.innerWidth - margin
      let _h = window.innerHeight - margin

      this.width = _w
      this.height = _h

      _can.style.width = _w + "px"
      _can.style.height = _h + "px"

      this.sizeMenus()
    },
    centerCanvas(){
      let _can = this.canvas_container
      let _w = (window.innerWidth/2) - (_can.clientWidth / 2)
      let _h = (window.innerHeight/2) - (_can.clientHeight / 2)

      _can.style.left = _w + "px"
      _can.style.top = _h + "px"
    },
    changeLayer(e){
      this.layers = e
    },
    center(){
      this.setRotate = 0;
      this.rotation = 0;
      this.scale = 1;
      this.setScale = 1
      this.translate= {
        x1: 0,
        x2: 0,
        y1: 0,
        y2: 0
      };
      this.$eh.scale = this.scale
    }
  }
}
</script>
<style>
html{
  touch-action: none;
  overflow: hidden;
  }
  body{
    margin: 0px;
    background-color: #AAA;
    padding: 0px;
    }

#app{
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  }

#topContainer{
  margin: 0px auto;
  width: 500px;
  height: 40px;
  }
  #topContainer .btn{
    box-sizing: border-box;
    user-select: none;
    cursor: pointer;
    position: relative;
    float: left;
    background-color:#FFF;

    z-index: 9999;
    min-width:100px;
    height: 100%;
    padding:10px;

    font-weight: bold;
    text-align: center;

    border: 1px solid;
    border-left: 1px dashed;
    border-right: none;
    border-top: 0px;
    }
    #topContainer .btn:first-child{
      border-radius: 0px 0px 0px 20px;
      border-right: 0px;
      border-left: 1px solid;
      }
    #topContainer .btn:last-child{
      border-radius: 0px 0px 20px 0px;
      border-right: 1px solid;
      }

#canvas-container{
  position: absolute;
  top: 0px;
  left: 0px;
  background-color: #FFF;
  box-shadow: #444 0px 0px 4px
  }

.menu{
  position: absolute;
  top: 0px;
  background-color: #F00;
  z-index: 9999;
  padding: 10px;
  box-sizing: border-box;
  border-radius: 0px 10px 10px 0px;
  min-height: 100px;
  width: 60px;
  }
  .right {
    width: 150px;
    border-radius: 10px 0px 0px 10px;
    height: 400px;
    right: 0px;
    overflow: auto;
    }

#control_center {
  border-radius: 10px;
  background-color: #fff;
  border: 1px solid;
  position: absolute;
  bottom: 20px;
  left: 20px;
  z-index: 9999;
  cursor: pointer;
  padding: 20px;
}

</style>

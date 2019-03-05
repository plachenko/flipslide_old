<template>
  <div id="app" onresize="resizer()">
    <div id="topContainer">
      <div class="btn" @click="visible.control = !visible.control">File</div>
      <div class="btn" @click="visible.control = !visible.control">Control</div>
      <div class="btn">Layers</div>
      <div class="btn" @click="visible.control = !visible.control">Colors</div>
    </div>
    <FSControl v-show="visible.control" />

    <div class="menu left" ref="left_menu"></div>
    <div class="menu right" ref="right_menu" id="layer_menu">
      <div class="item_container">
        <draggable
          :list="layers"
          :disabled="!enabled"
          class="list-group"
          @start="dragging = true"
          @end="dragging = false" >
            <div class="layer_item" v-for="(layer, idx) in layers" :key="idx">
              <span v-if="layer.name">{{layer.name}}</span>
            </div>
            <button slot="header" @click="addLayer">Add</button>
        </draggable>
      </div>
    </div>
    <div ref="can" :style="{transform: 'rotate('+rotation+'deg'+') scale('+scale+')'}" id="canvas-container">
      <!--
      <div class="handle tb" v-for="(i, idx) in 2" :key="idx" :style="{ }"></div>
      <div class="handle rl" style="top: -30px;"></div>

      <div class="handle corner" style="left: -30px; top: -30px;"></div>
      <div class="handle corner" style="right: -30px; top: -30px;"></div>
      <div class="handle corner" style="left: -30px; bottom: -30px;"></div>
      <div class="handle corner" style="right: -30px; bottom: -30px;"></div>
      -->
    </div>
  </div>
</template>

<script>
import FSControl from './components/FSControl'
import draggable from 'vuedraggable'

export default {
  name: 'app',
  components: {
    draggable,
    FSControl: FSControl
  },
  mounted(){
    this.canvas_container = this.$refs.can

    this.sizeCanvas()
    this.centerCanvas()

    window.addEventListener('resize', this.resizeEvt)
    this.$eh.$on('set', () => {
    })

    this.$eh.$on('rotater', (e)=>{
      this.rotation = e

    })

    this.$eh.$on('scaler', (e)=>{
      this.scale = e
      /*
      if(e > 1){
        this.scale += e
        console.log('zoom in!')
      } else {
        this.scale += 1 - e
        console.log('zoomOut')
      }
      /*
      if(e < 1){
      } else {
        this.scale -= e
      }
      */
    })
  },
  data() {
    return{
      canvas_container: null,
      width: 0,
      scale: 1,
      visible: {
        control: false
      },
      temp_scale: 0,
      rotation: 0,
      enabled: true,
      layers: [
        { name: "Background" },
      ],
      dragging: false
    }
  },
  methods: {
    resizeEvt () {
      this.centerCanvas()
      this.sizeLeft()
      this.sizeRight()
    },
    addLayer(){
      this.layers.push({name: 'layer'})
      this.sizeRight()
    },
    sizeRight(){
      let margin = 30
      let _left = this.$refs.left_menu
      let _w = window.innerWidth - margin
      let _h = window.innerHeight - margin
      
      _left.style.top = (_h / 2) - (_left.clientHeight / 2) + "px"
    },
    sizeLeft(){
      let margin = 30
      let _right = this.$refs.right_menu
      let _w = window.innerWidth - margin
      let _h = window.innerHeight - margin

      _right.style.top = (_h / 2) - (_right.clientHeight / 2) + "px"
    },
    sizeCanvas(){
      let _can = this.canvas_container

      let margin = 90
      let _w = window.innerWidth - margin
      let _h = window.innerHeight - margin

      this.width = _w

      _can.style.width = _w + "px"
      _can.style.height = _h + "px"

      this.sizeLeft()
      this.sizeRight()
    },
    centerCanvas(){
      let _can = this.canvas_container
      let _w = (window.innerWidth/2) - (_can.clientWidth / 2)
      let _h = (window.innerHeight/2) - (_can.clientHeight / 2)

      _can.style.left = _w + "px"
      _can.style.top = _h + "px"
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

#topContainer {
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

#canvas-container {
  position: absolute;
  top: 0px;
  left: 0px;
  background-color: #FFF;
  box-shadow: #444 2px 2px 3px
}

.menu{
  position: absolute;
  top: 0px;
  background-color: #F00;
  width: 150px;
  z-index: 9999;
  padding: 10px;
  box-sizing: border-box;
}
.left {
  border-radius: 0px 10px 10px 0px;
  left: 0px;
  height: 200px;
  width: 60px;
}

.item{
  background-color: #FFF;
  padding: 10px;
  margin: 10px 0px;
}

.right {
  border-radius: 10px 0px 0px 10px;
  right: 0px;
  overflow: auto;
}

.right .item_container{
  overflow: auto;
  min-height: 200px;
  max-height: 300px;
}
#layer_menu .layer_item {
  min-height: 100px;
  width: 100%;
  background-color: #FFF;
}
#layer_menu .item:last-child {
  border-bottom: none;
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
.handle {
  position: absolute; 
  background-color:#F00;
}
.corner {
  width: 20px; 
  height: 20px;
}
.tb{
height: 100%; width: 20px;
}
.rl{
  width: 100%; 
  height: 20px;
}

</style>

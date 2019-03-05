<template>
  <div id="app" onresize="resizer()">
    <!--
    <div id="topContainer">
      <div class="btn" style="">Layers</div>
    </div>
    -->
    <FSControl />

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
    <!-- <div ref="can" :style="{transform: 'matrix('+scale+','+rotation+','+(-1*rotation)+','+scale+',0,0)'}" id="canvas-container"> -->
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

    setInterval(() => {
      // this.scale -= Math.sin()
      // this.rotation += 1
    }, 1000)

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

      let margin = 30
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
  width: 600px; 
  height: 50px;
}
#topContainer .btn{
  background-color: #F00; 
  height: 100%; 
  text-align: center; 
  padding:15px; 
  box-sizing: border-box; 
  float: left; 
  min-width:100px; 
  border-radius: 0px 0px 0px 10px
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

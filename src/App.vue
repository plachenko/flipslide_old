<template>
  <div id="app" onresize="resizer()">
    <div id="topContainer">
      <div class="btn">File</div>
      <div class="btn" @click="visible.control = !visible.control">Control</div>
      <div class="btn" @click="visible.brush = !visible.brush">Brush</div>
      <div class="btn" @click="visible.layers = !visible.layers">Layers</div>
    </div>
    <FSControl v-show="visible.control" />

    <div class="menu left" ref="left_menu" v-show="visible.brush"></div>
    <div class="menu right" ref="right_menu" v-show="visible.layers" id="layer_menu">
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
    <div ref="can" :style="{transform: 'translate('+translate.x1+'px,'+translate.y1+'px) rotate('+rotation+'deg'+') scale('+scale+')'}" id="canvas-container">
      <!--
      <div class="handle tb" v-for="(i, idx) in 2" :key="idx" :style="{ }"></div>
      <div class="handle rl" style="top: -30px;"></div>

      <div class="handle corner" style="left: -30px; top: -30px;"></div>
      <div class="handle corner" style="right: -30px; top: -30px;"></div>
      <div class="handle corner" style="left: -30px; bottom: -30px;"></div>
      <div class="handle corner" style="right: -30px; bottom: -30px;"></div>
      -->
    </div>
    <div id="control_center" @click="center" v-show="visible.control">center</div>
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
      this.translate.x2 = -1 * this.translate.x1
      this.translate.y2 = -1 * this.translate.y1

      this.setRotate = this.rotation

      this.setScale = this.scale
    })

    this.$eh.$on('translate', (e)=>{
      this.translate.x1 = (e.x - this.translate.x2)
      this.translate.y1 = (e.y - this.translate.y2)
    })

    this.$eh.$on('rotater', (e)=>{
      this.rotation = (this.setRotate + e)
    })

    this.$eh.$on('scaler', (e)=>{
      if(e > 1){
        this.scale = e + (this.setScale - 1)
      } else if(e === 0) {
        this.scale = this.setScale
      } else {
        if(this.scale > .1){
          this.scale = this.setScale - (1 - e)
        }
      }
    })
  },
  data() {
    return{
      canvas_container: null,
      width: 0,
      scale: 1,
      margin: 0,
      translate: {
        x1: 0,
        y1: 0,
        x2: 0,
        y2: 0
      },
      setScale: 1,
      visible: {
        control: true,
        layers: false,
        brush: false
      },
      temp_scale: 0,
      setRotate: 0,
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
      let margin = this.margin
      let _left = this.$refs.left_menu
      let _w = window.innerWidth - margin
      let _h = window.innerHeight - margin
      
      _left.style.top = (_h / 2) - (_left.clientHeight / 2) + "px"
    },
    sizeLeft(){
      let margin = this.margin
      let _right = this.$refs.right_menu
      let _w = window.innerWidth - margin
      let _h = window.innerHeight - margin

      _right.style.top = (_h / 2) - (_right.clientHeight / 2) + "px"
    },
    sizeCanvas(){
      let _can = this.canvas_container

      let margin = this.margin
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
  box-shadow: #444 0px 0px 4px
}

.menu{
  position: absolute;
  top: 0px;
  background-color: #F00;
  width: 150px;
  z-index: 9999;
  padding: 10px;
  box-sizing: border-box;
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

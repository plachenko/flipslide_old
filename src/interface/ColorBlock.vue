<template>
  <div style="width: 300px;">
    <v-card style="max-height: 450px; overflow: auto">
      <canvas ref="color_can1" />
      <canvas ref="color_can2" />
      <div class="colorPrev">
        <v-responsive :style="{ background: `rgba(${red}, ${green}, ${blue}, ${alpha})` }"  height="20"></v-responsive>
      </div>
      <v-card-text class="pa-0">
        <v-container fluid grid-list-lg>

          <v-layout row wrap>
            <v-flex xs9>
              <v-slider v-model="red" :max="255" label="red" />
            </v-flex>
            <v-flex xs3>
              <v-text-field v-model="red" class="mt-0" type="number" />
            </v-flex>

            <v-flex xs9>
              <v-slider v-model="green" :max="255" label="green" />
            </v-flex>
            <v-flex xs3>
              <v-text-field v-model="green" class="mt-0" type="number" />
            </v-flex>

            <v-flex xs9>
              <v-slider v-model="blue" :max="255" label="blue" />
            </v-flex>
            <v-flex xs3>
              <v-text-field v-model="blue" class="mt-0" type="number" />
            </v-flex>

            <v-flex xs9>
              <v-slider v-model="alpha" step=".01" :max="1" label="alpha" />
            </v-flex>
            <v-flex xs3>
              <v-text-field v-model="alpha" class="mt-0" type="number" />
            </v-flex>

            <v-flex xs12>
              <v-text-field v-model="colorstitleArray[colorsIdx].title"></v-text-field>
            </v-flex>
            <v-flex xs8>
              <v-select :items="colorstitleArray" solo v-model="colorsIdx" item-text="title" item-value="val" box></v-select>
            </v-flex>
            <v-flex xs4>
              <v-btn block @click="addPallette">+</v-btn>
              <v-btn block :disabled="colorsArray.length-1 < 1" @click="removePallette">-</v-btn>
            </v-flex>

            <v-btn block :disabled="checkColors()" @click="addColor">Add</v-btn>
            <v-btn block :disabled="!checkColors()" @click="remColor">Rem</v-btn>

            <v-flex xs12>
              <v-btn block @click="random()">Random</v-btn>
            </v-flex>

            <v-flex xs12>
              <v-btn block @click="pickColor()">Picker</v-btn>
            </v-flex>

            <v-flex xs12>
              <div class="palletteCont" ref="colorPallette">
                <div class="colorblock"  v-for="(col, idx) in colorsArray[colorsIdx]" :class="checkColor(idx) ? 'currentColor' : ''" :key="idx">
                  <div
                    class="colorItem"
                    @click = "setColor(col[0], col[1], col[2], col[3])"
                    :style="{ backgroundColor: getRGBA(col[0], col[1], col[2], col[3]) }"
                      />
                </div>
              </div>
            </v-flex>
          </v-layout>

        </v-container>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
export default {

  name: "colorblock",

  data () {
    return {
      red: 0,
      green: 0,
      blue: 0,
      alpha: 1,
      colorArray: [],
      colorsIdx: 0,
      colorsArray: [[]],
      colorstitleArray: [{title: 'pallette 1', val: 0}]
    }
  },

  mounted() {
    /*
    var can = this.$refs.color_can
        can.height = 255
        can.width = 255
    var ctx = can.getContext('2d')

    for(var x = 0; x < 255; x++){
      for(var y = 0; y < 255; y++){
        var r = x * 255
        ctx.fillStyle = "rgb(" + r + "," + x + "," + x + ")"
        ctx.fillRect(x, y, 1, 1)
      }

    */
  },

  watch: {
    red(){
      this.$eventHub.$emit('colorChange', this.getColor())
    },
    green(){
      this.$eventHub.$emit('colorChange', this.getColor())
    },
    blue(){
      this.$eventHub.$emit('colorChange', this.getColor())
    },
    alpha(){
      this.$eventHub.$emit('colorChange', this.getColor())
    }
  },

  methods: {

    pickColor() {
      console.log('picking...')
    },

    addColor() {
      var colorDiv = this.$refs.colorPallette
      this.colorsArray[this.colorsIdx].push([this.red, this.green, this.blue, this.alpha])

      colorDiv.scrollTop = colorDiv.scrollHeight
    },

    addPallette() {
      this.colorsArray.push([])
      this.colorstitleArray.push({title: 'pallette '+(this.colorsArray.length), val: this.colorsArray.length-1})
      this.colorsIdx = this.colorsArray.length-1
    },

    removePallette() {
      this.colorstitleArray.splice(this.colorsIdx, 1)
      this.colorsArray.splice(this.colorsIdx, 1)

      // reset the value of every element from the deleted position
      for(var i = this.colorsIdx; i <= this.colorsArray.length-1; i++) {
        this.colorstitleArray[i].val --;
      }

      this.colorsIdx = 0
    },

    remColor() {
      var curCol = this.red + "," + this.green + "," + this.blue + "," + this.alpha
      this.colorsArray[this.colorsIdx].some((x, idx) => {
        if (x.toString() === curCol) {
          this.colorsArray[this.colorsIdx].splice(idx,1)
        }
      })
    },

    random() {
      var ranArr = []
      for(var i = 0; i <= 2; i++) {
        var col = Math.floor( Math.random() * 255 )
        ranArr.push( col )
      }

      this.setColor(ranArr[0], ranArr[1], ranArr[2], 1)
    },

    checkColor(idx) {
      var curCol = this.red + "," + this.green + "," + this.blue + "," + this.alpha
      return this.colorsArray[this.colorsIdx][idx].toString() === curCol
    },

    checkColors() {
      var curCol = this.red + "," + this.green + "," + this.blue + "," + this.alpha
      return this.colorsArray[this.colorsIdx].some((x,idx) => {
        return x.toString() === curCol
      })
    },

    setColor(r, g, b, a) {
      this.red = r
      this.green = g
      this.blue = b
      this.alpha = a
    },

    getColor() {
      return String(this.getRGBA(this.red, this.green, this.blue, this.alpha))
    },

    getRGBA(r, g, b, a) {
      return "rgba("
        + r + "," +
        + g + "," +
        + b + "," +
        + a + ")"
    }

  }
}
</script>

<style>
.palletteCont{
  float: left;
  overflow: auto;
  max-height: 60px;
}

.colorblock {
  padding: 2px;
  margin: 3px;
  border: 1px solid;
  cursor: pointer;
  float: left;
}

.colorblock div {
  width: 20px;
  height: 20px;
}

.colorPrev {
  border-bottom: 2px dashed;
}
.currentColor {
  border: 1px #FF0000 solid;
}
</style>

<template>
  <div>
    <v-card>
      <v-btn>add</v-btn>
      <v-card-text v-for="(layer,idx) in layers" :key="idx">
        {{layer.name}}
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import draggable from 'vuedraggable'

export default {
  name: 'Layer',

  props: {
    layersObj: Array
  },

  components: {
    draggable
  },

  data: function(){
    let _layers = this.layersObj
    return{
      layers: _layers
    }
  }

}
</script>

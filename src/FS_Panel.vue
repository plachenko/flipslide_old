<!-- FlipSlide PANEL -->
<!--
  A PANEL is a unit stored in a PAGE.

  Takes:
  - Width: (DEFAULT Window Width)
  - Height: (DEFAULT Window Height)
  - Offset: (DEFAULT 0, 0)

  Has:
  - Width: local Width
  - Height: local Height
  - Offset: Position offset from origin

  - Current frame: (0 by default)
  + Frames: An array of Frames
    + Frame: An array of Strokes
      + Stroke: An array of points
        - Offset: position
        + Points: Position with time

-->

<template>
  <div>
    <fslayer
     :panelSize="pageSize" />
  </div>
</template>
<script>
import FSLayer from './FS_Layer.vue'

export default {
  name: 'FSLayer',
  components: {
    fslayer: FSLayer
  },
  props: {
    pageSize: Object
  },
  data() {
    return{
      layers: [
        { title: 'layer1' }
      ]
    }
  },
  methods: {
    addLayer() {
      console.log('adding a layer...')
    },
    removeLayer() {
      console.log('removing a layer')
    }
  }
}
</script>

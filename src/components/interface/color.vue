<template>
  <div>
      <span>Red:</span><br />
      <input v-model="color.red" class="input" min="0" max="255" type="number" />
      <span>Green:</span><br />
      <input v-model="color.green" class="input" min="0" max="255" type="number" />
      <span>Blue:</span><br />
      <input v-model="color.blue" class="input" min="0" max="255" type="number" />
  </div>
</template>
<script>
export default {
  name: "color",
  watch: {
    color: {
      handler: function(){
        this.$eh.color = this.color
        this.$eh.$emit('colorEvt', this.color)
      },
      deep: true
    }
  },
  data(){
    return{
      color: {
        red: 0,
        blue: 0,
        green: 0
      }
    }
  }
}
</script>
<style>

</style>

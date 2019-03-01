<!-- FlipSlide DEBUG -->
<!--
  DEBUG is a template with various testing utilities to help visualize and store
  actions for the purpose of testing and development.

  Has:
  - INT Width: Window Width
  - INT Height: Window Height

-->
<template>
  <div>

  </div>
</template>
<script>
export default {
  methods: {
    debugToggle() {
      this.$eventHub.debug = !this.$eventHub.debug
      this.$eventHub.$emit('debug-toggle', this.$eventHub.debug)
    }
  }
}
</script>
<style lang="">

</style>

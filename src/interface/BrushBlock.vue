<template>
  <div>
    <v-card>
      <v-card-text>
        <v-layout row wrap>
          <v-flex xs9>
            <v-slider v-model="bsize" :max="50" label="size" />
          </v-flex>
          <v-flex xs3>
            <v-text-field v-model="bsize" class="mt-0" type="number" />
          </v-flex>
        </v-layout>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
export default {
  data(){
    var b = this.$eventHub.size.w
    return {
      size: {},
      bsize: b
    }
  },

  watch: {
    bsize(val) {
      this.$eventHub.size = {w: val, h: val}
    }
  },

  mounted() {
    this.size = this.$eventHub.size
  }
}
</script>

<style lang="">

</style>

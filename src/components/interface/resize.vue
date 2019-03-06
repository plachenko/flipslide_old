<template>
    <div>
      <div class="handle tb" v-for="(i, idx) in 2" :key="idx" :style="{ }"></div>
      <div class="handle rl" style="top: -30px;"></div>

      <div class="handle corner" style="left: -30px; top: -30px;"></div>
      <div class="handle corner" style="right: -30px; top: -30px;"></div>
      <div class="handle corner" style="left: -30px; bottom: -30px;"></div>
      <div class="handle corner" style="right: -30px; bottom: -30px;"></div>
    </div>
</template>
<script>
export default {
    
}
</script>
<style>
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
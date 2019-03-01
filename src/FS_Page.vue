<!-- FlipSlide PAGE -->
<!--
  A PAGE is a unit stored in a BOOK.

  Takes:
  - INT Width
  - INT Height

  Has:
  - Current Panel
  + Panels: An array of PANELs
    + Panel: An array of LAYERs
      - Offset:
      - Height: INT
      - Width:
      + Points: Position with time

-->

<template>
  <div>
    <fspanel :pageSize="bookSize" />
  </div>
</template>
<script>
import FSPanel from './FS_Panel'

export default {
  name: 'FSPage',
  props: {
    bookSize: Object
  },
  components: {
    fspanel: FSPanel
  },
  data: () => {
    return {}
  }
}
</script>
<style lang="">

</style>

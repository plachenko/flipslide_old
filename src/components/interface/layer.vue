<template>
    <div class="item_container">
        <div style="position: fixed">
            <button @click="addLayer">Add</button>
            <button @click="remLayer">Remove</button>
        </div>
        <draggable
            :list="layers"
            :disabled="!enabled"
            class="list-group"
            @start="dragging = true"
            @end="dragging = false" >
            <div class="layer_inner">
                <div class="layer_item" ref="layer_item" v-for="(layer, idx) in layers" :key="idx" @click="setLayer(layer.idx)" >
                    <span v-if="layer.idx === currentIdx">_</span>
                    <span v-if="layer.name">{{layer.name}}</span>
                    <span v-else>{{"layer " + layer.idx}}</span>
                </div>
            </div>
        </draggable>
    </div>
</template>
<script>
import draggable from 'vuedraggable'

export default {
    name: 'layer',
    components: {
        draggable
    },
    data(){
        return{
            currentIdx: 0,
            layers: [
                { idx: 0, name: "Background" },
            ],
            enabled: true,
            dragging: false
        }
    },
    computed: {
        curIdx(){
            return (this.layers.length-1) - this.currentIdx
        }
    },
    methods: {
        setLayer(e){
            this.currentIdx = e
            let _el = this.$refs.layer_item[this.currentIdx]

            console.log(this.currentIdx)
        },
        remLayer(){
            console.log(this.currentIdx)
            if(this.currentIdx > 0){
                this.layers.splice(this.curIdx, 1)
                this.currentIdx--
            }
        },
        addLayer(){
            this.layers.unshift({idx: this.layers.length})
            this.currentIdx++
        }
    } 
}
</script>
<style>
.item{
  background-color: #FFF;
  padding: 10px;
  margin: 10px 0px;
}

.current{
    border: 3px solid #0FF;
    box-sizing: border-box;
}

.right .item_container{
  height: 100%;
}
.layer_inner{
    overflow: auto;
}
#layer_menu .layer_item {
  min-height: 100px;
  width: 100%;
  background-color: #FFF;
  margin: 5px 0px;
}
#layer_menu .item:last-child {
  border-bottom: none;
}
    
</style>
<template>
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
            <button slot="header" @click="remLayer">Remove</button>
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
            layers: [
                { name: "Background" },
            ],
            enabled: true,
            dragging: false
        }
    },
    methods: {
        remLayer(){
            this.layers.push({name: 'layer'})
        },
        addLayer(){
            this.layers.push({name: 'layer'})
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

.right .item_container{
  overflow: auto;
  height: 100%;
}
#layer_menu .layer_item {
  min-height: 100px;
  width: 100%;
  background-color: #FFF;
}
#layer_menu .item:last-child {
  border-bottom: none;
}
    
</style>
<template>
    <div class="item_container" style="position: relative">
        <div style="position: fixed;">
            <button @click="addLayerEvt">Add</button>
            <button @click="remLayerEvt">Remove</button>
        </div>
        <draggable
            :list="layers"
            :disabled="!enabled"
            class="list-group"
            @update="dragEnd"
            @start="dragging = true"
            @end="dragging = false" >

            <div class="layer_item" ref="layer_item" v-for="(layer, idx) in reverseList" :key="idx" @click="setLayer(layer.idx)" >
                <img class="layer_preview" width="100" height="100" :src="layer.data" >
                <span v-if="layer.idx === currentIdx">_</span>
                <span v-if="layer.name">{{layer.name}}</span>
                <span v-else>{{"layer " + layer.idx}}</span>
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
            totalIdx: 0,
            layers: [],
            enabled: true,
            dragging: false
        }
    },
    mounted(){
        let _bgLyr = {
                idx: 0, 
                name: "Background",
                data: null,
                zPosition: 0
            }
        this.addLayer( _bgLyr )

        // ++TESTING: Random layer add
        // for(var i = 1; i < 5; i++) {
        //     let _idx = this.layers[this.layers.length -1].idx
        //     let _rand = Math.round(Math.random()*10 + _idx)
        //     this.addLayer({idx: _rand})
        // }
        // --TESTING

        this.$eh.$on('imageSet', this.setImage)
    },
    computed: {
        reverseList(){
            return this.layers.slice().reverse()
        }
    },
    methods: {
        dragEnd(e){
            let _arr = this.layers.slice().reverse()
            this.dragging = false
            this.$emit('changeLayer', this.layers)
        },
        setLayer(e){
            if(e !== this.currentIdx){
                this.currentIdx = e
            }
        },
        setImage(e){
            let _idx = this.layers.findIndex(i => i.idx === e.idx)
            
            if(this.layers[_idx]){
                this.layers[_idx].data = e.data
            }
        },
        addLayer(obj){
            // let _idx = this.layers.splice().reverse().findIndex(i => i.idx === this.currentIdx)
            this.layers.push(obj)

            // this.layers.splice(_idx, 0, obj)

            this.setLayer(obj.idx)
            this.$emit('changeLayer', this.layers)
            this.totalIdx ++
        },
        remLayer(){
            let _idx = this.layers.findIndex(i => i.idx === this.currentIdx)

            if(_idx > 0){
                this.layers.splice(_idx, 1)
                this.setLayer(this.layers[_idx - 1].idx)
                this.$emit('changeLayer', this.layers)
            }
        },
        remLayerEvt(){
            this.remLayer()
        },
        addLayerEvt(){
            let _lastLyr = this.layers[this.layers.length-1]
            this.addLayer({idx: this.totalIdx})
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
.layer_preview{
    border: 1px solid;
}
#layer_menu .layer_item {
  background-color: #FFF;
  margin: 5px 0px;
  text-align: center;
  padding: 5px 0px;
}
#layer_menu .item:last-child {
  border-bottom: none;
}
    
</style>
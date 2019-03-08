<template>
    <div>
        <div class="brush_btn" v-for="(b, idx) in brushes" :key="idx">
            <span @click="changeBrush(b.id)">{{b.name}}</span>
        </div>
        <span>Opacity:</span><br />
        <input v-model="brush.opacity" class="input" min="0" step=".01" max="1" type="number" />
        <span>Size:</span><br />
        <input v-model="brush.size" class="input" min="1" type="number" />
    </div>
</template>
<script>
export default {
    name: "brush",
    mounted(){

    },
    watch: {
        brush: {
            handler: function(){
                this.$eh.$emit('brushEvt', this.brush)
            },
            deep: true
        }
    },
    data(){
        return {
            brush:{
                size: 1,
                opacity: 1
            },
            brushes: [
                {name: "brush", id: 1},
                {name: "erase", id: 2},
            ]

        }
    },
    methods: {
        changeBrush(e){
            this.$eh.$emit('brush', e)
        }

    }
}
</script>
<style>
.input {
    width: 50px;

}
.brush_btn{
    height: 40px;
    width: 10px;
    cursor: pointer;
}
    
</style>
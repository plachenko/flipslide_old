<template>
    <div>
        <div class="brush_btn" v-for="(b, idx) in brushes" :key="idx">
            <span @click="changeBrush(b.id)">{{b.name}}</span>
        </div>
    </div>
</template>
<script>
export default {
    name: "brush",
    mounted(){

    },
    data(){
        return {
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
.brush_btn{
    height: 40px;
    width: 10px;
    cursor: pointer;
}
    
</style>
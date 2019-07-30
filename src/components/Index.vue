<template>
   
    <div id="app">
        <Search  />
        <div id="MapView">
            <sidebar-search />
            <detail-petro />
        </div>
        <div  class="loading" :class="{active: loading }">
            <div class="loadcenter">
                <div class="spinner-border" role="status">
                    <span class="sr-only">Loading...</span>
                </div>
            </div>
        </div>
    </div>

</template>

<script>
import axios from 'axios'
import Vue from 'vue'
import { loadModules } from 'esri-loader'
import { addFeatures } from '@esri/arcgis-rest-feature-layer'
import { deleteFeatures } from '@esri/arcgis-rest-feature-layer';
import Search from './Widget/Search.vue'
import SidebarSearch from './Sidebar/Search'
import DetailPetro from './Sidebar/DetailPetro'
import UUID from 'vue-uuid'
import { async } from 'q';
import {mapActions, mapGetters} from 'vuex'
Vue.use(UUID)
export default {
    computed:
    {
        ...mapGetters(["map","view","featureLayer"])
    },
    watch: {
        map: (newVal,oldVal) => {
            console.log("new old",newVal,oldVal)
        },
        view: (newVal,oldVal) => {
            console.log("view",newVal,oldVal)
        },
        featureLayer: (newVal,oldVal) => {
            console.log('featureLayer',newVal,oldVal)
        }
    },
    data(){
        return{
             GPSLocation: null ,
             data: [],
             objectid: [],
             loading: false
        }
    },
    components:{
        Search,
        SidebarSearch,
        DetailPetro
    },
    methods:{
        ...mapActions(["loadMap"]),
        ApiPetro()
        {
            axios.get("https://murmuring-savannah-99261.herokuapp.com/petrolimex").then((response) => {
                this.$store.dispatch("updatePetrolimexs",response.data)
            })
        }
    },
    beforeMount()
    {
       this.loading = true
    },
    async created(){
        this.ApiPetro()
       
        this.loadMap()
        await this.$nextTick()
        this.loading = false 
        console.log('update')

    },
    mounted()
    {
        console.log("mounted")
    },
    updated()
    {
        console.log('updated')
    }
}
</script>

<style>
#MapView ,#app{
        padding: 0;
        margin: 0;
        height: calc( 100% - 34px)  ;
        width: 100%;
     
    }
.loading.active {
  top:0;
  background: #33333321;
  position: fixed;
  z-index: 999;
  width: 100%;height: 100%;
}
.loading {display: none}
.loadcenter {transform: translate(-50%,-50%);top:50%;left: 50%;text-align: center;position: absolute}
</style>

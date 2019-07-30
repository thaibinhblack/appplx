<template>
    <div class="form-search">
        
        <div class="row">
            <!-- <div class="col-md-1">
               
                <mdb-btn class=" btn-bar" color="primary" @click.native="modal = true"> <mdb-icon icon="bars" /> </mdb-btn>
            </div> -->
            <div class="col-md-2 pd7 logo" style="padding-right:5px;text-align:center   ">
                
                <span style="font-size:20px;font-weight:bold;color:#0051e9">
                    <img class="img-header" src="http://127.0.0.1:8080/petrolimex.png" />
                     FSMS 
                </span>
               
            </div>
            <div clas="col-md-1 pd7"></div>
            <div class=" col-md-2 pd7">
                <select class="provinces"  v-model="slprovince" @change="changeProvince">
                    <option value="all">Tỉnh / Thành Phố</option>
                    <option v-for="(value,index) in provinces"  :value="value.UUID" :key="index">
                            {{value.name}}
                    </option>
                </select>
            </div>
            <div v-if="showcontry == true" class=" col-md-2 pd7" >
                <select class="provinces" v-model="slcountry" @change="changecontry" :disabled="disabled.provinces" :class="{active: disabled.provinces }">
                    <option value="all">Tất cả</option>
                    <option v-for="(ct,index) in country" :value="ct.title" :key="index">
                            {{ct.title}}
                    </option>
                </select>
            </div>
            <div class="col-md-2 pd7">
                <select v-if="showcontry == true" class="element" @change="bufferCricle" :disabled="disabled.buffer" :class="{active: disabled.buffer}" v-model="slbuffer">
                    <option value="all">Phạm Vi</option>
                   
                    <option value="1000">Trong phạm vi 1km</option>
                    <option value="3000">Trong phạm vi 3km</option>
                    <option value="5000">Trong phạm vi 5km</option>
                    <option value="7000">Trong phạm vi 10km</option>
                    <option value="15000">Trong phạm vi 15km</option>
                    <option value="20000">Trong phạm vi 20km</option>
                    <option value="30000">Trong phạm vi 30km</option>
                    <option value="40000">Trong phạm vi 40km</option>
                    <option value="50000">Trong phạm vi 50km</option>
                    <option value="70000">Trong phạm vi 70km</option>
                </select>
            </div>
            <div v-if="showcontry == true" class="col-md-1 pd7 form-search-input" >
                <button class="btn-open-sbsearch btn" @click="updateSearch(true)"><i class="fas fa-search"></i></button>                 
            </div>
        </div>
    </div>
</template>

<script>``


import axios from 'axios'
import { loadModules } from 'esri-loader'
import { async, Promise } from 'q';
import { queryFeatures, decodeValues } from '@esri/arcgis-rest-feature-layer';
//
import { mdbModal, mdbModalHeader, mdbModalTitle, mdbModalBody, mdbModalFooter, mdbBtn,mdbIcon,mdbFormInline,mdbInput } from 'mdbvue';
import {mapActions,mapGetters} from 'vuex'
export default {
    name: 'search',
    data(){
        return{
            provinces: [],
            slprovince: 'all',
            province: null,
            petrolimexs: [],
            features: [],
            country: [],
            slcountry: 'all',
            slbuffer: 'all',
            showcontry: false,
            petrolimex: {},
            modal: false,
            GPS: {},
            disabled: {
                buffer: false,
                provinces: false
            },
            sql: "",
           
        }
    },
     components: {
      mdbModal,
      mdbModalHeader,
      mdbModalTitle,
      mdbModalBody,
      mdbModalFooter,
      mdbBtn,
      mdbIcon,
      mdbFormInline,
      mdbInput
    },
    methods:{
        ...mapActions(["updateSearch","resetFeatureLayer"]),
        changecontry(e)
        {
               console.log('filter',e.target.value)
              
                const filter = this.petrolimex.filter((value,index,array) => {
                        return array[index].District == e.target.value
                })
                
                var $sql = " UUID in ( "
                var i = 0
                filter.forEach((element) => {
                    if(i == 0)
                    {
                        $sql += " '" + element.UUID + "'"
                    }
                    else
                    {
                        $sql += " , '" + element.UUID + "'"
                    }
                    i = i+1
                        
                })
                $sql += ")"
                    
                if(e.target.value != 'all')
                {
                    this.$store.dispatch("updateListPetro",{
                        Level: 2,
                        District: e.target.value
                    })
                    if(filter.length <= 0 )
                    {
                        $sql = "UUID is NULL"
                    }
                    this.$store.dispatch("resetFeatureLayer",$sql)
                    this.disabled.buffer = true
                    
                }
                else
                {
                    this.$store.dispatch("resetFeatureLayer",this.sql)
                    this.$store.dispatch("updateListPetro",1)
                    this.disabled.buffer = false
                }
               
                    
        },
        changeProvince(e){
           
            this.slcountry = 'all'
            this.slbuffer = 'all'
            const country = this.provinces.filter((value,index,array) => {
                return array[index].UUID == e.target.value
            })
            this.country = country[0].counties
            this.showcontry = true
           
            const value = e.target.value
          
            axios.get('https://murmuring-savannah-99261.herokuapp.com/provinces/'+value).then(async (response) => {
                    this.province = await response.data.name
                  
                    this.$store.dispatch("updateNameContry",this.province)
                    const petrolimexs = await this.petrolimexs.filter((value,index,array)=> {
                       
                        return array[index].Province == this.province
                    })
                    this.petrolimex = petrolimexs
                   
                    var $sql = " UUID in ( "
                    var i = 0
                    petrolimexs.forEach((element) => {
                        if(i == 0)
                        {
                            $sql += " '" + element.UUID + "'"
                        }
                        else
                        {
                            $sql += " , '" + element.UUID + "'"
                        }
                        i = i+1
                        
                    })
                    $sql += ")"
                    this.sql = $sql
                    this.$store.dispatch("resetFeatureLayer",$sql)
                    this.$store.dispatch("updateListPetro",1)
                    const features = []
                    this.GPS  = {y: parseFloat(response.data.lat), x: parseFloat(response.data.long), spatialReference: { wkid: 4326 } }
                    var point = { type: "point", y: parseFloat(response.data.lat), x: parseFloat(response.data.long), spatialReference: { wkid: 4326 } }
                    this.$store.dispatch("updatePoint",point)
                    this.$store.dispatch("drawPoint",point)
            })
           
            
        },
        ApigetPointMap(countries,uuid)
        {
            const url = "http://nominatim.openstreetmap.org/search?q="+ countries +"&format=json&polygon=0&addressdetails=1"
            axios.get(url).then(async (response) => {
                axios.put('https://113.161.225.252:3000/provinces/'+uuid,{
                    long: response.data[0].lon,
                    lat: response.data[0].lat
                }).then((response) => {
                    console.log('UPDATE' , response.data)
                })
            })
        },
        ApiDataCountry()
        {
            axios.get('https://murmuring-savannah-99261.herokuapp.com/provinces/').then((response) => {
                this.provinces = response.data
            })
            axios.get('https://murmuring-savannah-99261.herokuapp.com/petrolimex/').then((response) => {
                    this.petrolimexs = response.data  
            })
        },
        async bufferCricle(e)
        {
            if(e.target.value != 'all')
            {
                this.disabled.provinces = true
                await this.$store.dispatch("drawCricle",e.target.value)
            }
            else
            {
                this.disabled.provinces = false
                console.log(this.sql)
                await this.$store.dispatch("resetFeatureLayer",this.sql)
                this.$store.dispatch("resetGraphics")
              
            }
           
            // await this.$store.dispatch("updateListPetroBuffer")
            
            // await this.$nextTick().then(async (response) => {
                
            //     await console.log('nextTick 2',response)
            //    await this.$store.dispatch("drawCricle",e.target.value)
              
            // })
        
            

        }
    },
    created(){
        
        this.ApiDataCountry()
           
        
    }
}
</script>

<style>
.form-search {top: 15px;right: 0;width: 100%;}
.pd7 {padding: 7px 3px !important}
.pd7>select {width: 100%;}
.pd7>select.active {background: #e2e2e2}
.provinces,.provinces, .element {padding: 7px;border-radius: 5px;}
.img-header {width:40px;height: auto;}

.btn-bar {padding:7px 15px;background-color: #fff !important;color: #333;}
.form-search-input {text-align: left;}
.form-search-input>.md-form {margin:0 !important;}
.btn-open-sbsearch, .btn-back {padding:7px;background: transparent;box-shadow: none;padding: 7px 10px;border:1px solid #e2e2e2;margin: 0  }
</style>

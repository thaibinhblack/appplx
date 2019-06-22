<template>
    <div class="form-search">
        <div class="row">
            <div class="col-md-6"></div>
            <select class="provinces col-md-2" v-model="slprovince" @change="changeProvince">
                <option value="all">Tất cả</option>
                <option v-for="value in provinces" v-bind:value="value.UUID">
                        {{value.name}}
                </option>
            </select>
            <select v-if="showcontry == true" class="provinces col-md-2" v-model="slcountry" >
                <option value="all">Tất cả</option>
                <option v-for="ct in country" v-bind:value="ct.type">
                        {{ct.title}}
                </option>
            </select>
            <div class="col-md-1"></div>
        </div>
    </div>
</template>

<script>


import axios from 'axios'
import { loadModules } from 'esri-loader'
import { async } from 'q';
import { queryFeatures, decodeValues } from '@esri/arcgis-rest-feature-layer';
//

export default {
    name: 'Search',
    data(){
        return{
            provinces: [],
            slprovince: 'all',
            province: null,
            petrolimexs: [],
            features: [],
            country: [],
            slcountry: null,
            showcontry: false
        }
    },
    computed()
    {

    },
    methods:{
        changeProvince(e){
            const country = this.provinces.filter((value,index,array) => {
                return array[index].UUID == e.target.value
            })
            this.country = country[0].counties
            this.showcontry = true
            console.log('country',country)
            const value = e.target.value
            console.log(value)
            axios.get('http://113.161.225.252:3000/provinces/'+value).then(async (response) => {
                    this.province = await response.data.name
                    console.log( this.province)

                    const petrolimexs = await this.petrolimexs.filter((value,index,array)=> {
                       
                        return array[index].Province == this.province
                    })
                    console.log(petrolimexs.length)
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
                    console.log($sql)
                    this.$emit('ResetFeature',$sql)
                   
                    console.log(petrolimexs)
                    const features = []
                  
                    
                    console.log('features',features)
                    console.log(response.data.long,response.data.lat)
                    console.log(this.$store.state.view)
                    var point = { type: "point", y: parseFloat(response.data.lat), x: parseFloat(response.data.long), spatialReference: { wkid: 4326 } }
                    this.drawPoint(point)
                })
            console.log('name',this.province)
            
        },
        drawPoint(point)
        {
            loadModules([
               
                "esri/Graphic",
                "esri/symbols/MarkerSymbol",
                "esri/tasks/QueryTask", 
                "esri/tasks/support/Query",
                "esri/layers/FeatureLayer"
            ],{
             url: "https://js.arcgis.com/4.11/",
           
            }).then( async([Graphic, MarkerSymbol,QueryTask , Query, FeatureLayer]) => {
              
               var markerSymbol = {
                    type: "simple-marker",  // autocasts as new SimpleMarkerSymbol()
                    color: [226, 119, 40]
                 };
                console.log(point)
                var pointGraphic = new Graphic({
                    geometry: point,
                    symbol: markerSymbol
                });
                
               
                this.$store.state.view.graphics.removeAll()
                this.$store.state.view.graphics.add(pointGraphic)
                this.$store.state.view.goTo({
                    target: pointGraphic,
                    zoom: 10
                    })
               
                console.log('map', this.$store.state.map)
                var query = new Query();
                var queryTask = new QueryTask({
                     url: "https://tilis.vbgis.vn/arcgis/rest/services/DoThi/FuelStations/FeatureServer/0"
                });
                query.where = "UUID in ( '4a1bd97f-5ea2-4cda-8886-932333a05118' , '3f92d2b1-617c-4ada-9c13-e571692d8938' , 'ed068942-0b8b-45d8-9cb7-51bf784cf685' , 'c74ca30f-f59c-4704-82e7-7315d617b2c0' , '4ea9135b-afc6-458e-81c6-f57ae09a1f6c' , 'd6747e64-e0fc-4d30-898d-a03b1962e865' , '965381fa-191b-4f3e-8c4c-c9633b9a049a' , 'c8a2096a-5fa4-4410-a94b-40f73cfab4f3' , '11d10e3c-e0e5-4abb-aad0-87ec681a725b' , '601048cd-a988-4394-a57e-6d2924a4bd96' , '4516a4b4-03b2-4e17-8c14-b7585b1ab756' , '6d4cbae8-f923-4720-8659-7fd879e0db42' , 'c7a5f761-47b7-4658-95b9-08b2a166e4fa' , '0bbfef13-948c-4233-aef4-ef3d992cecae' , '35bc3957-78cd-4de7-baf7-2b6556e42b6e' , '5c272518-9919-4fdf-bcca-d86765b663e1' , '2d0d39eb-47e7-47e4-8718-d5e048a42555' , 'd247c930-76a3-44d3-8041-b11fe1176aec' , 'c1a6f884-ea6a-4cdf-9aea-7aaba28cc1ea' , '036acffc-9f6a-4c2b-be84-0231f17dab0b' , '88c85df8-ebaf-4278-a5c9-7981dfa9567a' , '0a61906f-460a-4544-b2ef-8e4131dfc9cd' , 'b17e43df-f53e-4d77-bcb9-a6b0493ea53a' , '64893904-eadf-4b88-a287-d6a22079aeff' , 'b9b96fb1-58ae-47fd-825c-3d750d96b2bf' , 'c377d457-507d-4049-b888-745117d9f23a' , '6ec7bb05-3148-42c8-94f4-fdafb6c6e817' , '5cefd065-a432-4394-b0ff-aff5858b63a6' , 'ebd748ed-9c74-4d9d-9f0e-5b4e31211137' , 'f6a53795-214e-4259-bf53-8c859f798a23' , 'd9c1fef5-7617-4885-af65-345a70118432' , '9a9caba1-791a-411d-9e2f-0589020939e5' , '40d95831-949b-482f-a960-273015ab8b0c' , 'b87094e9-b23a-4fe1-a12d-50390648d8af' , 'fdbc1af2-2302-46a6-8f3a-0e6e3f79997d' , '0fe56bda-2fa5-4942-a99b-eef6fc7952ec' , '0de5eb01-008a-4022-80df-c245ff694140' , '92ba6d9b-67b6-4159-a83e-4a55497cbae6' , 'c76cd152-e25a-4eeb-a441-f10194ec840e' , 'f259f840-f27c-4985-a7ee-87b53f868ac1' , 'a481b641-1d77-44d5-b89d-e3eff012f547' , '305b9e3f-7cfe-42b2-a8d7-b7e972853d59' , 'd4f2c6fc-1f9d-4e11-a961-9da73c33042a' , 'bf517615-3904-43ac-a354-4b198d50c83c' , 'c46f80f0-e03e-48ac-a6bb-4acd7d3419fa' , 'a989c61a-458d-487c-a888-1ec293b74e28' , '092336f8-b74a-44c8-aac8-719ddf859ef5' , '21712421-3112-4fd1-89f5-0d4b56b95f8b' , 'b38fe606-79c8-4e68-b0b9-4a94986e5c3f' , '91b8df6b-91dc-499f-ae0d-45f840db38fd' , 'd12acaaa-575e-47f5-b77a-ca1cd161d1fd' , '8a4445ea-c9e0-492a-a2b1-d069e5c32d52' , '91a4c77c-e2d2-4d24-88cc-36962207d4d1' , 'e7cebb7b-ca19-4519-9592-5b3ee8877072' , '972df512-515c-463e-97d0-13d01af5de06' , 'e522f0b8-0127-46ed-a1f1-df83b39fc79b' , '24afb777-3df2-4e62-b9f8-9cb9d078ebeb' , '3ab60bda-09d8-460b-805a-3f24ffa7675f' , 'f49f3d75-9ef7-4268-a139-c8981819b417' , 'ccecaa16-a427-40bb-a479-f51a7c7a4aa4' , '5763d6b9-dce7-478c-b915-61c9b2d95bc1' , '57297b6b-85df-4f23-88fb-acdeb969dc06' , 'e7563d33-18d1-4a40-a8d8-18e2d3df3f31' , 'f2411489-a853-4df9-9082-47f7c1560ef3' , '0db8cb52-b9d9-4ffc-8132-12f223cc22cb' , '207f35bd-09b0-45d8-b33e-82cda2cda381' , '32c54934-39ec-4ea8-ab58-82691321bad3' , 'd72140d4-24f8-459f-a9d8-f2d42d661664' , 'bc737114-86e8-4be0-9bc3-c692dd11bd1e' , '514028bd-3acc-4c08-8e3b-02f16ac552d2' , '90a138a5-228b-455d-8631-aad7304f04dd' , '575c0591-efca-491a-a141-97a418566f2d' , 'bc9b817c-08c8-4029-bacc-85d482c8b819' , 'ce7ab9cb-4db5-4355-a134-826d2ced6abd' , '0e23e677-5229-401d-9eb9-f6f61489c815' , 'bc342faf-78c2-4110-96d8-ae2f913caab8' , '9696e10d-e98c-4435-beef-25c2b7a51935' , '9c63fc50-7288-4e9b-a021-8d2b37f72571' , '5b56d479-eb7f-4700-b9b2-6b15ace4b2ed' , '71562948-b10d-47c0-85b0-4cf43c603b81' , '2dc23bb8-af77-4882-a3a6-dfdc40916f04' , 'b828381d-5d8b-4022-8967-88a9479995f5' , '61ceba03-9f84-4ac7-87c1-9e632a97d232' , '5438da6a-95a2-4cfd-98ed-17df101d45a0' , '7e5a23cc-69c8-4834-b427-61394ad77203' , '681389a1-a205-415d-8be5-e1bc789abf89' , 'aabcd1a6-ebb7-4c9c-941b-a21c370abbf3' , 'edaff125-ceb0-4188-818f-cf281244013a' , '0e42d90b-e1c2-4e04-a1e7-bf1049a5f3da' , '6238c4c4-f566-4af9-88e9-660cc1d4285b' , '10bec924-ca7f-4938-8690-3eafd8e9eee6' , '93c87cc4-85c0-4cee-9f4d-2ac4e4528caa' , 'bba8bdfb-29f1-4821-bab8-bdb7352031c8' , '920ab25c-6f9f-4c25-aea2-e3cbf6ba0587' , '89ff92e5-2d14-468a-ab22-5199cfa2c692' , 'ae929f74-f1e8-4202-963c-daf681b8d3dd' , '8703f5b1-c32b-4bdc-b59c-1d364ee50ba4' , '4236f499-b6ef-403f-aedb-5e2d34b4c2a4' , '5b12ca56-5881-4b8a-a8f8-24883eed5b38' , '9e0f4886-358d-465b-a1bf-7a76ee0ad541' , '5672f437-797d-439e-a9c9-b224160e04eb' , '7d0d49b7-1bb6-443b-b87f-1bc896dd117a' , '375d530b-2054-49d0-9598-0add123d327a' , 'cf5d2115-6824-4470-b729-af644087e253' , '6f2eb08f-1eae-4e79-812a-d7fea2fa1509' , 'f81bcaf8-c479-44b7-8bdb-dd792df2376f' , '653ce8d8-72f6-4eee-af8b-aed6bcf81558' , '6ec1c019-5740-494c-a8f5-d1e7268630d0' , '34ad1a8d-69a2-4270-bb30-ca90c9801018' , '7d6f6a37-fb82-4d91-8b72-17ce7cf90ff2' , '73b31b5a-06d1-4d44-8134-2571c3ef1ed4' , '9a256948-edac-4cfd-aa5f-0d0563d66719' , '2fdb15d4-aad5-41b9-a1c5-da3f74f000bc' , 'e0f7f3fa-7565-4c23-878d-b958e0d50ac9' , 'fafaa857-2927-47a5-a35f-7108d9f4cb2e' , 'd78ae899-49a4-44df-9ed7-aa34fb127881' , '77f1b7ad-8a09-45ae-9b17-3c556e89eeeb' , '7c5c44d7-84e8-4bf6-bc8d-416e4dce3d8c')";  // Return all cities with a population greater than 1 million
                query.outSpatialReference = { wkid:102100 };
                query.returnGeometry = true;
                query.outFields = [ "*" ];
                queryTask.execute(query).then(function(results){
                    console.log(results)
                });
                
                
            })
        },
        ApigetPointMap(countries,uuid)
        {
            const url = "http://nominatim.openstreetmap.org/search?q="+ countries +"&format=json&polygon=0&addressdetails=1"
            axios.get(url).then(async (response) => {
                // console.log(response.data)
                // console.log(response.data)
                axios.put('https://113.161.225.252:3000/provinces/'+uuid,{
                    long: response.data[0].lon,
                    lat: response.data[0].lat
                }).then((response) => {
                    console.log('UPDATE' , response.data)
                })
            })
        }
    },
    created(){
        axios.get('http://113.161.225.252:3000/provinces/').then((response) => {
                this.provinces = response.data
                // response.data.forEach((element) => {
                //     this.ApigetPointMap(element.name,element.UUID)
                // })
        })
        axios.get('http://113.161.225.252:3000/petrolimex/').then((response) => {
                this.petrolimexs = response.data
                // response.data.forEach((element) => {
                //     this.ApigetPointMap(element.name,element.UUID)
                // })
        })
            
            const url = "https://tilis.vbgis.vn/arcgis/rest/services/DoThi/FuelStations/FeatureServer/0"
            queryFeatures({ url })
            .then(queryResponse => {
                decodeValues({
                url,
                queryResponse
                })
                .then((response) => {
                    console.log('api',response)
                    this.features = response.features
                })
            })
        
    },
    mounted()
    {
         console.log('feattrue',this.$store.state.featureLayer)
    }
}
</script>

<style>
.form-search {position: fixed;top: 15px;right: 0;width: 100%}
</style>

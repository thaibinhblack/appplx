import Vuex from 'vuex'
import Vue from 'vue'
Vue.use(Vuex)
//modules
import ModalModules from './modules/sidebar'
import MapModules from './modules/map'
import { async } from 'q';
import axios from 'axios'
import { loadModules } from 'esri-loader'

const state = {
    point: {

    },
    nameCountry: "",
    listPetro: [],
    listPetrotmp: [],
    Petrolimexs: []
}

const getters = {
    getPoint: (state) => {
        return state.point
    },
    getNameContry: (state) => {
        return state.nameCountry
    },
    getListPetro: (state) => {
        return state.listPetro
    },
    getPetrolimexs: (state) => {
        return state.Petrolimexs
    }
}

const mutations = {
    updatePoint: (state,payload) => {
        state.point = payload
    },
    updateNameContry: (state,payload) => {
        state.nameCountry = payload
    },
    updateListPetro: (state,payload) => {
        if(payload == 1)
        {
             state.listPetro = state.Petrolimexs.filter((value,index,array) => {
                return array[index].Province == state.nameCountry
            })
            state.listPetrotmp = state.listPetro
        }
        else{
            state.listPetro = state.Petrolimexs.filter((value,index,array) => {
                return array[index].Province == state.nameCountry &&  array[index].District == payload.District
            })
            state.listPetrotmp = state.listPetro 
        }
        
    },
    updateListPetroBuffer:  async (state) => {
       
        await axios.post("https://murmuring-savannah-99261.herokuapp.com/petrolimexs/",{
            UUIDS: MapModules.state.UUIDS
        }).then(async (response) => {
            state.listPetro = response.data
           
        })
    },
    updatePetrolimexs: (state,payload) => {
       
        state.Petrolimexs = payload
    },
    drawCricle: (state,radius) => {
        loadModules([
               
            "esri/Graphic",
            "esri/geometry/Circle",
            "esri/symbols/SimpleLineSymbol",
            "esri/symbols/SimpleFillSymbol",
            "esri/Color",
            "esri/tasks/QueryTask",
            "esri/tasks/support/Query",
        ],{
         url: "https://js.arcgis.com/4.11/",
       
        }).then( async([Graphic,Circle,SimpleLineSymbol,SimpleFillSymbol,Color,QueryTask,Query]) => {
            MapModules.state.view.graphics.removeAll()
            MapModules.state.view.graphics.add(MapModules.state.graphicsProvince)
            let circleSymb = new SimpleFillSymbol(
                SimpleFillSymbol.STYLE_NULL,
                new SimpleLineSymbol(
                    SimpleLineSymbol.STYLE_SHORTDASHDOTDOT,
                    new Color([105, 105, 105]),
                    2
                ),
                new Color([255, 255, 0, 0.25])
            );
                
            var circle = new Circle({
                center: MapModules.state.point,
                geodesic: true,
                radius: radius
            });
            let graphic = new Graphic(circle, circleSymb);
            
            MapModules.state.view.graphics.add(graphic);
            let queryPetrolimex = new Query(
                {
                    returnGeometry: true,
                    outFields: ["*"],
                    geometry: circle,
                    spatialRelationship: "intersects"
                });
            let PetrolimexTask = new QueryTask({
                url: "https://tilis.vbgis.vn/arcgis/rest/services/DoThi/FuelStations/MapServer/0"
            });
            MapModules.state.sql = await ""
          
            await PetrolimexTask.execute(queryPetrolimex).then(async (response) => {
                    MapModules.state.UUIDS = await []
                    // await MapModules.state.view.highlight(
                    //     response.features
                    // )
                    await response.features.forEach( async (feature) => {
                    await state.listPetrotmp.forEach(petro => {
                        if(petro.UUID == feature.attributes.UUID.toLowerCase().slice(1).slice(0,-1))
                        {
                            MapModules.state.sql = MapModules.state.sql.concat("'"+feature.attributes.OBJECTID+"', ")
                            MapModules.state.UUIDS.push(feature.attributes.UUID.toLowerCase().slice(1).slice(0,-1))
                        }
                    })
                   
                    })
                  
                    if( MapModules.state.sql.slice(0,-2).length > 0)
                    {
                        // await MapModules.state.map.add(MapModules.state.featureLayer)
                        MapModules.state.featureLayer.definitionExpression = await "OBJECTID in (" + MapModules.state.sql.slice(0,-2) + ")"
                        
                    }
                    else
                    {
                        MapModules.state.featureLayer.definitionExpression = await "OBJECTID is NULL"
                    //    await MapModules.state.map.remove(MapModules.state.featureLayer)
                    }
                    
                    await MapModules.state.featureLayer.refresh()
                 
                    state.listPetro = await []
                    await MapModules.state.UUIDS.forEach((uuid) => {
                        state.listPetrotmp.forEach((petro) => {
                            if(uuid == petro.UUID)
                            {
                                state.listPetro.push(petro)
                            }
                        })
                    })
                    // await axios.post("https://murmuring-savannah-99261.herokuapp.com/petrolimexs/",{
                    //     UUIDS: MapModules.state.UUIDS
                    // }).then(async (response) => {
                    //     state.listPetro = response.data
                       
                    // })
                }).catch( async (error) => {
                    console.log('error',error)
                
                })
               
            
            
                
        })
    },
    resetGraphics: (state) => {
        MapModules.state.view.graphics.removeAll()
        MapModules.state.view.graphics.add(MapModules.state.graphicsProvince)
        state.listPetro = state.listPetrotmp
        
    }
}

const actions = {
    updatePoint: ({commit},payload) => {
        commit("updatePoint",payload)
    },
    updateNameContry: ({commit},payload) => {
        commit("updateNameContry",payload)
    },
    updateListPetro: ({commit},payload) => {
        commit("updateListPetro",payload)
    },
    updatePetrolimexs: ({commit},payload) => {
        commit("updatePetrolimexs",payload)
    },
    updateListPetroBuffer: ({commit}) => {
        commit("updateListPetroBuffer")
    },
    resetGraphics: ({commit}) => {
        commit("resetGraphics")
    }
    
}


export default new Vuex.Store({
    state: state,
    getters: getters,
    mutations: mutations,
    actions: actions,
    modules: {
        ModalModules,
        MapModules
    }
})
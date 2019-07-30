import { loadModules } from 'esri-loader'
import { queryFeatures, decodeValues } from '@esri/arcgis-rest-feature-layer';
import { async } from 'q';
import { stat } from 'fs';
import axios from 'axios'
const mutations = {
    loadMap: (state) => {
        loadModules([
            "esri/Map",
            "esri/views/MapView",
            "esri/layers/FeatureLayer",
            "esri/Graphic",
            "esri/core/urlUtils",
            "esri/geometry/Polyline",
            "esri/widgets/Track",
        ],{
         url: "https://js.arcgis.com/4.11/",
       
        }).then(  async ([Map,MapView,FeatureLayer, Graphic, urlUtils,Polyline, Track]) => {
         
                const map = new Map({
                    basemap: "osm",
                    // layers: this.features.features
                });
               
                
                const view = new MapView({
                    container: "MapView",
                    map: map,
                    center:   [106.366362, 10.360622],
                    zoom: 6,
                    highlightOptions: {
                        color: [255, 241, 58],
                        fillOpacity: 0.4
                    }
                });
                state.view =view
            const featureLayer = new FeatureLayer({
                url: "https://tilis.vbgis.vn/arcgis/rest/services/DoThi/FuelStations/MapServer/0",
                title: "PLX",
             
            });
            state.featureLayer = featureLayer
           
            
            
            map.add(featureLayer)

            state.map = map
            view.popup.Viewmodel
             var track = new Track({
            view: view
            });
            view.ui.add(track, "top-left");
            await view.when(()=> {
                state.loading = true
            })
            state.loading = false
            state.view = view
        })
    },
    resetFeatureLayer: (state,payload) => {
        state.featureLayer.definitionExpression = ""
        state.featureLayer.definitionExpression = payload
        state.featureLayer.refresh()
        
    },
    drawPoint(state,point)
        {
            state.point = point 

            loadModules([
               
                "esri/Graphic",
            ],{
             url: "https://js.arcgis.com/4.11/",
           
            }).then( async([Graphic]) => {
              

               var markerSymbol = {
                    type: "simple-marker",  // autocasts as new SimpleMarkerSymbol()
                    color: [226, 119, 40]
                 };
                console.log(state,point)
                var pointGraphic = new Graphic({
                    geometry: point,
                    symbol: markerSymbol
                });
                
                state.graphicsProvince = pointGraphic
               
                state.view.graphics.removeAll()
                state.view.graphics.add(pointGraphic)
                state.view.goTo({
                    target: pointGraphic,
                    zoom: 10
                    })
               
            })
    },
    goToPoint: (state,petro) => {
        var GPS = petro.GPSLocation.split(", ",2)
        loadModules([
               
            "esri/Graphic",
        ],{
         url: "https://js.arcgis.com/4.11/",
       
        }).then( async([Graphic]) => {
          
           var markerSymbol = {
                type: "simple-marker",  // autocasts as new SimpleMarkerSymbol()
                color: [226, 119, 40]
             };
             var GPSPoint = petro.GPSLocation.split(", ",2)
            
            var point = { type: "point", y: parseFloat(GPSPoint[0]), x: parseFloat(GPSPoint[1]), spatialReference: { wkid: 4326 } }
            var pointGraphic = new Graphic({
                geometry: point,
                symbol: markerSymbol
            });
            
           
            // state.view.graphics.removeAll()
            // state.view.graphics.add(pointGraphic)
            state.view.goTo({
                target: pointGraphic,
                zoom: 17
                }) 
        })
        state.view.popup.open({
            location:  {
                x: parseFloat(GPS[1]),
                y: parseFloat(GPS[0]),
                spatialReference : {
                    wkid: 4326
                },
                scale: 50
            },
            features: petro,
            outFields: ["*"],
            title: "Cây xăng"+petro.Title,
            content:"<table class='esri-widget__table'> " +
            "<tr><th>UUID </th><td>" + petro.UUID + "</td></tr> " +
            "<tr><th>CardAccepts</th><td>" + petro.CardAccepts + "</td></tr> " +
            "<tr><th>Province </th><td>" + (petro.Province != null ? petro.Province : '(Rỗng)') + "</td></tr> " +
            "<tr><th>County</th><td>" + (petro.County != null ? petro.County : '(Rỗng)') + "</td></tr> " +
            "<tr><th>District </th><td>" + (petro.District != null ? petro.District : '(Rỗng)') + "</td></tr> " +
            "<tr><th>GPSLocation </th><td>" + (petro.GPSLocation != null ? petro.GPSLocation : '(Rỗng)') + "</td></tr> " +
            "<tr><th>Email </th><td>" + (petro.Email != null ? petro.Email : '(Rỗng)') + "</td></tr> " +
            "<tr><th>Goods </th><td>" + (petro.Goods != null ? petro.Goods : '(Rỗng)') + "</td></tr> " +
            "<tr><th>LeaderMobile </th><td>" + (petro.LeaderMobile != null ? petro.LeaderMobile : '(Rỗng)') + "</td></tr> " +
            "<tr><th>LeaderName </th><td>" + (petro.LeaderName != null ? petro.LeaderName : '(Rỗng)') + "</td></tr> " +
            "<tr><th>OilDispenser </th><td>" + (petro.OilDispenser != null ? petro.OilDispenser : '(Rỗng)') + "</td></tr> " +
            "<tr><th>OwnedBy </th><td>" + (petro.OwnedBy != null ? petro.OwnedBy : '(Rỗng)') + "</td></tr> " +
            "<tr><th>Phone </th><td>" + (petro.Phone != null ? petro.Phone : '(Rỗng)') + "</td></tr> " +
            "<tr><th>PumpsForAutos </th><td>" + (petro.PumpsForAutos != null ? petro.PumpsForAutos : '(Rỗng)') + "</td></tr> " +
            "<tr><th>Services </th><td>" + (petro.Services != null ? petro.Services : '(Rỗng)') + "</td></tr> " +
            "<tr><th>StationAddress </th><td>" + (petro.StationAddress != null ? petro.StationAddress : '(Rỗng)') + "</td></tr> " +
            "<tr><th>StorageCapacity </th><td>" + (petro.StorageCapacity != null ? petro.StorageCapacity : '(Rỗng)') + "</td></tr> " +
            "</table> ",
            actions: [{
                id: "showImg",
                title: "Xem hình ảnh",
                className: "esri-icon-media"
            }, {
                id: "update-infor-tree",
                title: "Cập nhật thông tin cây xanh",
                className: "esri-icon-edit"
            }, {
                id: "edit",
                title: "Tới trang chỉnh sửa",
                className: "esri-icon-home"
            }]
        })
    },
    loading: (state,payload) => {
        state.loading = payload
    }
}

export default mutations
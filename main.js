require([
    "esri/Map",
    "esri/views/MapView",
    "esri/widgets/BasemapGallery",
    "esri/widgets/Home",
    "esri/layers/FeatureLayer"
],
    function (Map, MapView, BasemapGallery, Home, FeatureLayer) {

        var popUp =
        {
            title: "{STATE_NAME}",
            content: "POP: {POP2012}"
        }
        var renderer = {
            type: "class-breaks",
            field: "POP2012",
            classBreakInfos: [
                {
                    minValue: 0,  
                    maxValue: 1000000,  // million
                    symbol: {
                        type: "simple-fill",  // autocasts as new SimpleFillSymbol()
                        color: [51, 51, 204, 0.9],
                        style: "solid",
                        outline: {  // autocasts as new SimpleLineSymbol()
                            color: "white",
                            width: 1
                        },
                        label: "fewer than 200,000 " 
                    }
                },
                {
                    minValue: 0,  
                    maxValue: 2000000,  // 2 million
                    symbol: {
                        type: "simple-fill",  // autocasts as new SimpleFillSymbol()
                        color: [31, 31, 104, 0.9],
                        style: "solid",
                        outline: {  // autocasts as new SimpleLineSymbol()
                            color: "white",
                            width: 1
                        },
                        label: "fewer than 200,000 " 
                    }
                },
                {
                    minValue: 0,  
                    maxValue: 3000000,  // 3 million
                    symbol: {
                        type: "simple-fill",  // autocasts as new SimpleFillSymbol()
                        color: [61, 61, 106, 0.9],
                        style: "solid",
                        outline: {  // autocasts as new SimpleLineSymbol()
                            color: "white",
                            width: 1
                        },
                        label: "fewer than 200,000 " 
                    }
                }

            ]
        };


        var featureLayer = new FeatureLayer({
            url: "https://services.arcgis.com/V6ZHFr6zdgNZuVG0/ArcGIS/rest/services/USA_States_with_capital_loations/FeatureServer/0",
            popupTemplate: popUp,
            renderer: renderer
        });


        var myMap = new Map({
            basemap: "streets",
            layers: [featureLayer]
        })

        var myView = new MapView({
            container: "viewDiv",
            map: myMap,
            center: [-100, 41],
            zoom: 4

        })

        var bmGallery = new BasemapGallery({
            view: myView
        })
        var homeBtn = new Home({
            view: myView
        })
        myView.ui.add(homeBtn, "top-left")
        // myView.ui.add(bmGallery, "top-right")

    });
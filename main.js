google.charts.load('current', { 'packages': ['corechart'] });

const selectMenu = document.getElementById("drop-states");
const selectcap = document.getElementById("drop-capital");
let serverData;
let stateChoosen;

require([
    "esri/Map",
    "esri/views/MapView",
    "esri/widgets/BasemapGallery",
    "esri/widgets/Home",
    "esri/layers/FeatureLayer",
    "esri/request"
],
    function (Map, MapView, BasemapGallery, Home, FeatureLayer, Request) {

        var popUp =
        {
            title: "{STATE_NAME}",
            content: "POP: {POP2012} , x: {POINT_X} , y: {POINT_Y}"
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
                    minValue: 1000000,
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
                    minValue: 2000000,
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
            // definitionExpression: "STATE_NAME = 'Montana'",
            renderer: renderer,
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


        var requestUrl = "https://services.arcgis.com/V6ZHFr6zdgNZuVG0/ArcGIS/rest/services/USA_States_with_capital_loations/FeatureServer/0/query"
        var requestOption = {
            responseType: "json",
            query: {
                where: "POP2012 > 1000000 ",    // here my response will include only STATES where population bigger than One mIllion
                f: "json",
                outFields: ["STATE_NAME", "State", "POP2012"]
            }
        }

        var states = new Array();
        Request(requestUrl, requestOption).then(function (response) {
            console.log(response.data);

            serverData = response.data;

            response.data.features.map(function (el) {
                if (!states.includes(el.attributes.STATE_NAME)) // this will push only uniques
                {
                    // i have used the array only to use the Condition to catch uique elements

                    states.push(el.attributes.STATE_NAME)
                    var opt = document.createElement('option');
                    opt.textContent = el.attributes.STATE_NAME;
                    selectMenu.appendChild(opt)

                }
            })
        })


        selectMenu.addEventListener("change", function () {
            featureLayer.definitionExpression = "STATE_NAME = '" + this.value + "' "   // this will color the specific STATE within the layer

            featureLayer.when(function () {
                return featureLayer.queryExtent();
            }).then(function (response) {
                myView.goTo(response.extent);
            });

            stateChoosen = serverData.features.filter(feature => feature.attributes.STATE_NAME == this.value)
            selectcap.value = `State Capital is: ${stateChoosen[0].attributes.State}`;


            drawChart(stateChoosen);

        })


        function drawChart(stateChoosen) {

            var data = google.visualization.arrayToDataTable([
                ['State', 'POP'],
                [stateChoosen[0].attributes.STATE_NAME, stateChoosen[0].attributes.POP2012]
            ]);

           

            // Set chart options
            var options = {
                'title': 'Population of States in 2012',
                'width': 400,
                'height': 300
            };

            // Instantiate and draw our chart, passing in some options.
            var chart = new google.visualization.ColumnChart(document.getElementById('chart_div'));
            chart.draw(data, options);
            
        }




    });
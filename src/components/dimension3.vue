<template>
    <div :id="dom" style="height: 80vh; width: 80vw"></div>
</template>

<script>
import * as echarts from 'echarts';
import 'echarts-gl';
import mapData from '../assets/munich.json'
import crinimalData from '../assets/data/data.json'
var icons = {'place': require('../assets/logo/administration.png'),
             'average': require('../assets/logo/average.png'),
             'criminal': require('../assets/logo/criminal.png'),
             'increase': require('../assets/logo/increase.png')}
export default {
    props: {
        year: {
            type: String,
            default: '2019'
        },
        type: {
            type: String,
            default: '犯罪案例'
        }
    },
    data () {
        return {
            coordDict: {},
            threeDmapData: [],
            dom: '',
            maxRange : 500
        }
    },
    methods: {
        loadMap(){
            var mapDom = document.getElementById(this.dom);

            var mapChart = echarts.init(mapDom);
            echarts.registerMap('munich', mapData);
            var loadData = this.threeDmapData;
            mapChart.setOption({
                title: {
                    text: '上巴伐利亚2019年'+this.type+'图(3D底图)',
                    subtext: '数据来自德意志联邦国家安全部门',
                    sublink: 'https://www.bka.de/EN/CurrentInformation/PoliceCrimeStatistics/policecrimestatistics_node.html'
                },
                toolbox: {
                    show: true,
                    orient: 'vertical',
                    top: 'center',
                    right: '20',
                    feature: {
                        restore: {},
                        saveAsImage: { pixelRatio: 2},
                    }
                },
                backgroundColor: '#ffffff',
                geo3D: {
                    map: 'munich',
                    shading: 'lambert',
                    light: {
                        main: {
                            intensity: 1,
                            shadow: true,
                            shadowQuality: 'high',
                            alpha: 45,
                            beta: 45
                        },
                        ambient: {
                            intensity: 0
                        },
                       
                    },
                    viewControl: {
                        distance: 120,
                        panMouseButton: 'left',
                        rotateMouseButton: 'right'
                    },
                    groundPlane: {
                        show: false,
                        color: '#999'
                    },
                    temporalSuperSampling: {
                        enable: true
                    },
                    itemStyle: {
                        borderWidth: 2
                    },
                    emphasis: {
                        label: {
                            show: true,
                        },
                        textStyle: {
                            color: "rgb(0,0,0)",
                            fontSize: 25,
                            fontWeight: 'bold'
                        }
                    },
                    
                    regionHeight: 1
                },
                visualMap: {
                    max: this.maxRange,
                    text: ['High', 'Low'],
                    calculable: true,
                    realtime: false,
                    inRange: {
                        color: ['#313695', '#4575b4', '#74add1', '#abd9e9', '#e0f3f8', '#ffffbf', '#fee090', '#fdae61', '#f46d43', '#d73027', '#a50026']
                    },
                    outOfRange: {
                        colorAlpha: 0
                    }
                },
                series: [{
                    type: 'bar3D',
                    coordinateSystem: 'geo3D',
                    shading: 'lambert',
                    data: loadData,
                    barSize: 1,
                    minHeight: 1,
                    silent: false,
                    itemStyle: {
                        color: 'orange'
                    },
                    emphasis: {
                        label: {
                            show: true,
                            width: 200,
                            formatter: (params) => {
                                return ['{title|'+params.data.name+'}{abg|}',
                                '{hr|}',
                                '  {criminal|}{value|犯罪案例}{rate|'+params.data.origin.Gewal+'}',
                                '  {average|}{value|万人中犯罪数}{rate|'+params.data.origin.HZ.toFixed(2)+'}',
                                '  {increase|}{value|案件增长率}{rate|'+params.data.origin.VerP.toFixed(2)+'%}',
                                ''].join('\n');
                            },
                            backgroundColor: '#eee',
                            borderColor: '#777',
                            borderWidth: 1,
                            borderRadius: 4,
                            rich: {
                                title: {
                                    color: '#eee',
                                    align: 'center'
                                },
                                abg: {
                                    backgroundColor: '#333',
                                    width: '100%',
                                    align: 'right',
                                    height: 25,
                                    borderRadius: [4, 4, 0, 0]
                                },
                                place: {
                                    height: 30,
                                    align: 'left',
                                    backgroundColor: {
                                        image: icons.place
                                    }
                                },
                                criminal: {
                                    height: 30,
                                    align: 'left',
                                    backgroundColor: {
                                        image: icons.criminal
                                    }
                                },
                                increase: {
                                    height: 30,
                                    align: 'left',
                                    backgroundColor: {
                                    image: icons.increase
                                    }
                                },
                                average: {
                                    height: 30,
                                    align: 'left',
                                    backgroundColor: {
                                        image: icons.average
                                    }
                                },
                                hr: {
                                    borderColor: '#777',
                                    width: '100%',
                                    borderWidth: 0.5,
                                    height: 1,
                                    align: 'left'
                                },
                                value: {
                                    color: 'black',
                                    width: 20,
                                    padding: [0, 20, 0, 30],
                                    align: 'left'
                                },
                                rate: {
                                    color: 'black',
                                    width: 40,
                                    align: 'right',
                                    padding: [0, 10, 0, 0]
                                },
                            }     
                        },
                        itemStyle: {
                            color: '#900'
                        }
                    },
                    label: {
                           
                    },
                }]
            })
        },
        average(nums) {
            return nums.reduce((a, b) => a + b) / nums.length;
        },
        loadCoordinator(){
            for(var i=0;i<mapData.features.length;i++){
                var item = mapData.features[i]
                var coords = item.geometry.coordinates[0]
                var x = this.average(coords.map(function(unit){return unit[0];}));
                var y = this.average(coords.map(function(unit){return unit[1];}));
                this.coordDict[item.properties.name] = [x, y]
            }
        },
        loadMapdata(year, type){
            var CurrentData = crinimalData[year];
            for(var i = 0; i < CurrentData.length; i++){
                var name = CurrentData[i].name;
                var coords = this.coordDict[name];
                var value = undefined;
                if(type==="犯罪案例"){
                    value = CurrentData[i].Gewal
                }else if(type==="每万人犯罪量"){
                    value = CurrentData[i].HZ
                }else{
                    value = CurrentData[i].VerP
                }
                this.threeDmapData.push({value: [coords[0],coords[1],value], 
                                        name: name,
                                        origin: {Gewal: CurrentData[i].Gewal,
                                                HZ: CurrentData[i].HZ,
                                                VerP: CurrentData[i].VerP}
                                        })
            }

        }

    },
    mounted(){
        this.loadCoordinator();
        this.loadMapdata(this.year,this.type);
        this.loadMap();
    },
    created () {
        this.dom = this.year+this.type+'3D';
        if(this.type=="犯罪变化率"){
            this.maxRange = 20
        }else if(this.type=="每万人犯罪量"){
            this.maxRange = 300
        }
    },
    watch: {
        year(oldValue, newValue){
            this.threeDmapData = []
            echarts.init(document.getElementById(this.dom)).dispose();
            this.loadMapdata(newValue,this.type);
            this.loadMap();
        }
    }
}
</script>
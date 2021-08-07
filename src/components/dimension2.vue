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
            twoDmapData: [],
            dom: '',
            maxRange : 500
        }
    },
    methods: {
        loadMap(){
            var myChart = echarts.init(document.getElementById(this.dom));
            //mapJson = require(this.mapRoot);
            echarts.registerMap('munich', mapData);
            var barData = this.twoDmapData
            myChart.setOption({
                title: {
                    text: '上巴伐利亚2019年'+this.type+'图(2D底图)',
                    subtext: '数据来自德意志联邦国家安全部门',
                    sublink: 'https://www.bka.de/EN/CurrentInformation/PoliceCrimeStatistics/policecrimestatistics_node.html'
                },
                toolbox: {
                    show: true,
                    orient: 'vertical',
                    right: '20',
                    top: 'center',
                    feature: {
                        restore: {},
                        saveAsImage: {pixelRatio: 2}
                    }
                },
                visualMap: {
                    max: this.maxRange,
                    text: ['High', 'Low'],
                    realtime: false,
                    calculable: true,
                    inRange: {
                        color: ['lightskyblue', 'yellow', 'orangered']
                    }
                },
                series:[{
                    type: 'map',
                    mapType: 'munich', // 自定义扩展图表类型
                    roam: true,
                    emphasis:{
                        label: {
                            position: 'right',
                            distance: 15,
                            show: true,
                            width: 180,
                            formatter: (params) => {
                                return ['{title|'+params.data.name+'}{abg|}',
                                '{hr|}',
                                '  {criminal|}{value|犯罪案例}{rate|'+params.data.origin.Gewal+'}',
                                '  {average|}{value|万人犯罪数}{rate|'+params.data.origin.HZ.toFixed(2)+'}',
                                '  {increase|}{value|案件增长率}{rate|'+params.data.origin.VerP.toFixed(2)+'%}'].join('\n');
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
                                    width: 20,
                                    padding: [0, 20, 0, 30],
                                    align: 'left'
                                },
                                rate: {
                                    width: 40,
                                    align: 'right',
                                    padding: [0, 10, 0, 0]
                                }
                            }        
                        },
                        itemStyle: {
                            areaColor: 'red',
                            borderWidth: 2
                        }
                    },
                    data: barData
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
        loadMapdata(year,type){
            var CurrentData = crinimalData[year];
            for(var i = 0; i < CurrentData.length; i++){
                var name = CurrentData[i].name;
                var value = undefined;
                if(type==="犯罪案例"){
                    value = CurrentData[i].Gewal
                }else if(type==="每万人犯罪量"){
                    value = CurrentData[i].HZ
                }else{
                    value = CurrentData[i].VerP
                }
                this.twoDmapData.push({
                    name: name,
                    value: value,
                    origin: {Gewal: CurrentData[i].Gewal,
                            HZ: CurrentData[i].HZ,
                            VerP: CurrentData[i].VerP}
                })
            }

        }

    },
    mounted(){
        this.loadCoordinator();
        this.loadMapdata(this.year, this.type);
        this.loadMap();
    },
    created () {
        this.dom = this.year+this.type+'2D';
        if(this.type=="犯罪变化率"){
            this.maxRange = 20
        }else if(this.type=="每万人犯罪量"){
            this.maxRange = 300
        }
    },
    watch: {
        year(oldValue, newValue){
            this.twoDmapData = []
            echarts.init(document.getElementById(this.dom)).dispose();
            this.loadMapdata(this.year,this.type);
            this.loadMap();
        }
    }
}
</script>
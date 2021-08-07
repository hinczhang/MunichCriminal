<template>
    <div id="3dmap" style="height: 80vh; width: 80vw"></div>
</template>

<script>
import * as echarts from 'echarts';
import 'echarts-gl';
import mapData from '../assets/10743.json'
export default {
    data () {
        return {

        }
    },
    methods: {
        loadMap () {

            echarts.registerMap('buildings', mapData)
            var mapChart = echarts.init(document.getElementById("3dmap"));
            var regions = mapData.features.map((feature)=>{
                return {
                    name: feature.properties.type,
                    height: feature.properties.levels,
                    value: feature.properties.levels
                }
            })

            mapChart.setOption({
                series: [{
                    type: 'map3D',
                    map: 'buildings',
                    shading: 'realistic',
                    /*realisticMaterial: {
                        roughness: 0.6,
                        textureTiling: 20,
                        detailTexture: ROOT_PATH + '/data-gl/asset/woods.jpg'
                    },*/
                    postEffect: {
                        enable: true,
                        bloom: {
                            enable: false
                        },
                        SSAO: {
                            enable: true,
                            quality: 'medium',
                            radius: 10,
                            intensity: 1.2
                        },
                        depthOfField: {
                            enable: false,
                            focalRange: 5,
                            fstop: 1,
                            blurRadius: 6
                        }
                    },
                    groundPlane: {
                        show: true,
                        color: '#333'
                    },
                    light: {
                        main: {
                            intensity: 6,
                            shadow: true,
                            shadowQuality: 'high',
                            alpha: 30
                        },
                        ambient: {
                            intensity: 0
                        },
                        /*ambientCubemap: {
                            texture: ROOT_PATH + '/data-gl/asset/canyon.hdr',
                            exposure: 2,
                            diffuseIntensity: 1,
                            specularIntensity: 1
                        }*/
                    },
                    viewControl: {
                        minBeta: -360,
                        maxBeta: 360
                    },

                    itemStyle: {
                        areaColor: '#666'
                    },

                    label: {
                        color: 'white'
                    },

                    silent: true,

                    instancing: true,

                    boxWidth: 200,
                    boxHeight: 1,

                    data: regions
                }]
            })
        }
    },
    mounted () {
        this.loadMap()
    }
    
}
</script>



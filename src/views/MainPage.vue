<template>
    <div>
        <el-col :span="20">
            <el-tabs>
                <el-tab-pane v-for=" type in tabName" :key = "type" :label="type">
                    <el-tabs type="border-card">
                        <el-tab-pane label="3D 地图">
                            <three-dimension v-bind:year="initialYear" v-bind:type="type"></three-dimension>
                        </el-tab-pane>
                        <el-tab-pane label="2D 地图">
                            <two-dimension v-bind:year="initialYear" v-bind:type="type"></two-dimension>
                        </el-tab-pane>
                    </el-tabs>              
                </el-tab-pane>
                <el-tab-pane label="数据视图">
                    <data-table v-bind:year="initialYear"></data-table>
                </el-tab-pane>
                <el-tab-pane label="3D慕尼黑">
                    <three-munich></three-munich>
                </el-tab-pane>
            </el-tabs>
        </el-col>
        <el-col :span="4">
            <el-slider
                style="position: absolute;top:10%; right:10%"
                :marks="marks"
                :format-tooltip="formatYear"
                height="900px"
                :step="20"
                show-stops
                v-model="yearValue"
                @change="onYearchange"
                vertical>
            </el-slider>
        </el-col>
    </div>
</template>

<script>
import twodimension from '../components/dimension2.vue'
import threedimension from '../components/dimension3.vue'
import datatable from '../components/datatable.vue'
import threeDMunich from '../components/threeDMunich.vue'
export default {
    components: {
        'two-dimension': twodimension, 
        'three-dimension': threedimension,
        'data-table': datatable,
        'three-munich': threeDMunich
    },
    data () {
        return {
            tabName: ['犯罪案例','每万人犯罪量','犯罪变化率'],
            years: [2014,2015,2016,2017,2018,2019],
            tabActivename: 'first',
            initialYear: '2019',
            yearValue: 100,
            marks: {0: '2014年',20: '2015年',40: '2016年',60: '2017年',80: '2018年',100: '2019年'}
        }
    },
    methods: {
        formatYear(val){
            return String(this.years[val/20])+"年"
        },
        onYearchange(index){
            this.initialYear = String(this.years[index/20])
        }
    },
    created () {
        
    }
}
</script>

<style scoped>

</style>

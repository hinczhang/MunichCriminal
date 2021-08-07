<template>
<div>
    <el-col :span="11">
    <el-table v-bind:data="tabledata" style="width: 100%" @row-click="chooseRow">
        <el-table-column prop="year" label="年份" width="100"></el-table-column>
        <el-table-column label="地区信息">
            <el-table-column
                prop="name"
                label="地区"
                width="250">
            </el-table-column>
            <el-table-column
                prop="Gewal"
                label="犯罪案例数"
                width="200">
            </el-table-column>
            <el-table-column
                prop="HZ"
                label="每万人案例数（犯罪密度）"
                width="200">
            </el-table-column>
            <el-table-column
                prop="VerP"
                label="犯罪案件变化率"
                width="200">
            </el-table-column>
        </el-table-column>
    </el-table>
    </el-col>
    <el-col :span="13">
    <div style="height: 60vh; width: 50vw; margin-top:200px" id="tableView"></div>
    </el-col>
</div>
</template>

<script>
import * as echarts from 'echarts';
import crinimalData from '../assets/data/data.json'
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
            tabledata: []
        }
    },
    methods: {
        loaddata(year){
            this.tabledata = []
            var CurrentData = crinimalData[year];
            for(var i = 0; i < CurrentData.length; i++){
                var name = CurrentData[i].name;
                this.tabledata.push({
                year: this.year,
                name: name, 
                Gewal: CurrentData[i].Gewal,
                HZ: CurrentData[i].HZ.toFixed(2),
                VerP: String(CurrentData[i].VerP.toFixed(2))+'%'}
                )
            }
        },
        chooseRow(row, column, event){
            //console.log(row, column, event)
            this.drawGraph(row.name)
        },
        drawGraph(area){
            echarts.init(document.getElementById("tableView")).dispose()
            var HZ = []
            var Gewal = []
            var VerP = []
            var xAxis = [2014,2015,2016,2017,2018,2019]
            for(var i = 0; i<xAxis.length; i++){
                var thisyear = crinimalData[String(xAxis[i])]
                for(var j = 0; j< thisyear.length; j++){
                    var item = thisyear[j]
                    if(item.name == area){
                        HZ.push(item.HZ);Gewal.push(item.Gewal);VerP.push(item.VerP);
                        break;
                    }
                }
            }
            console.log(HZ,Gewal,VerP)
            var chartDom = document.getElementById("tableView");
            var dataChart = echarts.init(chartDom);
            
            dataChart.setOption({
                title: {
                    text: area+"地区犯罪数据年度变化",
                    left: 'right',
                    align: 'right',
                    top: 0
                },
                grid: {
                    bottom: 80
                },
                toolbox: {
                    feature: {
                        dataZoom: {
                            yAxisIndex: 'none'
                        },
                        restore: {},
                        saveAsImage: {}
                    },
                    orient: 'vertical',
                    right: '20',
                    top: 'center',
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross',
                        animation: false,
                        label: {
                            backgroundColor: '#505765'
                        }
                    }
                },
                legend: {
                    data: ['犯罪案例数', '万人中犯罪量', '犯罪年变化率'],
                    left: 10
                },
                xAxis: [{
                    name: '年',
                    type: 'category',
                    data: xAxis
                }],
                yAxis:[{
                    name: '例',
                    type: 'value'
                },{
                    name: '%',
                    type: 'value'
                }],
                series: [
                    {
                        name:'犯罪案例数',
                        type: 'line',
                        data: Gewal
                    },
                    {
                        name:'万人中犯罪量',
                        type: 'line',
                        data: HZ
                    },
                    {
                        name:'犯罪年变化率',
                        type: 'line',
                        yAxisIndex: 1,
                        data: VerP

                    }
                ]
            })
        }
    },
    watch: {
        year(oldValue, newValue){
            this.loaddata(this.year);
        }
    },
    mounted () {
        this.loaddata(this.year);
        this.drawGraph("Munich Städte")
    }
}
</script>
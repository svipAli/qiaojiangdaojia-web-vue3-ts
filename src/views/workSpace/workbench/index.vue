<template>
  <lay-container fluid="true" style="padding: 10px">
    <lay-card title="可视化大数据">
      <lay-row space="30">
        <lay-col md="12" sm="9" xs="12">
          <lay-card>
            <div id="main" ref="mainPillarRef"></div>
          </lay-card>
        </lay-col>
        <lay-col md="12" sm="9" xs="12">
          <lay-card>
            <div id="main" ref="mainPillarMRef"></div>
          </lay-card>
        </lay-col>
        <lay-col md="24" sm="18" xs="24">
          <lay-card>
            <div id="main" ref="mainLineRef"></div>
          </lay-card>
        </lay-col>
      </lay-row>
    </lay-card>
  </lay-container>
</template>
<script lang="ts" setup>
import {ref, onMounted} from 'vue'
import {getClassMonthData, getWorkspaceWorkbench} from "@/api/module/workbench";
import {layer} from "@layui/layui-vue";
import * as echarts from 'echarts';

type EChartsOption = echarts.EChartsOption;
const mainLineRef = ref()
const mainPillarRef = ref()
const mainPillarMRef = ref()
const setEChartsPillarData = (data: any) => {
  const data_list = data.today
  const data_value = []
  const data_name = []
  for (let i = 0; i < data_list.length; i++) {
    data_name.push(data_list[i].title)
    data_value.push(data_list[i].value)
  }
  const chartDom = mainPillarRef.value
  const myChart = echarts.init(chartDom)
  const option: EChartsOption = {
    title: {
      text: '今日数据'
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: [
      {
        type: 'category',
        data: data_name,
        axisTick: {
          alignWithLabel: true
        }
      }
    ],
    yAxis: [
      {
        type: 'value'
      }
    ],
    series: [
      {
        name: '数量',
        type: 'bar',
        barWidth: '60%',
        data: data_value,
        label: {
          show: true,
          position: 'top',
          fontSize: 18
        }
      }
    ],
    color: '#009688'
  };
  option && myChart.setOption(option);
  const data_list_m = data.month
  const data_value_m = []
  const data_name_m = []
  for (let i = 0; i < data_list_m.length; i++) {
    data_name_m.push(data_list_m[i].title)
    data_value_m.push(data_list_m[i].value)
  }
  const chartDom_m = mainPillarMRef.value
  const myChart_m = echarts.init(chartDom_m)
  const option_m: EChartsOption = {
    title: {
      text: '本月数据'
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: [
      {
        type: 'category',
        data: data_name_m,
        axisTick: {
          alignWithLabel: true
        }
      }
    ],
    yAxis: [
      {
        type: 'value'
      }
    ],
    series: [
      {
        name: '数量',
        type: 'bar',
        barWidth: '60%',
        data: data_value_m,
        label: {
          show: true,
          position: 'top',
          fontSize: 18
        }
      },
    ],
    color: '#009688'
  };
  option_m && myChart_m.setOption(option_m);
}
const getEChartsLineData = async (data: any) => {
  let data_name = []
  for (let i = 0; i < data.data.length; i++) {
    data_name.push(data.data[i].name)
  }
  const chartDom = mainLineRef.value
  const myChart = echarts.init(chartDom)
  const option = {
    title: {
      text: '品类退货数据'
    },
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: data_name
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    toolbox: {},
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: data.day_list
    },
    yAxis: {
      type: 'value'
    },
    series: data.data
  }
  option && myChart.setOption(option);
}


const getSourceList = async () => {
  await getWorkspaceWorkbench().then(res => {
    let {code, message, data} = res
    if (code === 0) {
      setEChartsPillarData(data)
    } else {
      layer.msg(message, {icon: 2, time: 2000})
      return []
    }
  })
}

const getSourceLineData = async () => {
  await getClassMonthData().then(res => {
    let {code, message, data} = res
    if (code === 0) {
      getEChartsLineData(data)
    } else {
      layer.msg(message, {icon: 2, time: 2000})
      return []
    }
  })
}
onMounted(() => {
  getSourceList()
  getSourceLineData()
})

</script>

<style lang="less" scoped>
.statistics {
  font-size: 24px !important;
}

.statistics-body {
  padding: 10px 0;
}

#main {
  width: 100%;
  height: 350px;
}
</style>

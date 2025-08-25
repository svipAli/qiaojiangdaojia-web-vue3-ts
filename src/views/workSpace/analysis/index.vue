<template>
  <lay-container :fluid="true" style="padding: 10px">
    <lay-row :space="10">
      <lay-col :md="6" :sm="12" :xs="24">
        <lay-card>
          <template #title>PLUS-上海区域</template>
          <div class="userDistribution" ref="shanghaiRef"></div>
        </lay-card>
      </lay-col>
      <lay-col :md="6" :sm="12" :xs="24">
        <lay-card>
          <template #title>PLUS-杭州区域</template>
          <div class="userDistribution" ref="hangzhouRef"></div>
        </lay-card>
      </lay-col>
      <lay-col :md="6" :sm="12" :xs="24">
        <lay-card>
          <template #title>PLUS-南京区域</template>
          <div class="userDistribution" ref="nanjingRef"></div>
        </lay-card>
      </lay-col>
      <lay-col :md="6" :sm="12" :xs="24">
        <lay-card>
          <template #title>PLUS-常州区域</template>
          <div class="userDistribution" ref="changzhouRef"></div>
        </lay-card>
      </lay-col>
    </lay-row>
    <lay-row :space="10">
      <lay-col :md="12" :sm="12" :xs="24">
        <lay-card>
          <template #title>PLUS-工单数据总览</template>
          <div class="awData" ref="awData"></div>
        </lay-card>
      </lay-col>
      <lay-col :md="12" :sm="12" :xs="24">
        <lay-card>
          <template #title>PLUS-超时总览</template>
          <div class="awData" ref="timeOutData"></div>
        </lay-card>
      </lay-col>
    </lay-row>
    <lay-row :space="10">
      <lay-col :md="24" :sm="24" :xs="24">
        <lay-card>
          <template #title>PLUS-工程师当日工作量</template>
          <div class="awData" ref="awWorkerData"></div>
        </lay-card>
      </lay-col>

    </lay-row>
  </lay-container>
</template>
<script lang="ts" setup>
import {ref, onMounted, reactive} from 'vue'
import * as echarts from 'echarts'
import nanjing from './moudel/citys/320100.json'
import changzhou from './moudel/citys/320400.json'
import hangzhou from './moudel/citys/330100.json'
import shanghai from './moudel/province/shanghai.json'
import {apiGetAwData} from "@/api/module/analysis";

const shanghaiRef = ref()
const nanjingRef = ref()
const changzhouRef = ref()
const hangzhouRef = ref()
const awData = ref()
const awWorkerData = ref()
const timeOutData = ref()
const setAwData = (data: any) => {
  let name_list: string[] = []
  let value_list: number[] = []
  Object.keys(data).forEach(key => {
    name_list.push(key)
    value_list.push(data[key])
  });
  let awDom = awData.value
  let awEchart = echarts.init(awDom)
  let option = {
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
        data: name_list,
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
        name: 'Direct',
        type: 'bar',
        barWidth: '60%',
        data: value_list
      }
    ],
    label: {
      show: true,
      position: 'top'
    }
  };
  option && awEchart.setOption(option)
}
const setAwWorkerData = (data: any) => {
  let worker_name_list: string[] = []
  let worker_value_list: number[] = []
  Object.keys(data).forEach(key => {
    worker_name_list.push(key)
    worker_value_list.push(data[key])
  });

  let option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
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
        data: worker_name_list,
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
        name: 'Direct',
        type: 'bar',
        barWidth: '60%',
        data: worker_value_list
      }
    ],
    label: {
      show: true,
      position: 'top'
    }
  };
  let awWorkerDom = awWorkerData.value
  let awWorkerEchart = echarts.init(awWorkerDom)
  option && awWorkerEchart.setOption(option)
}
const setTimeOutData = (data: any) => {
  let data_list: any[] = []
  Object.keys(data).forEach(key => {
    data_list.push({
      name: key,
      value: data[key]
    })
  });
  let option = {
    title: {
      text: '超时总览',
      left: 'center'
    },
    tooltip: {
      trigger: 'item'
    },
    legend: {
      orient: 'vertical',
      left: 'left'
    },
    series: [
      {
        name: '超时总览',
        type: 'pie',
        radius: '50%',
        data: data_list,
        label: {
          formatter: '{b}: {c} ({d}%)'
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  };
  let timeOutDom = timeOutData.value
  let timeOutEchart = echarts.init(timeOutDom)
  option && timeOutEchart.setOption(option)

}
const setUserDistributionOption = (area: string, data: any) => {
  let userDistributionOption = {
    tooltip: {
      trigger: 'item'
    },
    dataRange: {
      x: 'left',
      y: 'bottom',
      itemWidth: 20,
      itemHeight: 14,
      splitList: [
        {start: 10, label: '>10个', color: '#3a94e5'},
        {start: 5, end: 10, label: '5-10个', color: '#68b1ec'},
        {start: 3, end: 5, label: '3-5个', color: '#9cd3f4'},
        {start: 2, end: 3, label: '2-3个', color: '#c7eefb'},
        {end: 2, label: '<2个', color: '#e1f4fc'}
      ]
    },
    roamController: {
      show: true,
      x: 'right',
      mapTypeControl: {
        shanghai: true,
      }
    },
    series: [
      {
        name: '剩余数量',
        type: 'map',
        mapType: area,
        roam: false,
        itemStyle: {
          emphasis: {label: {show: true}}
        },
        data: data
      }
    ]
  }
  if (area === 'shanghai') {
    let userDistributionDom = shanghaiRef.value
    echarts.registerMap('shanghai', shanghai as any)
    let userDistributionDomChart = echarts.init(userDistributionDom)
    userDistributionOption &&
    userDistributionDomChart.setOption(userDistributionOption)
  } else if (area === 'changzhou') {
    let userDistributionDom = changzhouRef.value
    echarts.registerMap('changzhou', changzhou as any)
    let userDistributionDomChart = echarts.init(userDistributionDom)
    userDistributionOption &&
    userDistributionDomChart.setOption(userDistributionOption)
  } else if (area === 'hangzhou') {
    let userDistributionDom = hangzhouRef.value
    echarts.registerMap('hangzhou', hangzhou as any)
    let userDistributionDomChart = echarts.init(userDistributionDom)
    userDistributionOption &&
    userDistributionDomChart.setOption(userDistributionOption)
  } else if (area === 'nanjing') {
    let userDistributionDom = nanjingRef.value
    echarts.registerMap('nanjing', nanjing as any)
    let userDistributionDomChart = echarts.init(userDistributionDom)
    userDistributionOption &&
    userDistributionDomChart.setOption(userDistributionOption)
  }
}
const getAwData = async () => {
  await apiGetAwData().then((res) => {
    let {data} = res
    let area_count_data = data.area_count_data
    setUserDistributionOption('shanghai', area_count_data.shanghai)
    setUserDistributionOption('hangzhou', area_count_data.hangzhou)
    setUserDistributionOption('changzhou', area_count_data.changzhou)
    setUserDistributionOption('nanjing', area_count_data.nanjing)
    setAwData(data.incident_status_data)
    setAwWorkerData(data.worker_data)
    setTimeOutData(data.time_out_data)
  })
}
const setTimeOutDo = () => {
  setInterval(getAwData, 10000)
}
onMounted(() => {
  getAwData()
  setTimeOutDo()
})

</script>

<style lang="less" scoped>
.userDistribution {
  width: 100%;
  height: 540px;
}

.awData {
  width: 100%;
  height: 300px;
}

</style>

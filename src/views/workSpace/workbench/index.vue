<template>
  <lay-container fluid="true" style="padding: 10px">
    <lay-row space="10">
      <lay-col md="24" sm="18" xs="24">
        <lay-row space="10">
          <lay-col :md="6" :sm="6" :xs="12" v-for="item in sourceList">
            <lay-card class="statistics">
              <template #title>{{ item.title }}</template>
              <div class="statistics-body">
                <lay-count-up :startVal="0" :endVal="item.value" :duration="1000"></lay-count-up>
              </div>
            </lay-card>
          </lay-col>
        </lay-row>
      </lay-col>
    </lay-row>
  </lay-container>
</template>
<script lang="ts" setup>
import {ref, onMounted} from 'vue'
import {getWorkbench} from "@/api/module/workbench";
import {layer} from "@layui/layui-vue";

const sourceList = ref()

const getSourceList = async () => {
  await getWorkbench().then(res => {
    let {code, message, data} = res
    if (code === 0) {
      sourceList.value = data
    } else {
      layer.msg(message, {icon: 2, time: 2000})
    }
  })
}
onMounted(() => {
  getSourceList()
})

</script>

<style lang="less" scoped>
.statistics {
  font-size: 24px !important;
}

.statistics-body {
  padding: 10px 0;
}
</style>

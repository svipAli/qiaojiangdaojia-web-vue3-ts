<template>
  <lay-container fluid="true" class="user-box">
    <lay-card>
      <lay-form style="margin-top: 10px" @keyup.enter="toSearch">
        <lay-row :space="30">
          <lay-col :md="5">
            <lay-form-item label="配件型号" label-width="80">
              <lay-input
                  v-model="query.part_model"
                  :allow-clear="true"
                  style="width: 98%"
              ></lay-input>
            </lay-form-item>
          </lay-col>
          <lay-col :md="5">
            <lay-form-item label="配件名称" label-width="80">
              <lay-input
                  v-model="query.part_name"
                  :allow-clear="true"
                  style="width: 98%"
              ></lay-input>
            </lay-form-item>
          </lay-col>
          <lay-col :md="4">
            <lay-form-item label-width="20">
              <lay-button
                  style="margin-left: 20px"
                  type="primary"
                  @click="toSearch"
              >
                查询
              </lay-button>
              <lay-button @click="toReset"> 重置</lay-button>
            </lay-form-item>
          </lay-col>
        </lay-row>
      </lay-form>
    </lay-card>
    <lay-card>
      <lay-table
          height="650px"
          :columns="columns"
          :loading="loading"
          :data-source="dataSource"
          :default-toolbar="true"
          v-model:selectedKeys="selectedKeys">
        <template #toolbar>
          <lay-button type="primary" size="sm" @click="exportInventory">
            <lay-icon class="layui-icon-table"></lay-icon>
            导出库存
          </lay-button>
        </template>
        <template #update_time="{ data }">
          {{ convertTime(data.update_time) }}
        </template>
        <template #total_price="{ data }">
          {{ (data.count * data.purchase_price).toFixed(2) }}
        </template>
      </lay-table>
    </lay-card>
  </lay-container>
</template>
<script setup lang="ts">
import {onMounted, reactive, ref} from 'vue'
import {layer} from "@layui/layui-vue";
import {apiExportInventory, apiGetInventoryPart} from "@/api/module/warehouse-inventory";
import {getInventoryPartBody} from "@/types/warehouse-inventory";
import {convertTime} from "@/utils/globalFunctions";

defineOptions({
  name: 'WarehouseInventory',
})

const totalRowMethod = (item: any, list: any) => {
  let total = 0
  for (let i = 0; i < list.length; i++) {
    total += list[i].count * list[i].purchase_price
  }
  return total.toFixed(2)
}
const columns = ref([
  {title: '选项', width: '60px', type: 'checkbox', fixed: 'left'},
  {title: 'ID', width: '80px', key: 'id', sort: 'desc', fixed: 'left'},
  {title: '配件型号', width: '180px', key: 'part_model', sort: 'desc'},
  {title: '配件名称', width: '250px', key: 'part_name', sort: 'desc'},
  {title: '库存数量', width: '200px', key: 'count', sort: 'desc', align: 'center'},
  {title: '采购价格', width: '150px', key: 'purchase_price', sort: 'desc', align: 'center'},
  {title: '销售价格', width: '150px', key: 'sale_price', sort: 'desc', align: 'center'},
  {
    title: '库存金额合计',
    width: '150px',
    key: 'total_price',
    sort: 'desc',
    align: 'center',
    customSlot: 'total_price',
    totalRow: true,
    totalRowMethod: totalRowMethod,
  },
  {title: '最近更新时间', width: '200px', key: 'update_time', sort: 'desc', customSlot: 'update_time'},
  {title: '更新人', width: '150px', key: 'update_user_name', sort: 'desc'},
])
const loading = ref(false)
const dataSource = ref()
const selectedKeys = ref<number[]>([])
const page = reactive({current: 1, limit: 100, total: 0})

const query = ref({
  part_model: '',
  part_name: '',
})

const toSearch = () => {
  queryDataSource()
}
const toReset = () => {
  query.value = {
    part_model: '',
    part_name: '',
  }
}

// 定义一个名为downloadBlob的函数，该函数接受一个Blob对象的内容和文件名作为参数，用于下载文件
const downloadBlob = (content: any, fileName: any) => {
  // 创建一个新的Blob对象，其内容为传入的Blob对象的内容
  const blob = new Blob([content])
  // 创建一个隐藏的a元素，用于模拟点击下载文件
  const a = document.createElement('a')
  // 设置下载的文件名为传入的fileName
  a.download = fileName
  // 将a元素隐藏起来
  a.style.display = 'none'
  // 将Blob对象转换为URL，作为a元素的href属性，实现下载功能
  a.href = URL.createObjectURL(blob)
  // 将a元素添加到文档的body中
  document.body.appendChild(a)
  // 模拟点击a元素，触发浏览器的下载功能
  a.click()
  // 释放URL.createObjectURL()创建的URL对象，避免内存泄漏
  URL.revokeObjectURL(a.href)
  // 从文档的body中移除a元素
  document.body.removeChild(a)
}

const exportInventory = async () => {
  await apiExportInventory().then((res) => {
    let timestamp = new Date().getTime()
    downloadBlob(res, `【${convertTime(timestamp)}】配件库存导出.csv`)
  })
}

const queryDataSource = async () => {
  loading.value = true
  let data: getInventoryPartBody = {
    part_model: query.value.part_model,
    part_name: query.value.part_name,
    page: page.current,
    limit: page.limit,
  }
  await apiGetInventoryPart(data).then((res: Result) => {
    let {code, data, message} = res
    if (code === 0) {
      dataSource.value = data
    } else {
      layer.msg(message, {icon: 3, time: 2000})
    }
  })
  loading.value = false
}

onMounted(() => {
  queryDataSource()
})
</script>
<style scoped>
.user-box {
  height: calc(100vh - 110px);
  margin-top: 10px;
  box-sizing: border-box;
  overflow: auto;
}
</style>
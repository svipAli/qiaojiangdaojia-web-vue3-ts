<template>
  <lay-container fluid="true" class="user-box">
    <lay-card>
      <lay-form style="margin-top: 10px" @keyup.enter="toSearch">
        <lay-row :space="30">
          <lay-col :md="5">
            <lay-form-item label="托盘号" label-width="80">
              <lay-input
                  v-model="query.tray_no"
                  :allow-clear="true"
                  style="width: 98%"
              ></lay-input>
            </lay-form-item>
          </lay-col>
          <lay-col :md="4">
            <lay-form-item label="状态" label-width="80">
              <lay-select v-model="query.status" style="width: 120px">
                <lay-select-option :value="0" label="待维修"></lay-select-option>
                <lay-select-option :value="1" label="维修中"></lay-select-option>
                <lay-select-option :value="2" label="维修完成"></lay-select-option>
              </lay-select>
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
          <lay-button type="primary" size="sm" @click="changeVisible('新增')">
            <lay-icon class="layui-icon-addition"></lay-icon>
            新增
          </lay-button>
          <lay-button size="sm" type="danger" @click="toRemove">
            <lay-icon class="layui-icon-delete"></lay-icon>
            删除
          </lay-button>
        </template>
        <template v-slot:operator="{ row }">
          <lay-button size="xs" type="primary" @click="changeVisible2(row)">配置</lay-button>
          <lay-button size="xs" type="primary" @click="exportTrayPart(row)">导出配件</lay-button>
          <lay-popconfirm
              content="确定要删除吗?"
              @confirm="delTray([row.id])"
          >
            <lay-button size="xs" type="danger">删除</lay-button>
          </lay-popconfirm>
        </template>
        <template #status="{ data }">
          {{ getStatus(data.status) }}
        </template>
        <template #create_time="{ data }">
          {{ convertTime(data.create_time) }}
        </template>
        <template #update_time="{ data }">
          {{ convertTime(data.update_time) }}
        </template>
        <template #predict_complete_time="{ data }">
          {{ convertTime(data.predict_complete_time) }}
        </template>
        <template #purchase_time="{ data }">
          {{ convertTime(data.purchase_time) }}
        </template>
        <template #arrived_time="{ data }">
          {{ convertTime(data.arrived_time) }}
        </template>
        <template #complete_time="{ data }">
          {{ convertTime(data.complete_time) }}
        </template>
      </lay-table>
    </lay-card>
  </lay-container>
  <lay-layer v-model="visible" :title="title" :area="['400px', '500px']">
    <div style="padding: 20px">
      <lay-form :model="model">
        <lay-form-item label="托盘号" prop="tray_no">
          <lay-input v-model="model.tray_no"></lay-input>
        </lay-form-item>
        <lay-form-item label="备注" prop="back_reason">
          <lay-textarea
              v-model="model.remark"
          ></lay-textarea>
        </lay-form-item>
      </lay-form>
      <div style="width: 100%; text-align: center">
        <lay-button size="sm" type="primary" @click="toSubmit"
        >保存
        </lay-button
        >
        <lay-button size="sm" @click="toCancel">取消</lay-button>
      </div>
    </div>
  </lay-layer>
  <lay-layer v-model="visible2" title="托盘配置" :area="['400px', '330px']">
    <div style="padding: 20px;">
      <lay-form :model="config_model">
        <lay-form-item label="预计完成时间" prop="predict_complete_time">
          <lay-date-picker type="datetime" v-model="config_model.predict_complete_time" allow-clear></lay-date-picker>
        </lay-form-item>
        <lay-form-item label="配件采购时间" prop="predict_complete_time">
          <lay-date-picker type="datetime" v-model="config_model.purchase_time" allow-clear></lay-date-picker>
        </lay-form-item>
        <lay-form-item label="配件到货时间" prop="predict_complete_time">
          <lay-date-picker type="datetime" v-model="config_model.arrived_time" allow-clear></lay-date-picker>
        </lay-form-item>
        <lay-form-item label="     ">
          <lay-button type="primary" @click="submitConfig">保存</lay-button>
        </lay-form-item>
      </lay-form>
    </div>
  </lay-layer>
</template>
<script setup lang="ts">
import {onMounted, ref} from 'vue'
import {layer} from "@layui/layui-vue";
import {convertTime} from "@/utils/globalFunctions";
import {addTrayBody, exportTrayPartBody, getTrayQueryBody, updateTrayConfigBody} from "@/types/warehouse-tray";
import {
  apiAddTray,
  apiDelTray,
  apiExportTrayPart,
  apiQueryTray,
  apiUpdateTrayConfig
} from "@/api/module/warehouse-tray";

defineOptions({
  name: 'WarehouseTray'
})
const columns = ref([
  {title: '选项', width: '60px', type: 'checkbox', fixed: 'left'},
  {title: 'ID', width: '100px', key: 'id', sort: 'desc', fixed: 'left'},
  {title: '状态', width: '100px', key: 'status', sort: 'desc', customSlot: 'status', fixed: 'left'},
  {title: '托盘号', width: '250px', key: 'tray_no', sort: 'desc'},
  {title: '次品数量', width: '100px', key: 'back_product_count'},
  {title: '配件数量', width: '100px', key: 'back_product_part_count'},
  {title: '配件金额', width: '100px', key: 'back_product_part_price'},
  {
    title: '预计维修完成时间',
    width: '160px',
    key: 'predict_complete_time',
    sort: 'desc',
    customSlot: 'predict_complete_time'
  },
  {title: '实际维修完成时间', width: '160px', key: 'complete_time', sort: 'desc', customSlot: 'complete_time'},
  {title: '配件开始采购时间', width: '160px', key: 'purchase_time', sort: 'desc', customSlot: 'purchase_time'},
  {title: '配件全部到货时间', width: '160px', key: 'arrived_time', sort: 'desc', customSlot: 'arrived_time'},
  {title: '更新时间', width: '160px', key: 'update_time', sort: 'desc', customSlot: 'update_time'},
  {title: '更新人', width: '120px', key: 'update_user_name', sort: 'desc'},
  {title: '创建时间', width: '160px', key: 'create_time', sort: 'desc', customSlot: 'create_time'},
  {title: '创建人', width: '120px', key: 'create_user_name', sort: 'desc'},
  {
    title: '操作',
    width: '170px',
    customSlot: 'operator',
    key: 'operator',
    fixed: 'right'
  }
])

const getStatus = (status: number) => {
  switch (status) {
    case 0:
      return '待维修'
    case 1:
      return '维修中'
    case 2:
      return '维修完成'
    default:
      return ''
  }
}
const loading = ref(false)
const dataSource = ref()
const selectedKeys = ref<number[]>([])
const visible = ref(false)
const title = ref('')

const model = ref({
  tray_no: '',
  remark: ''
})
const visible2 = ref(false)
const config_model = ref({
  predict_complete_time: '',
  purchase_time: '',
  arrived_time: '',
})
const changeVisible2 = (row: any) => {
  visible2.value = !visible2.value
  currentRow.value = row
  config_model.value = {
    predict_complete_time: convertTime(row.predict_complete_time),
    purchase_time: convertTime(row.purchase_time),
    arrived_time: convertTime(row.arrived_time),
  }
}

const submitConfig = async () => {
  let data: updateTrayConfigBody = {
    id: currentRow.value.id,
    predict_complete_time: config_model.value.predict_complete_time,
    purchase_time: config_model.value.purchase_time,
    arrived_time: config_model.value.arrived_time
  }
  await apiUpdateTrayConfig(data).then(res => {
    let {code, message} = res
    if (code === 0) {
      layer.msg(message)
      visible2.value = false
      queryDataSource()
    } else {
      layer.msg(message, {icon: 2, time: 2000})
    }
  })
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

const exportTrayPart = async (row: any) => {
  let data: exportTrayPartBody = {
    id: row.id,
  }
  await apiExportTrayPart(data).then(res => {
    downloadBlob(res, `【托盘】${row.tray_no}配件明细导出.csv`)
  })
}

const resetModel = () => {
  model.value = {
    tray_no: '',
    remark: ''
  }
}
const currentRow = ref()
const query = ref({
  tray_no: '',
  status: 0
})
const changeVisible = (curr_title: string) => {
  title.value = curr_title
  if (curr_title === '新增') {
    resetModel()
    currentRow.value = {}
  }
  visible.value = !visible.value
}

const addTray = async () => {
  let data: addTrayBody = model.value
  await apiAddTray(data).then(res => {
    let {code, message} = res
    if (code === 0) {
      layer.msg(message)
      visible.value = false
      queryDataSource()
    }
  })
}
const toSearch = () => {
  queryDataSource()
}
const toReset = () => {
  query.value = {
    tray_no: '',
    status: -1
  }
}

const queryDataSource = async () => {
  loading.value = true
  let data: getTrayQueryBody = {
    tray_no: query.value.tray_no,
    status: query.value.status
  }
  await apiQueryTray(data).then((res: Result) => {
    let {code, data, message} = res
    if (code === 0) {
      dataSource.value = data
      selectedKeys.value = []
    } else {
      layer.msg(message, {icon: 3, time: 2000})
    }
  })
  loading.value = false
}

const delTray = async (id_list: Array<number>) => {
  await apiDelTray(id_list).then((res: Result) => {
    let {code, message} = res
    if (code === 0) {
      layer.msg(message, {icon: 1, time: 1000})
      queryDataSource()
    }
  })
}

const toRemove = () => {
  if (selectedKeys.value.length === 0) {
    layer.msg('请选择要删除的托盘', {icon: 3, time: 2000})
    return
  }
  layer.confirm('确定要删除吗?', {
    title: '提示',
    icon: 3,
    yes: (index: number) => {
      delTray(selectedKeys.value)
      layer.close(index)
    }
  })
}

const toSubmit = () => {
  if (title.value === '新增') {
    addTray()
  }
}

const toCancel = () => {
  visible.value = !visible.value
  resetModel()
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
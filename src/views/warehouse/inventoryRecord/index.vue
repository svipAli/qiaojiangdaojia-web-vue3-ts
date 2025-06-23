<template>
  <lay-container fluid="true" class="user-box">
    <lay-card>
      <lay-form style="margin-top: 10px" @keyup.enter="toSearch">
        <lay-row :space="30">
          <lay-col :md="5">
            <lay-form-item label="库存单据" label-width="80">
              <lay-input
                  v-model="query.record_no"
                  :allow-clear="true"
              ></lay-input>
            </lay-form-item>
          </lay-col>
          <lay-col :md="5">
            <lay-form-item label="单据类型" label-width="80">
              <lay-select v-model="query.type" style="width: 150px">
                <lay-select-option :value="0" label="全部"></lay-select-option>
                <lay-select-option :value="1" label="入库单"></lay-select-option>
                <lay-select-option :value="-1" label="出库单"></lay-select-option>
                <lay-select-option :value="2" label="调整单"></lay-select-option>
              </lay-select>
            </lay-form-item>
          </lay-col>
          <lay-col :md="5">
            <lay-form-item label="单据状态" label-width="80">
              <lay-select v-model="query.status" style="width: 150px">
                <lay-select-option :value="-1" label="全部"></lay-select-option>
                <lay-select-option :value="0" label="待处理"></lay-select-option>
                <lay-select-option :value="1" label="待审核"></lay-select-option>
                <lay-select-option :value="2" label="已完成"></lay-select-option>
              </lay-select>
            </lay-form-item>
          </lay-col>
          <lay-col :md="6">
            <lay-form-item label="创建时间" label-width="80">
              <lay-date-picker
                  :simple="true"
                  v-model="query.create_time"
                  :range="true"
                  :allow-clear="true"
                  style="width: 250px"
              ></lay-date-picker>
            </lay-form-item>
          </lay-col>
          <lay-col :md="6">
            <lay-form-item label="更新时间" label-width="80">
              <lay-date-picker
                  :simple="true"
                  v-model="query.update_time"
                  :range="true"
                  :allow-clear="true"
                  style="width: 250px"
              ></lay-date-picker>
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
          height="600px"
          :page="page"
          :columns="columns"
          :loading="loading"
          :data-source="dataSource"
          :default-toolbar="true"
          v-model:selectedKeys="selectedKeys"
          @change="queryDataSource"
      >
        <template #toolbar>
          <lay-button type="primary" size="sm" @click="changeAddRecord('新增',null)">
            <lay-icon class="layui-icon-addition"></lay-icon>
            新增
          </lay-button>
          <lay-button type="danger" size="sm" @click="removeRecordConfirm(selectedKeys)">
            <lay-icon class="layui-icon-delete"></lay-icon>
            删除
          </lay-button>
        </template>
        <template v-slot:operator="{ row }">
          <lay-button
              size="xs"
              type="primary"
              @click="changeVisible('导入配件', row)"
          >导入配件
          </lay-button
          >
          <lay-button
              size="xs"
              type="normal"
              @click="changeVisible('配件明细', row)"
          >配件明细
          </lay-button
          >
          <lay-button
              size="xs"
              type="danger"
              @click="removeRecordConfirm([row.id])"
          >删除
          </lay-button
          >
        </template>
        <template #status="{ data }">
          {{ getStatus(data.status) }}
        </template>
        <template #type="{ data }">
          {{ getType(data.type) }}
        </template>
        <template #create_time="{ data }">
          {{ convertTime(data.create_time) }}
        </template>
        <template #update_time="{ data }">
          {{ convertTime(data.update_time) }}
        </template>
      </lay-table>
    </lay-card>
  </lay-container>
  <lay-layer v-model="addRecordVisible" :title="title" :area="['400px', '180px']">
    <div style="padding: 20px">
      <lay-form :model="model">
        <lay-form-item label="单据类型" label-width="80">
          <lay-select v-model="model.type">
            <lay-select-option :value="1" label="入库单"></lay-select-option>
            <lay-select-option :value="-1" label="出库单"></lay-select-option>
          </lay-select>
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
  <lay-layer v-model="partVisible" title="导入配件" :area="['260px', '200px']">
    <lay-upload
        :drag="true"
        :url="upLoadUrl"
        acceptMime="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,.csv, text/csv"
        :size="10485760"
        :headers="headers"
        @done="uploadDone"
        @error="uploadError"
    ></lay-upload>
  </lay-layer>
  <lay-layer v-model="partDetailVisible" title="配件明细" :area="['1400px', '800px']">
    <lay-card>
      <lay-table
          :height="'670px'"
          :columns="columns2"
          :loading="loading2"
          :default-toolbar="true"
          :data-source="dataSource2"
          v-model:selected-keys="selectedKeys2"
      >
        <template v-slot:toolbar>
          <lay-button size="sm" type="danger" @click="inventoryPartRemove(selectedKeys2)">
            <lay-icon class="layui-icon-delete"></lay-icon>
            删除
          </lay-button>
        </template>
        <template v-slot:operator="{ row }">
          <lay-button size="xs" type="danger" @click="inventoryPartRemove([row.id])"
          >删除
          </lay-button>
        </template>
        <template #total_price="{ data }">
          {{ (data.count * data.purchase_price).toFixed(2) }}
        </template>
        <template #count="{ row }">
          <lay-input-number v-model="row.count" :min="0" @change="changeInventoryPartCount(row)"/>
        </template>
      </lay-table>
      <lay-button style="margin-top: 10px" size="sm" type="primary" @click="passTheAuditConfirm">审核通过</lay-button>
    </lay-card>
  </lay-layer>
</template>
<script setup lang="ts">
import {onMounted, reactive, ref} from 'vue'
import {layer} from "@layui/layui-vue";
import {convertTime} from "@/utils/globalFunctions";
import {config} from '@/api/http'
import {
  addInventoryRecordBody, delInventoryPartBody, delInventoryRecordBody,
  getInventoryRecordBody, passTheAuditBody,
  setInventoryPartCountBody
} from "@/types/warehouse-inventoryrecord";
import {
  apiAddInventoryRecord, apiDelInventoryPartDetail, apiDelInventoryRecord,
  apiGetInventoryRecordDetail,
  apiInventoryRecordQuery, apiPassTheAudit, apiSetInventoryPartCount
} from "@/api/module/warehouse-inventoryrecord";
import {useUserStore} from "@/store/user";
import {Result} from "@/types/result";

defineOptions({
  name: 'WarehouseInventoryRecord',
})


const upLoadUrl = ref('')
const headers = {
  'Authorization': useUserStore().token
}

const removeRecordConfirm = (id_list: Array<number>) => {
  layer.confirm('确定要删除库存单据吗?', {
    title: '提示',
    icon: 3,
    yes: (index: number) => {
      removeRecord(id_list)
      layer.close(index)
    }
  })
}

const removeRecord = async (id_list: Array<number>) => {
  let data: delInventoryRecordBody = {
    id_list: id_list
  }
  await apiDelInventoryRecord(data).then((res: Result) => {
    let {code, message} = res
    if (code === 0) {
      layer.msg(message)
      queryDataSource()
    } else {
      layer.msg(message, {icon: 2, time: 2000})
    }
  })
}

const passTheAudit = async () => {
  let data: passTheAuditBody = {
    id: currentRow.value.id
  }
  await apiPassTheAudit(data).then((res: Result) => {
    let {code, message} = res
    if (code === 0) {
      layer.msg(message)
      partDetailVisible.value = false
      queryDataSource()
    } else {
      layer.msg(message, {icon: 2, time: 2000})
    }
  })
}

const passTheAuditConfirm = () => {
  layer.confirm('确定要审核通过吗?', {
    title: '提示',
    icon: 3,
    yes: (index: number) => {
      passTheAudit()
      layer.close(index)
    }
  })
}
const uploadDone = (result: any) => {
  let data = JSON.parse(result.data)
  if (data.code === 0) {
    layer.msg(data.message, {icon: 1, time: 1000})
    partVisible.value = false
    queryDataSource()
  } else {
    layer.msg(data.message, {icon: 3, time: 2000})
  }
}
const uploadError = (result: any) => {
  layer.msg(result.msg, {icon: 3, time: 2000})
}


const getStatus = (status: number) => {
  switch (status) {
    case 0:
      return '待处理'
    case 1:
      return '待审核'
    case 2:
      return '已完成'
    default:
      return '未知'
  }
}

const getType = (type: number) => {
  switch (type) {
    case 1:
      return '入库单'
    case -1:
      return '出库单'
    case 2:
      return '调整单'
    default:
      return '未知'
  }
}
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
  {title: '单据编号', width: '180px', key: 'record_no', sort: 'desc'},
  {title: '单据类型', width: '100px', key: 'type', sort: 'desc', customSlot: 'type'},
  {title: '单据状态', width: '160px', key: 'status', sort: 'desc', customSlot: 'status'},
  {title: '更新时间', width: '160px', key: 'update_time', sort: 'desc', customSlot: 'update_time'},
  {title: '更新人', width: '120px', key: 'update_user_name', sort: 'desc'},
  {title: '创建时间', width: '160px', key: 'create_time', sort: 'desc', customSlot: 'create_time'},
  {title: '创建人', width: '120px', key: 'create_user_name', sort: 'desc'},
  {
    title: '操作',
    width: '180px',
    customSlot: 'operator',
    key: 'operator',
    fixed: 'right'
  }
])
const columns2 = ref([
  {title: '选项', width: '60px', type: 'checkbox'},
  {title: 'ID', width: '100px', key: 'id', hide: true},
  {title: '配件名称', width: '150px', key: 'part_name'},
  {title: '配件型号', width: '150px', key: 'part_model'},
  {title: '配件单价', width: '100px', key: 'purchase_price', align: 'center'},
  {title: '配件数量', width: '100px', key: 'count', customSlot: 'count'},
  {
    title: '配件总价',
    width: '100px',
    key: 'total_price',
    customSlot: 'total_price',
    totalRow: true,
    totalRowMethod: totalRowMethod,
    align: 'center'
  },
  {
    title: '备注', width:
        '160px', key:
        'remark'
  }
  ,
  {
    title: '操作',
    width:
        '80px',
    customSlot:
        'operator',
    key:
        'operator',
    fixed:
        'right'
  }
])

const loading = ref(false)
const loading2 = ref(false)
const dataSource = ref()
const dataSource2 = ref()
const selectedKeys = ref<number[]>([])
const selectedKeys2 = ref<number[]>([])
const title = ref('')
const page = reactive({current: 1, limit: 10, total: 0})
const partVisible = ref(false)
const partDetailVisible = ref(false)
const currentRow = ref()
const query = ref({
  record_no: '',
  type: 0,
  status: -1,
  create_time: [],
  update_time: [],
})

const model = ref({
  type: 1,
})
const changeInventoryPartCount = async (row: any) => {
  if (row.type === 2) {
    layer.msg('库存单价已完成，不可修改数量！', {icon: 2, time: 2000})
  }
  let data: setInventoryPartCountBody = {
    part_id: row.id,
    count: row.count
  }
  await apiSetInventoryPartCount(data).then((res: Result) => {
    let {code, message} = res
    if (code === 0) {
      layer.msg('设置成功', {icon: 1, time: 2000})
      loadDataSource2()
    } else {
      layer.msg(message, {icon: 2, time: 2000})
    }
  })
}

const loadDataSource2 = async () => {
  loading2.value = true
  await apiGetInventoryRecordDetail({id: currentRow.value.id}).then((res: Result) => {
    let {code, data, message} = res
    if (code === 0) {
      dataSource2.value = data
    } else {
      layer.msg(message, {icon: 2, time: 2000})
    }
  })
  loading2.value = false
}
const addRecordVisible = ref(false)
const changeAddRecord = (title: string, row: any) => {
  if (title === '编辑') {

  }
  addRecordVisible.value = !addRecordVisible.value
}
const changeVisible = (curr_title: string, row: any) => {
  title.value = curr_title
  currentRow.value = row
  if (curr_title === '导入配件') {
    upLoadUrl.value = `${config.baseURL}/upload_inventory_excel?id=${row.id}`
    partVisible.value = !partVisible.value
  } else if (curr_title === '配件明细') {
    partDetailVisible.value = !partDetailVisible.value
    loadDataSource2()
  }
}

const toSearch = () => {
  page.current = 1
  queryDataSource()
}
const toReset = () => {
  query.value = {
    record_no: '',
    type: 0,
    status: -1,
    create_time: [],
    update_time: [],
  }
}

const toSubmit = async () => {
  let data: addInventoryRecordBody = {
    type: model.value.type
  }
  await apiAddInventoryRecord(data).then((res: Result) => {
    let {code, message} = res
    if (code === 0) {
      layer.msg('添加成功', {icon: 1, time: 2000})
      addRecordVisible.value = !addRecordVisible.value
      queryDataSource()
    } else {
      layer.msg(message, {icon: 2, time: 2000})
    }
  })
}

const queryDataSource = async () => {
  loading.value = true
  let data: getInventoryRecordBody = {
    record_no: query.value.record_no,
    type: query.value.type,
    status: query.value.status,
    create_time: query.value.create_time,
    update_time: query.value.update_time,
    page: page.current,
    limit: page.limit,
  }
  await apiInventoryRecordQuery(data).then((res: DataResult) => {
    let {code, data, total, message} = res
    if (code === 0) {
      dataSource.value = data
      page.total = total
    } else {
      layer.msg(message, {icon: 2, time: 2000})
      loading.value = false
    }
  })
  loading.value = false
}

const inventoryPartRemove = (id_list: Array<number>) => {
  layer.confirm('确定要删除吗?', {
    title: '提示',
    icon: 3,
    yes: (index: number) => {
      backPartRemove(id_list)
      layer.close(index)
    }
  })
} // 删除配件
const backPartRemove = async (id_list: Array<number>) => {
  let data: delInventoryPartBody = {
    id: currentRow.value.id,
    part_list: id_list
  } // 构建请求数据
  await apiDelInventoryPartDetail(data).then((res: Result) => {
    let {code, message} = res
    if (code === 0) {
      layer.msg(message, {icon: 1, time: 1000})
      loadDataSource2()
    } else {
      layer.msg(message, {icon: 2, time: 2000})
    }
  })
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
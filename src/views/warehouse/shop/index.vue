<template>
  <lay-container fluid="true" class="user-box">
    <lay-card>
      <lay-form style="margin-top: 10px" @keyup.enter="toSearch">
        <lay-row :space="30">
          <lay-col :md="8">
            <lay-form-item label="店铺名称" label-width="80">
              <lay-input
                  v-model="query.name"
                  :allow-clear="true"
                  style="width: 98%"
              ></lay-input>
            </lay-form-item>
          </lay-col>
          <lay-col :md="5">
            <lay-form-item label="溯源码标志" label-width="80">
              <lay-input
                  v-model="query.code_str"
                  :allow-clear="true"
                  style="width: 98%"
              ></lay-input>
            </lay-form-item>
          </lay-col>
          <lay-col :md="4">
            <lay-form-item label="状态" label-width="80">
              <lay-select v-model="query.status" style="width: 120px">
                <lay-select-option :value="-1" label="全部"></lay-select-option>
                <lay-select-option :value="0" label="已启用"></lay-select-option>
                <lay-select-option :value="1" label="已禁用"></lay-select-option>
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
          <lay-button type="primary" size="sm" @click="changeVisible('新增',false)">
            <lay-icon class="layui-icon-addition"></lay-icon>
            新增
          </lay-button>
          <lay-button size="sm" type="danger" @click="toRemove">
            <lay-icon class="layui-icon-delete"></lay-icon>
            删除
          </lay-button>
        </template>
        <template v-slot:operator="{ row }">
          <lay-button
              size="xs"
              type="primary"
              @click="changeVisible('编辑', row)"
          >编辑
          </lay-button
          >
          <lay-popconfirm
              content="确定要删除吗?"
              @confirm="delShop([row.id])"
          >
            <lay-button size="xs" type="danger"
            >删除
            </lay-button
            >
          </lay-popconfirm>
        </template>
        <template #create_time="{ data }">
          {{ convertTime(data.create_time) }}
        </template>
        <template #update_time="{ data }">
          {{ convertTime(data.update_time) }}
        </template>
        <template #status="{ row }">
          <lay-switch :model-value="!row.status" @change="changeShopStatus($event,row)"></lay-switch>
        </template>
      </lay-table>
    </lay-card>
  </lay-container>
  <lay-layer v-model="visible" :title="title" :area="['500px', '250px']">
    <div style="padding: 20px">
      <lay-form :model="model">
        <lay-form-item label="店铺名称" prop="order_no">
          <lay-input v-model="model.name"></lay-input>
        </lay-form-item>
        <lay-form-item label="溯源码标志" prop="order_no">
          <lay-input v-model="model.code_str"></lay-input>
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
</template>
<script setup lang="ts">
import {onMounted, ref} from 'vue'
import {
  apiAddShop,
  apiChangeShopStatus,
  apiDelShop,
  apiEditAddShop,
  apiQueryShop,
} from "@/api/module/shop";
import {addShopBody, editShopBody, getShopQueryBody} from "@/types/shop";
import {layer} from "@layui/layui-vue";
import {convertTime} from "@/utils/globalFunctions";
import {changeRoleStatusBody} from "@/types/role";

defineOptions({
  name: 'WarehouseShop'
})
const columns = ref([
  {title: '选项', width: '60px', type: 'checkbox', fixed: 'left'},
  {title: 'ID', width: '100px', key: 'id', sort: 'desc', fixed: 'left'},
  {title: '启用状态', width: '100px', key: 'status', sort: 'desc', customSlot: 'status', fixed: 'left'},
  {title: '店铺名称', width: '250px', key: 'name'},
  {title: '溯源码标志', width: '160px', key: 'code_str'},
  {title: '更新时间', width: '160px', key: 'update_time', sort: 'desc', customSlot: 'update_time'},
  {title: '更新人', width: '120px', key: 'update_user_name', sort: 'desc'},
  {title: '创建时间', width: '160px', key: 'create_time', sort: 'desc', customSlot: 'create_time'},
  {title: '创建人', width: '120px', key: 'create_user_name', sort: 'desc'},
  {
    title: '操作',
    width: '260px',
    customSlot: 'operator',
    key: 'operator',
    fixed: 'right'
  }
])
const loading = ref(false)
const dataSource = ref()
const selectedKeys = ref<number[]>([])
const visible = ref(false)
const title = ref('')

const model = ref({
  name: '',
  code_str: ''
})

const resetModel = () => {
  model.value = {
    name: '',
    code_str: ''
  }
}
const currentRow = ref()
const query = ref({
  name: '',
  code_str: '',
  status: -1
})
const changeVisible = (curr_title: string, row: any) => {
  title.value = curr_title
  if (curr_title === '新增') {
    resetModel()
    currentRow.value = {}
  } else {
    currentRow.value = row
    model.value = {
      name: row.name,
      code_str: row.code_str
    }
  }
  visible.value = !visible.value
}

const addShop = async () => {
  let data: addShopBody = model.value
  await apiAddShop(data).then(res => {
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
    name: '',
    code_str: '',
    status: -1
  }
}
const editShop = async () => {
  let data: editShopBody = {
    name: model.value.name,
    code_str: model.value.code_str,
    id: currentRow.value.id
  }
  await apiEditAddShop(data).then(res => {
    let {code, message} = res
    if (code === 0) {
      layer.msg(message)
      visible.value = false
      queryDataSource()
    }
  })
}


const queryDataSource = async () => {
  loading.value = true
  let data: getShopQueryBody = {
    name: query.value.name,
    code_str: query.value.code_str,
    status: query.value.status
  }
  await apiQueryShop(data).then((res: Result) => {
    let {code, data, message} = res
    if (code === 0) {
      dataSource.value = data
    } else {
      layer.msg(message, {icon: 3, time: 2000})
    }
  })
  loading.value = false
}

const getCurrentRowIndex = (id: number) => {
  for (let i = 0; i <= dataSource.value.length; i++) {
    if (dataSource.value[i].id === id) {
      return i
    }
  }
  return null;
}
const changeShopStatus = async (event: boolean, row: any) => {
  let data: changeRoleStatusBody = {
    id: row.id,
    status: event ? 0 : 1,
  }
  await apiChangeShopStatus(data).then((res: Result) => {
    let {code, message} = res
    if (code === 0) {
      let index = getCurrentRowIndex(row.id)
      if (index !== null) {
        dataSource.value[index].status = event ? 0 : 1
      }
      layer.msg(message, {icon: 1, time: 1000})
    } else {
      layer.msg(message, {icon: 3, time: 2000})
    }
  })
}

const delShop = async (id_list: Array<number>) => {
  await apiDelShop(id_list).then((res: Result) => {
    let {code, message} = res
    if (code === 0) {
      layer.msg(message, {icon: 1, time: 1000})
      queryDataSource()
    }
  })
}

const toRemove = () => {
  if (selectedKeys.value.length === 0) {
    layer.msg('请选择要删除的记录', {icon: 3, time: 2000})
    return
  }
  layer.confirm('确定要删除吗?', {
    title: '提示',
    icon: 3,
    yes: (index: number) => {
      delShop(selectedKeys.value)
      layer.close(index)
    }
  })
}

const toSubmit = () => {
  if (title.value === '新增') {
    addShop()
  } else {
    editShop()
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
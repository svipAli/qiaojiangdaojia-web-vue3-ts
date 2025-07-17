<template>
  <lay-container fluid="true" class="role-box">
    <lay-card>
      <lay-form style="margin-top: 10px">
        <lay-row :space="30">
          <lay-col :md="4">
            <lay-form-item label="配件型号" label-width="80">
              <lay-input
                  v-model="searchQuery.part_model"
                  :allow-clear="true"
              ></lay-input>
            </lay-form-item>
          </lay-col>
          <lay-col :md="4">
            <lay-form-item label="配件名称" label-width="80">
              <lay-input
                  v-model="searchQuery.part_name"
                  :allow-clear="true"
              ></lay-input>
            </lay-form-item>
          </lay-col>
          <lay-col :md="4">
            <lay-form-item label="产品型号" label-width="80">
              <lay-input
                  v-model="searchQuery.product_model"
                  :allow-clear="true"
              ></lay-input>
            </lay-form-item>
          </lay-col>
          <lay-col :md="5">
            <lay-form-item label="选择类目" label-width="80">
              <lay-select
                  placeholder="请选择"
                  v-model="searchQuery.class_id"
                  :show-search="true"
                  style="width: 100%"
              >
                <lay-select-option :value="0" label="全部分类"></lay-select-option>
                <template v-for="key in addSelectedKeys">
                  <lay-select-option :value="key.id" :label="key.name"></lay-select-option>
                </template>
              </lay-select>
            </lay-form-item>
          </lay-col>
          <lay-col :md="5">
            <lay-form-item label="启用状态" label-width="80">
              <lay-select
                  style="width: 140px"
                  placeholder="请选择"
                  v-model="searchQuery.status"
                  :allow-clear="true"
              >
                <lay-select-option :value="-1" label="全部"></lay-select-option>
                <lay-select-option :value="0" label="已启用"></lay-select-option>
                <lay-select-option :value="1" label="已禁用"></lay-select-option>
              </lay-select>
            </lay-form-item>
          </lay-col>
          <lay-col :md="6">
            <lay-form-item label="创建时间" label-width="80">
              <lay-date-picker
                  :simple="true"
                  v-model="searchQuery.create_time"
                  :range="true"
                  :allow-clear="true"
                  style="width: 250px"
              ></lay-date-picker>
            </lay-form-item>
          </lay-col>
          <lay-col :md="4">
            <lay-form-item label="备注" label-width="80">
              <lay-input
                  v-model="searchQuery.remark"
                  :allow-clear="true"
              ></lay-input>
            </lay-form-item>
          </lay-col>
          <lay-col :md="4">
            <lay-form-item label-width="20">
              <lay-button
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
    <div class="table-box">
      <lay-table
          :page="page"
          :height="'100%'"
          :columns="columns"
          :loading="loading"
          :default-toolbar="true"
          :data-source="dataSource"
          v-model:selected-keys="selectedKeys"
          @change="queryDataSource"
      >
        <template v-slot:toolbar>
          <lay-button
              type="primary"
              size="sm"
              @click="changeVisibleAddForm('新增配件', null)"
          >
            <lay-icon class="layui-icon-addition"></lay-icon>
            新增
          </lay-button
          >
          <lay-button size="sm" @click="toRemove">
            <lay-icon class="layui-icon-delete"></lay-icon>
            删除
          </lay-button>
        </template>
        <template v-slot:operator="{ row }">
          <lay-button
              size="xs"
              type="primary"
              @click="changeVisibleAddForm('编辑配件', row)"
          >编辑
          </lay-button
          >
          <lay-popconfirm
              content="确定要删除此配件吗?"
              @confirm="delPartConfirm([row.id])"
              @cancel="cancel"
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
          <lay-switch :model-value="!row.status" @change="changePartStatus($event,row)"></lay-switch>
        </template>
      </lay-table>
    </div>

    <lay-layer v-model="visibleAddForm" :title="title" :area="['500px', '620px']">
      <div style="padding: 20px">
        <lay-form :model="addFormData" ref="addForm">
          <lay-form-item label="选择分类" prop="part_class_id" required>
            <lay-select
                placeholder="请选择"
                v-model="addFormData.part_class_id"
                :change="classChange()"
                style="width: 100%"
            >
              <lay-select-option :value="0" label="请选择分类"></lay-select-option>
              <template v-for="key in addSelectedKeys">
                <lay-select-option :value="key.id" :label="key.name"></lay-select-option>
              </template>
            </lay-select>
          </lay-form-item>
          <lay-form-item label="选择产品" prop="product_id" required>
            <lay-select
                placeholder="请选择"
                :multiple="true"
                v-model="addFormData.product_id"
                style="width: 100%"
            >
              <template v-for="key in addSelectedProduct">
                <lay-select-option :value="key.id" :label="key.product_model"></lay-select-option>
              </template>
            </lay-select>
          </lay-form-item>
          <lay-form-item label="配件型号" prop="part_model" required>
            <lay-input v-model="addFormData.part_model"></lay-input>
          </lay-form-item>
          <lay-form-item label="配件名称" prop="part_name" required>
            <lay-input v-model="addFormData.part_name"></lay-input>
          </lay-form-item>
          <lay-form-item label="采购价格" prop="purchase_price" required>
            <lay-input type="number" v-model="addFormData.purchase_price"></lay-input>
          </lay-form-item>
          <lay-form-item label="销售价格" prop="sale_price" required>
            <lay-input type="number" v-model="addFormData.sale_price"></lay-input>
          </lay-form-item>
          <lay-form-item label="备注" prop="remark">
            <lay-textarea
                placeholder="请输入备注"
                v-model="addFormData.remark"
            ></lay-textarea>
          </lay-form-item>
        </lay-form>
        <div style="width: 100%; text-align: center">
          <lay-button type="primary" @click="toSubmit"
          >保存
          </lay-button
          >
          <lay-button @click="toCancel">取消</lay-button>
        </div>
      </div>
    </lay-layer>
    <lay-layer v-model="visibleEditForm" :title="title" :area="['500px', '520px']">
      <div style="padding: 20px">
        <lay-form :model="editFormData" ref="editForm">
          <lay-form-item label="配件型号" prop="part_model" required>
            <lay-input v-model="editFormData.part_model" :readonly="true"></lay-input>
          </lay-form-item>
          <lay-form-item label="配件名称" prop="part_name" required>
            <lay-input v-model="editFormData.part_name"></lay-input>
          </lay-form-item>
          <lay-form-item label="采购价格" prop="purchase_price" required>
            <lay-input type="number" v-model="editFormData.purchase_price"></lay-input>
          </lay-form-item>
          <lay-form-item label="销售价格" prop="sale_price" required>
            <lay-input type="number" v-model="editFormData.sale_price"></lay-input>
          </lay-form-item>
          <lay-form-item label="备注" prop="remark">
            <lay-textarea
                placeholder="请输入备注"
                v-model="editFormData.remark"
            ></lay-textarea>
          </lay-form-item>
        </lay-form>
        <div style="width: 100%; text-align: center">
          <lay-button type="primary" @click="toSubmit"
          >保存
          </lay-button
          >
          <lay-button @click="toCancel">取消</lay-button>
        </div>
      </div>
    </lay-layer>
  </lay-container>
</template>
<script setup lang="ts">
import {onMounted, reactive, ref} from 'vue'
import {layer} from '@layui/layui-vue'
import {
  apiChangePartStatus,
  apiGetPart,
  apiQueryPart,
  apiEditPart,
  apiAddPart,
  apiDelPart,
  apiGetAllClasses,
  apiQueryProduct
} from "@/api/module/product";
import {
  getPageBody,
  queryPartBody,
  changePartStatusBody,
  addPartBody,
  editPartBody,
  queryProductBody
} from "@/types/product";
import {convertTime} from "@/utils/globalFunctions";

defineOptions({
  'name': 'ProductPart'
})
const productMore = reactive({
  page: 1,
  limit: 10000,
})
const addFormData = ref({
  part_class_id: 0,
  product_id: [],
  part_model: '',
  part_name: '',
  purchase_price: 0.00,
  sale_price: 0.00,
  remark: ''
})
const editFormData = ref({
  part_model: '',
  part_name: '',
  purchase_price: 0.00,
  sale_price: 0.00,
  remark: ''
})


const dataSource = ref()
const loading = ref(false)
const selectedKeys = ref()
const addSelectedKeys = ref()
const addSelectedProduct = ref(Array())
const page = reactive({current: 1, limit: 10, total: 0})
const columns = ref([
  {title: '选项', width: '55px', type: 'checkbox', fixed: 'left'},
  {title: 'ID', width: '80px', key: 'id', fixed: 'left', sort: 'desc'},
  {title: '配件型号', width: '200px', key: 'part_model', sort: 'desc'},
  {title: '配件名称', width: '200px', key: 'part_name', sort: 'desc'},
  {title: '采购价格', width: '100px', key: 'purchase_price', sort: 'desc'},
  {title: '销售价格', width: '100px', key: 'sale_price', sort: 'desc'},
  {title: '启用状态', width: '80px', key: 'status', customSlot: 'status'},
  {title: '备注', width: '260px', key: 'remark', sort: 'desc'},
  {title: '创建时间', width: '150px', key: 'create_time', sort: 'desc', customSlot: 'create_time'},
  {title: '更新时间', width: '150px', key: 'update_time', sort: 'desc', customSlot: 'update_time'},
  {title: '创建人id', width: '120px', key: 'create_user_id', hide: true},
  {title: '创建者', width: '120px', key: 'create_user_name'},
  {title: '更新人id', width: '120px', key: 'update_user_id', hide: true},
  {title: '更新者', width: '120px', key: 'update_user_name'},
  {
    title: '操作',
    width: '150px',
    customSlot: 'operator',
    key: 'operator',
    fixed: 'right'
  }
])
const searchQuery = ref({
  part_model: '',
  part_name: '',
  product_model: '',
  class_id: 0,
  remark: '',
  create_time: [],
  status: -1,
})


const getMoreProduct = async () => {
  let data: queryProductBody = {
    page: productMore.page,
    limit: productMore.limit,
    class_id: addFormData.value.part_class_id,
    status: 0,
    product_model: '',
    create_time: [],
  }
  await apiQueryProduct(data).then((res: DataResult) => {
    let {code, data, total, message} = res
    addSelectedProduct.value = []
    if (code === 0) {
      for (let i = 0; i < data.length; i++) {
        addSelectedProduct.value.push(data[i])
      }
    }
  })
}

function toReset() {
  searchQuery.value = {
    part_model: '',
    part_name: '',
    product_model: '',
    class_id: 0,
    remark: '',
    create_time: [],
    status: -1,
  }
}

function toSearch() {
  page.current = 1
  queryDataSource()
}


const queryDataSource = async () => {
  loading.value = true
  const data: queryPartBody = {
    page: page.current,
    limit: page.limit,
    product_model: searchQuery.value.product_model,
    part_name: searchQuery.value.part_name,
    part_model: searchQuery.value.part_model,
    class_id: searchQuery.value.class_id,
    remark: searchQuery.value.remark,
    create_time: searchQuery.value.create_time,
    status: searchQuery.value.status,
  }
  await apiQueryPart(data).then((res: DataResult) => {
    let {code, data, total, message} = res
    if (code === 0) {
      page.total = total
      dataSource.value = data
    } else {
      layer.msg(message, {icon: 3, time: 2000})
    }
  })
  loading.value = false
}

const classChange = async () => {
  await getMoreProduct()
  // 这里需要细化修改
}


const loadDataSource = async () => {
  loading.value = true
  const data: queryPartBody = {
    product_model: searchQuery.value.product_model,
    part_name: searchQuery.value.part_name,
    part_model: searchQuery.value.part_model,
    class_id: searchQuery.value.class_id,
    remark: searchQuery.value.remark,
    create_time: searchQuery.value.create_time,
    status: searchQuery.value.status,
    page: page.current,
    limit: page.limit,
  }
  await apiQueryPart(data).then((res: DataResult) => {
    let {code, data, total, message} = res
    if (code === 0) {
      page.total = total
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

const changePartStatus = async (event: boolean, row: any) => {
  let data: changePartStatusBody = {
    id: row.id,
    status: event ? 0 : 1,
  }
  await apiChangePartStatus(data).then((res: Result) => {
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


const addForm = ref()
const editForm = ref()
const visibleAddForm = ref(false)
const visibleEditForm = ref(false)
const currentId = ref()
const title = ref('')
const changeVisibleAddForm = (text: any, row: any) => {
  title.value = text
  if (row != null) {
    editFormData.value = JSON.parse(JSON.stringify(row))
    currentId.value = row.id
    visibleEditForm.value = !visibleEditForm.value
  } else {
    addFormData.value = {
      part_class_id: 0,
      product_id: [],
      part_model: '',
      part_name: '',
      purchase_price: 0.00,
      sale_price: 0.00,
      remark: ''
    }
    addSelectedProduct.value = []
    visibleAddForm.value = !visibleAddForm.value
  }
}

function toRemove() {
  if (selectedKeys.value.length == 0) {
    layer.msg('您未选择数据，请先选择要删除的数据', {icon: 3, time: 2000})
    return
  }
  layer.confirm('您将删除所有选中的数据？', {
    title: '提示',
    btn: [
      {
        text: '确定',
        callback: (id: any) => {
          delPartConfirm(selectedKeys.value)
          layer.close(id)
        }
      },
      {
        text: '取消',
        callback: (id: any) => {
          layer.msg('您已取消操作')
          layer.close(id)
        }
      }
    ]
  })
}

const addPart = async () => {
  let data: addPartBody = addFormData.value
  await apiAddPart(data).then((res: Result) => {
    let {code, message} = res
    if (code === 0) {
      queryDataSource()
      layer.msg(message, {icon: 1, time: 1000})
      addForm.value.reset()
      visibleAddForm.value = false
    } else {
      layer.msg(message, {icon: 3, time: 2000})
    }
  })
}

const editPart = async () => {
  let data: editPartBody = {
    id: currentId.value,
    part_name: editFormData.value.part_name,
    purchase_price: editFormData.value.purchase_price,
    sale_price: editFormData.value.sale_price,
    remark: editFormData.value.remark
  }
  await apiEditPart(data).then((res: Result) => {
    let {code, message} = res
    if (code === 0) {
      queryDataSource()
      layer.msg(message, {icon: 1, time: 1000})
      addForm.value.reset()
      visibleAddForm.value = false
      currentId.value.reset()
    } else {
      layer.msg(message, {icon: 3, time: 2000})
    }
  })
}

function toSubmit() {
  switch (title.value) {
    case '新增配件':
      addPart()
      return false;
    case '编辑配件':
      editPart()
      return false;
  }
}

const toCancel = () => {
  visibleAddForm.value = false
  visibleEditForm.value = false
}

const delPartConfirm = async (data: Array<number>) => {
  await apiDelPart(data).then((res: Result) => {
    let {code, message} = res
    if (code === 0) {
      layer.msg(message, {icon: 1, time: 1000})
      queryDataSource()
    } else {
      layer.msg(message, {icon: 3, time: 2000})
    }
  })
}

const cancel = () => {
  layer.msg('您已取消操作')
}

const getAllProductClass = () => {
  apiGetAllClasses().then((res: Result) => {
    let {code, data, message} = res
    if (code === 0) {
      addSelectedKeys.value = data
      return true
    } else {
      layer.msg(message, {icon: 3, time: 2000})
    }
  })
  return false
}

onMounted(() => {
  getAllProductClass()
  loadDataSource()
})
</script>

<style scoped>
.role-box {
  width: calc(100vw - 220px);
  height: calc(100vh - 110px);
  margin-top: 10px;
  box-sizing: border-box;
  overflow: auto;
}

.table-box {
  margin-top: 10px;
  padding: 10px;
  height: 700px;
  width: 100%;
  border-radius: 4px;
  box-sizing: border-box;
  background-color: #fff;
}

</style>
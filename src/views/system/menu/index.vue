<template>
  <lay-container fluid="true" class="menu-box">
    <lay-card>
      <lay-form style="margin-top: 10px">
        <lay-row :space="30">
          <lay-col :md="5">
            <lay-form-item label="菜单名称" label-width="80">
              <lay-input
                  v-model="searchQuery.name"
                  placeholder="请输入"
                  :allow-clear="true"
                  style="width: 98%"
              ></lay-input>
            </lay-form-item>
          </lay-col>
          <lay-col :md="5">
            <lay-form-item label="路由地址" label-width="80">
              <lay-input
                  v-model="searchQuery.path"
                  placeholder="请输入"
                  :allow-clear="true"
                  style="width: 98%"
              ></lay-input>
            </lay-form-item>
          </lay-col>
          <lay-col :md="5">
            <lay-form-item label="权限标识" label-width="80">
              <lay-input
                  v-model="searchQuery.permission"
                  placeholder="请输入"
                  :allow-clear="true"
                  style="width: 98%"
              ></lay-input>
            </lay-form-item>
          </lay-col>
          <lay-col :md="5">
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
    <!-- table -->
    <div class="table-box">
      <lay-table
          :height="`100%`"
          ref="tableRef"
          :loading="loading"
          children-column-name="children"
          :columns="columns"
          :data-source="dataSource"
          :default-toolbar="true"
          :default-expand-all="defaultExpandAll"
          :expand-index="1"
      >
        <template #toolbar>
          <lay-button
              size="sm"
              @click="changeVisible('新增菜单', null)"
              type="primary"
          >
            <lay-icon class="layui-icon-addition"></lay-icon>
            新增
          </lay-button>
          <lay-button size="sm" @click="expandAll(true)">展开全部</lay-button>
          <lay-button size="sm" @click="expandAll(false)">折叠全部</lay-button>
        </template>
        <template #name="{ row }">
          <lay-icon :class="row.icon"></lay-icon> &nbsp;&nbsp;
          {{ row.name }}
        </template>
        <template #option="{ row }">
          <lay-button
              @click="changeVisible('新增子菜单', row)"
              size="xs"
              type="primary"
          >
            新增子菜单
          </lay-button>
          <lay-button
              @click="changeVisible('编辑菜单', row)"
              size="xs"
              type="normal"
          >
            修改
          </lay-button>
          <lay-button
              @click="toRemove(row)"
              size="xs"
              type="danger"
          >
            删除
          </lay-button>
        </template>
        <template #menu_type="{ row }">
          <div v-show="row.menu_type == '目录'">
            <lay-tag color="#165DFF" variant="light">目录</lay-tag>
          </div>
          <div v-show="row.menu_type == '菜单'">
            <lay-tag color="#2dc570" variant="light">菜单</lay-tag>
          </div>
          <div v-show="row.menu_type == '外链'">
            <lay-tag color="#F5319D" variant="light">外链</lay-tag>
          </div>
        </template>
        <template #status="{ row }">
          <lay-switch v-model="row.status" @change="statusChange($event,row)"></lay-switch>
        </template>
        <template #show="{ row }">
          <lay-switch v-model="row.show" @change="visibleChange($event, row)"></lay-switch>
        </template>
        <template #link_type="{ row }">
          <template v-if="row.link_type">
            <div v-show="row.link_type == 'modal'">
              <lay-tag color="#165DFF" variant="light">模态框</lay-tag>
            </div>
            <div v-show="row.link_type == 'blank'">
              <lay-tag color="#F5319D" variant="light">新标签</lay-tag>
            </div>
          </template>
          <template v-else>
            <div>
              <lay-tag color="#2dc570" variant="light">内嵌</lay-tag>
            </div>
          </template>
        </template>
      </lay-table>
    </div>

    <lay-layer v-model="visible" :title="title" :area="['700px', '370px']">
      <div style="padding: 20px">
        <lay-form :model="model" ref="layFormRef" required>
          <lay-row>
            <lay-col md="12">
              <lay-form-item label="菜单名称" prop="name">
                <lay-input v-model="model.name"></lay-input>
              </lay-form-item>
              <lay-form-item label="类型" prop="menu_type">
                <lay-select v-model="model.menu_type" placeholder="请选择">
                  <lay-select-option value="目录" label="目录"></lay-select-option>
                  <lay-select-option value="菜单" label="菜单"></lay-select-option>
                  <lay-select-option value="外链" label="外链"></lay-select-option>
                </lay-select>
              </lay-form-item>
              <lay-form-item label="路由路径" prop="path">
                <lay-input v-model="model.path"></lay-input>
              </lay-form-item>
              <lay-form-item label="权限标识" prop="permission">
                <lay-input v-model="model.permission"></lay-input>
              </lay-form-item>

            </lay-col>
            <lay-col md="12">
              <lay-form-item label="图标" prop="icon">
                <lay-input v-model="model.icon"></lay-input>
              </lay-form-item>
              <lay-form-item label="排序" prop="order_num">
                <lay-input-number
                    style="width: 100%"
                    v-model="model.order_num"
                    position="right"
                ></lay-input-number>
              </lay-form-item>
              <lay-form-item label="打款方式">
                <lay-select v-model="model.link_type" placeholder="请选择">
                  <lay-select-option value="" label="内嵌"></lay-select-option>
                  <lay-select-option value="modal" label="模态框"></lay-select-option>
                  <lay-select-option value="blank" label="新标签"></lay-select-option>
                </lay-select>
              </lay-form-item>
              <lay-row>
                <lay-col md="12">
                  <lay-form-item label="显示" prop="show">
                    <lay-switch v-model="model.show"></lay-switch>
                  </lay-form-item>
                </lay-col>
                <lay-col md="12">
                  <lay-form-item label="启用" prop="status">
                    <lay-switch v-model="model.status"></lay-switch>
                  </lay-form-item>
                </lay-col>
              </lay-row>
            </lay-col>
          </lay-row>
        </lay-form>
        <div style="width: 97%; text-align: right">
          <lay-button size="sm" type="primary" @click="toSubmit"
          >保存
          </lay-button
          >
          <lay-button size="sm" @click="toCancel">取消</lay-button>
        </div>
      </div>
    </lay-layer>
  </lay-container>
</template>
<script setup lang="ts">
import {onMounted, ref, watch} from 'vue'
import {layer} from '@layui/layui-vue'
import {
  apiAddMenu,
  apiDelMenu,
  apiEditMenu,
  apiEditMenuStatus,
  apiEditMenuVisible,
  apiGetMenu
} from "@/api/module/menu";
import {Result} from "@/types/result";
import {EditMenuModel} from "@/types/menu";

const searchQuery = ref({
  path: '',
  permission: '',
  name: ''
})

function toReset() {
  searchQuery.value = {
    path: '',
    permission: '',
    name: ''
  }
}

const statusChange = async (event: boolean, row: any) => {
  const res: Result = await apiEditMenuStatus({id: row.id, status: event})
  if (res.code === 0) {
    layer.msg('操作成功', {icon: 1, time: 2000})
    row.status = event
  } else {
    layer.msg(res.message, {icon: 2, time: 2000})
  }
}


const visibleChange = async (event: boolean, row: any) => {
  const res: Result = await apiEditMenuVisible({id: row.id, show: event})
  if (res.code === 0) {
    layer.msg('操作成功', {icon: 1, time: 2000})
    row.show = event
  } else {
    layer.msg(res.message, {icon: 2, time: 2000})
  }
}

function toSearch() {
  loading.value = true
  loadDataSource().then(() => {
    loading.value = false
  })
}

const loading = ref(false)
const tableRef = ref()

const columns = [
  {
    fixed: 'left',
    type: 'checkbox',
    title: '复选'
  },

  {
    title: '菜单名称',
    key: 'name',
    width: '180px',
    customSlot: 'name'
  },
  {
    title: '类型',
    width: '100px',
    key: 'menu_type',
    customSlot: 'menu_type'
  },
  {
    title: '显示',
    key: 'show',
    width: '60px',
    customSlot: 'show'
  },
  {
    title: '路由地址',
    width: '200px',
    key: 'path'
  },
  {
    title: '权限标识',
    width: '200px',
    key: 'permission'
  },
  {
    title: '状态',
    key: 'status',
    width: '60px',
    customSlot: 'status'
  },
  {
    title: '排序',
    width: '80px',
    key: 'order_num'
  },
  {
    title: '菜单类型',
    width: '100px',
    key: 'link_type',
    customSlot: 'link_type'
  },
  {
    title: '操作',
    key: 'option',
    customSlot: 'option',
    width: '160px',
    fixed: 'right'
  }
]


const dataSource = ref()

const loadDataSource = async () => {
  const res: Result = await apiGetMenu(searchQuery.value)
  let {code, data, message} = res
  if (code === 0) {
    dataSource.value = data
  } else {
    layer.msg(message, {icon: 2, time: 2000})
  }
}

const defaultExpandAll = ref(false)

const expandAll = function (flag: any) {
  defaultExpandAll.value = flag
}
const model = ref<EditMenuModel>({
  id: 0,
  name: '',
  permission: '',
  order_num: 0,
  menu_type: '目录',
  icon: '',
  path: '',
  link_type: '',
  show: true,
  status: true
})

const modelReSet = () => {
  model.value = {
    id: 0,
    name: '',
    permission: '',
    order_num: 0,
    menu_type: '目录',
    icon: '',
    path: '',
    link_type: '',
    show: true,
    status: true
  }
}
const layFormRef = ref()
const visible = ref(false)

const title = ref('新增菜单')
const changeVisible = (text: any, row: any) => {
  title.value = text
  modelReSet()
  if (row != null && text === '编辑菜单') {
    model.value = JSON.parse(JSON.stringify(row))
  } else if (row != null && text === '新增子菜单') {
    model.value.id = row.id
  }
  visible.value = !visible.value
}

watch(visible, () => {
  if (!visible.value) {
    modelReSet()
  }
})


const deleteMenu = async (id: number) => {
  const res: Result = await apiDelMenu({id: id})
  let {code, message} = res
  if (code === 0) {
    layer.msg('删除成功！', {icon: 1, time: 1000})
    await loadDataSource()
  } else {
    layer.msg(message, {icon: 2, time: 2000})
  }
}

function toRemove(row: any) {
  layer.confirm('菜单删除后不可恢复, 确定要删除菜单吗？', {
    title: '提示',
    btn: [
      {
        text: '确定',
        callback: (id: any) => {
          deleteMenu(row.id).then(() => {
            layer.close(id)
          })

        }
      },
      {
        text: '取消',
        callback: (id: any) => {
          layer.close(id)
        }
      }
    ]
  })
}

const editMenu = async () => {
  const res: Result = await apiEditMenu({
    id: model.value.id,
    name: model.value.name,
    permission: model.value.permission,
    order_num: model.value.order_num,
    menu_type: model.value.menu_type,
    icon: model.value.icon,
    path: model.value.path,
    link_type: model.value.link_type,
    show: model.value.show,
    status: model.value.status
  })
  let {code, message} = res
  if (code === 0) {
    layer.msg('修改成功！', {icon: 1, time: 1000})
    loadDataSource()
  } else {
    layer.msg(message, {icon: 2, time: 2000})
  }
}


const addMenu = async () => {
  const res: Result = await apiAddMenu({
    id: model.value.id,
    name: model.value.name,
    permission: model.value.permission,
    order_num: model.value.order_num,
    menu_type: model.value.menu_type,
    icon: model.value.icon,
    path: model.value.path,
    link_type: model.value.link_type,
    show: model.value.show,
    status: model.value.status
  })
  let {code, message} = res
  if (code === 0) {
    layer.msg('新增成功！', {icon: 1, time: 1000})
    loadDataSource()
  } else {
    layer.msg(message, {icon: 2, time: 2000})
  }
}

function toSubmit() {
  if (title.value === '新增菜单' || title.value === '新增子菜单') {
    addMenu()
  } else if (title.value === '编辑菜单') {
    editMenu()
  } else {
    layer.msg('请选择操作类型', {icon: 2, time: 2000})
  }
  visible.value = false
  modelReSet()
}

function toCancel() {
  visible.value = false
  modelReSet()
}

onMounted(() => {
  loadDataSource()
})

</script>

<style scoped>
.menu-box {
  width: calc(100vw - 220px);
  height: calc(100vh - 110px);
  margin-top: 10px;
  box-sizing: border-box;
  overflow: hidden;
}

.top-search {
  margin-top: 10px;
  padding: 10px;
  height: 40px;
  border-radius: 4px;
  background-color: #fff;
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

.search-input {
  display: inline-block;
  width: 98%;
  margin-right: 10px;
}

.table-style {
  margin-top: 10px;
}

.isChecked {
  display: inline-block;
  background-color: #e8f1ff;
  color: red;
}
</style>
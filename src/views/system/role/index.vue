<template>
  <lay-container fluid="true" class="role-box">
    <lay-card>
      <lay-form style="margin-top: 10px">
        <lay-row :space="30">
          <lay-col :md="4">
            <lay-form-item label="角色名称" label-width="80">
              <lay-input
                  v-model="searchQuery.name"
                  :allow-clear="true"
              ></lay-input>
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
              @click="changeVisibleAddForm('新增角色', null)"
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
              @click="changeVisibleAddForm('编辑角色', row)"
          >编辑
          </lay-button
          >
          <lay-button
              size="xs"
              type="normal"
              @click="getRoleMenu(row.id)"
          >分配权限
          </lay-button
          >
          <lay-popconfirm
              content="确定要删除此角色吗?"
              @confirm="delRoleConfirm([row.id])"
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
          <lay-switch :model-value="!row.status" @change="changeRoleStatus($event,row)"></lay-switch>
        </template>
      </lay-table>
    </div>

    <lay-layer v-model="visibleAddForm" :title="title" :area="['500px', '350px']">
      <div style="padding: 20px">
        <lay-form :model="addUserFormData" ref="addForm">
          <lay-form-item label="角色名称" prop="name" required>
            <lay-input v-model="addUserFormData.name"></lay-input>
          </lay-form-item>
          <lay-form-item label="备注" prop="remark">
            <lay-textarea
                placeholder="请输入备注"
                v-model="addUserFormData.remark"
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

    <lay-layer v-model="visibleRoleMenu" title="分配权限" :area="['500px', '450px']">
      <div style="height: 320px; overflow: auto">
        <lay-tree
            style="margin-left: 40px"
            :tail-node-icon="false"
            :data="data2"
            :showCheckbox="true"
            v-model:checkedKeys="checkedKeys"
        >
          <template #title="{ data }">
            <lay-icon :class="data.icon"></lay-icon>
            {{ data.title }}
          </template>
        </lay-tree>
      </div>
      <lay-line></lay-line>
      <div style="width: 90%; text-align: right">
        <lay-button size="sm" type="primary" @click="toSubmit">保存</lay-button>
        <lay-button size="sm" @click="toCancel">取消</lay-button>
      </div>
    </lay-layer>
  </lay-container>
</template>
<script setup lang="ts">
import {onMounted, reactive, ref} from 'vue'
import {layer} from '@layui/layui-vue'
import {
  apiChangeRoleStatus,
  apiGetRole,
  apiQueryRole,
  apiAddRole,
  apiEditRole,
  apiDelRole,
  apiGetRoleMenu,
  apiUpdateRoleMenu
} from "@/api/module/role";
import {
  getRoleBody,
  queryRoleBody,
  changeRoleStatusBody,
  addRoleBody,
  editRoleBody,
  getRoleMenuBody,
  updateRoleMenuPermissionBody
} from "@/types/role";
import {convertTime} from "@/utils/globalFunctions";
import {log} from "echarts/types/src/util/log";

defineOptions({
  name: 'SystemRole'
})

const dataSource = ref()
const visibleRoleMenu = ref(false)
const loading = ref(false)
const selectedKeys = ref([])
const checkedKeys = ref()
const page = reactive({current: 1, limit: 10, total: 10})
const columns = ref([
  {title: '选项', width: '55px', type: 'checkbox', fixed: 'left'},
  {title: 'ID', width: '80px', key: 'id', fixed: 'left', sort: 'desc'},
  {title: '角色名称', width: '100px', key: 'name', sort: 'desc'},
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
  name: '',
  remark: '',
  create_time: [],
  status: -1,
})

function toReset() {
  searchQuery.value = {
    name: '',
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
  const data: queryRoleBody = {
    page: page.current,
    limit: page.limit,
    name: searchQuery.value.name,
    remark: searchQuery.value.remark,
    create_time: searchQuery.value.create_time,
    status: searchQuery.value.status,
  }
  await apiQueryRole(data).then((res: DataResult) => {
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

const loadDataSource = async () => {
  loading.value = true
  const data: getRoleBody = {
    page: page.current,
    limit: page.limit,
  }
  await apiGetRole(data).then((res: DataResult) => {
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

const changeRoleStatus = async (event: boolean, row: any) => {
  let data: changeRoleStatusBody = {
    id: row.id,
    status: event ? 0 : 1,
  }
  await apiChangeRoleStatus(data).then((res: Result) => {
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

const addUserFormData = ref({
  name: '',
  remark: ''
})

const addForm = ref()
const visibleAddForm = ref(false)
const currentId = ref()
const title = ref('')
const changeVisibleAddForm = (text: any, row: any) => {
  title.value = text
  if (row != null) {
    addUserFormData.value = JSON.parse(JSON.stringify(row))
    currentId.value = row.id
  } else {
    addUserFormData.value = {
      name: '',
      remark: ''
    }
  }
  visibleAddForm.value = !visibleAddForm.value
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
          delRoleConfirm(selectedKeys.value)
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

const addRole = async () => {
  let data: addRoleBody = addUserFormData.value
  await apiAddRole(data).then((res: Result) => {
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

const editRole = async () => {
  let data: editRoleBody = {
    id: currentId.value,
    name: addUserFormData.value.name,
    remark: addUserFormData.value.remark
  }
  await apiEditRole(data).then((res: Result) => {
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

const updateRoleMenu = async () => {
  let permissions: Array<string> = []
  for (let i = 0; i < checkedKeys.value.length; i++) {
    if (typeof checkedKeys.value[i] === "string") {
      permissions.push(checkedKeys.value[i])
    }
  }
  let data: updateRoleMenuPermissionBody = {
    id: currentId.value,
    permission: permissions
  }
  await apiUpdateRoleMenu(data).then((res: Result) => {
    let {code, message} = res
    if (code === 0) {
      layer.msg(message, {icon: 1, time: 1000})
      visibleRoleMenu.value = false
      currentId.value = {}
      selectedKeys.value = []
    } else {
      layer.msg(message, {icon: 3, time: 2000})
    }
  })
}

function toSubmit() {
  switch (title.value) {
    case '新增角色':
      addRole()
      return false;
    case '编辑角色':
      editRole()
      return false;
    case '分配权限':
      updateRoleMenu()
      return false;
  }
}

const toCancel = () => {
  visibleAddForm.value = false
  visibleRoleMenu.value = false
}

const delRoleConfirm = async (data: Array<number>) => {
  await apiDelRole(data).then((res: Result) => {
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
const data2 = ref([])

const setCheckedKeys = (data: any) => {
  checkedKeys.value = []
  for (let key in data) {
    if ("children" in data[key]) {
      for (let key2 in data[key].children) {
        if ("children" in data[key].children[key2]) {
          for (let key3 in data[key].children[key2].children) {
            if (data[key].children[key2].children[key3].checked) {
              let id = data[key].children[key2].children[key3].id
              checkedKeys.value.push(id)
            }
          }
        }
      }
    }
  }
}


const getRoleMenu = async (id: number) => {
  let data: getRoleMenuBody = {
    id: id
  }
  currentId.value = id
  await apiGetRoleMenu(data).then((res: Result) => {
    let {code, data, message} = res
    if (code === 0) {
      data2.value = data
      setCheckedKeys(data)
      visibleRoleMenu.value = true
      title.value = '分配权限'
    } else {
      layer.msg(message, {icon: 3, time: 2000})
    }
  })
}

onMounted(() => {
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
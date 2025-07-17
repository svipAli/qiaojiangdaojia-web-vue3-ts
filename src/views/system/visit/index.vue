<template>
  <lay-container fluid="true" class="user-box">
    <lay-card>
      <lay-form style="margin-top: 10px">
        <lay-row class="layui-col-space10">
          <lay-col :md="5">
            <lay-form-item label="用户账号" label-width="80">
              <lay-input
                  v-model="searchQuery.username"
                  :allow-clear="true"
                  style="width: 98%"
              ></lay-input>
            </lay-form-item>
          </lay-col>
          <lay-col :md="5">
            <lay-form-item label="用户昵称" label-width="80">
              <lay-input
                  v-model="searchQuery.nick_name"
                  :allow-clear="true"
                  style="width: 98%"
              ></lay-input>
            </lay-form-item>
          </lay-col>
          <lay-col :md="5">
            <lay-form-item label="用户邮箱" label-width="80">
              <lay-input
                  v-model="searchQuery.email"
                  :allow-clear="true"
                  style="width: 98%"
              ></lay-input>
            </lay-form-item>
          </lay-col>
          <lay-col :md="5">
            <lay-form-item label="手机号码" label-width="80">
              <lay-input
                  v-model="searchQuery.phone"
                  :allow-clear="true"
                  style="width: 98%"
              ></lay-input>
            </lay-form-item>
          </lay-col>
          <lay-col :md="5">
            <lay-form-item label="实名姓名" label-width="80">
              <lay-input
                  v-model="searchQuery.real_name"
                  :allow-clear="true"
                  style="width: 98%"
              ></lay-input>
            </lay-form-item>
          </lay-col>
          <lay-col :md="5">
            <lay-form-item label="身份证号" label-width="80">
              <lay-input
                  v-model="searchQuery.id_number"
                  :allow-clear="true"
                  style="width: 98%"
              ></lay-input>
            </lay-form-item>
          </lay-col>
          <lay-col :md="5">
            <lay-form-item label="性别" label-width="80">
              <lay-select
                  class="search-input"
                  v-model="searchQuery.sex"
                  style="width: 60%"
              >
                <lay-select-option :value="-1" label="全部"></lay-select-option>
                <lay-select-option :value="0" label="未知"></lay-select-option>
                <lay-select-option :value="1" label="男"></lay-select-option>
                <lay-select-option :value="2" label="女"></lay-select-option>
              </lay-select>
            </lay-form-item>
          </lay-col>
          <lay-col :md="5">
            <lay-form-item label="用户状态" label-width="80">
              <lay-select
                  class="search-input"
                  v-model="searchQuery.sex"
                  style="width: 60%"
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
          <lay-col :md="6">
            <lay-form-item label="更新时间" label-width="80">
              <lay-date-picker
                  :simple="true"
                  v-model="searchQuery.update_time"
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
                  size="sm"
                  @click="toSearch"
              >
                查询
              </lay-button>
              <lay-button size="sm" @click="toReset"> 重置</lay-button>
            </lay-form-item>
          </lay-col>
        </lay-row>
      </lay-form>
    </lay-card>
    <!-- table -->
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
        <template #status="{ row }">
          <lay-switch
              :model-value="!row.status"
              @change="changeStatus($event, row)"
          ></lay-switch>
        </template>
        <template #avatar="{ row }">
          <lay-avatar :src="row.avatar"></lay-avatar>
        </template>
        <template #role="{ data }">
          {{ getRoleName(data.role_id) }}
        </template>
        <template #create_time="{ data }">
          {{ convertTime(data.create_time) }}
        </template>
        <template #update_time="{ data }">
          {{ convertTime(data.update_time) }}
        </template>
        <template v-slot:toolbar>
          <lay-button size="sm" type="primary" @click="changeVisible('新增')">
            <lay-icon class="layui-icon-addition"></lay-icon>
            新增
          </lay-button
          >
          <lay-button size="sm" @click="deleteUserConfirm(selectedKeys)">
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
          <lay-button size="xs" type="danger" @click="deleteUserConfirm([row.id])">删除</lay-button>
        </template>
      </lay-table>
    </div>

    <lay-layer v-model="visible" :title="title" :area="['500px', '550px']">
      <div style="padding: 20px">
        <lay-form :model="model">
          <template v-if="title==='新增'">
            <lay-form-item label="用户名" prop="username" required>
              <lay-input v-model="model.username"></lay-input>
            </lay-form-item>
            <lay-form-item label="用户密码" prop="password" required>
              <lay-input type="password" v-model="model.password" :password="true"></lay-input>
            </lay-form-item>
            <lay-form-item label="重复密码" prop="password_again" required>
              <lay-input type="password" v-model="model.password_again" :password="true"></lay-input>
            </lay-form-item>
          </template>
          <lay-form-item label="用户昵称" prop="nick_name" required>
            <lay-input v-model="model.nick_name"></lay-input>
          </lay-form-item>
          <lay-form-item label="电子邮箱" prop="email" required>
            <lay-input v-model="model.email"></lay-input>
          </lay-form-item>
          <lay-form-item label="手机号码" prop="phone" required>
            <lay-input v-model="model.phone"></lay-input>
          </lay-form-item>
          <lay-form-item label="选择角色" prop="role_id" required>
            <lay-select v-model="model.role_id" style="width: 100%">
              <lay-select-option :value="-1">请选择角色</lay-select-option>
              <template v-for="role of roleList">
                <lay-select-option :value="role.id">{{ role.name }}</lay-select-option>
              </template>
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
  </lay-container>
</template>
<script setup lang="ts">
import {onMounted, reactive, ref} from 'vue'
import {layer} from '@layui/layui-vue'
import {addUserBody, editUserBody, queryUserBody, switchUserStatusBody} from "@/types/user";
import {apiAddUser, apiDeleteUser, apiEditUser, apiQueryUser, apiSwitchUserStatus} from "@/api/module/user";
import {convertTime} from "@/utils/globalFunctions";
import {getRoleBody} from "@/types/role";
import {apiGetRole} from "@/api/module/role";

const title = ref('')
const roleList = ref()
const getRoleList = async () => {
  const data: getRoleBody = {
    page: 1,
    limit: 10000,
  }
  await apiGetRole(data).then((res: DataResult) => {
    let {code, data, total, message} = res
    if (code === 0) {
      page.total = total
      roleList.value = data
    } else {
      layer.msg(message, {icon: 3, time: 2000})
    }
  })
}
const searchQuery = ref({
  username: '',
  nick_name: '',
  email: '',
  phone: '',
  real_name: '',
  id_number: '',
  sex: -1,
  status: -1,
  role_id: [-1],
  depart_id: [-1],
  post_id: [-1],
  create_time: [],
  update_time: [],
})

const toReset = () => {
  searchQuery.value = {
    username: '',
    nick_name: '',
    email: '',
    phone: '',
    real_name: '',
    id_number: '',
    sex: -1,
    status: -1,
    role_id: [-1],
    depart_id: [-1],
    post_id: [-1],
    create_time: [],
    update_time: [],
  }
}

const toSearch = async () => {
  page.current = 1
  await queryDataSource()
}
const getRoleName = (role_id: number) => {
  for (let i = 0; i < roleList.value.length; i++) {
    if (roleList.value[i].id === role_id) {
      return roleList.value[i].name
    }
  }
}
const loading = ref(false)
const selectedKeys = ref<number[]>([])
const page = reactive({current: 1, limit: 10, total: 100})
const columns = ref([
  {title: '选项', width: '60px', type: 'checkbox', fixed: 'left'},
  {title: '序号', width: '60px', type: 'number', fixed: 'left'},
  {title: 'ID', width: '80px', key: 'id', fixed: 'left', sort: 'desc'},
  {title: '用户账号', width: '140px', key: 'username', resize: true},
  {title: '用户角色', width: '140px', key: 'role_id', resize: true, customSlot: 'role'},
  {title: '头像', width: '50px', key: 'avatar', customSlot: 'avatar'},
  {title: '用户状态', width: '100px', key: 'status', customSlot: 'status'},
  {title: '用户昵称', width: '140px', key: 'nick_name', resize: true},
  {title: '手机号码', width: '140px', key: 'phone', resize: true},
  {title: '实名姓名', width: '140px', key: 'real_name', resize: true},
  {title: '性别', width: '80px', key: 'sex', customSlot: 'sex'},
  {title: '身份证号', width: '200px', key: 'id_number'},
  {title: '用户邮箱', width: '250px', key: 'email', resize: true},
  {title: '地址', width: '250px', key: 'address'},
  {title: '创建时间', width: '180px', key: 'create_time', customSlot: 'create_time'},
  {title: '更新时间', width: '180px', key: 'update_time', customSlot: 'update_time'},
  {title: '创建人', width: '120px', key: 'create_user_name'},
  {title: '更新人', width: '120px', key: 'update_user_name'},
  {
    title: '操作',
    width: '120px',
    customSlot: 'operator',
    key: 'operator',
    fixed: 'right'
  }
])
const queryDataSource = async () => {
  await getRoleList()
  loading.value = true
  const data: queryUserBody = {
    page: page.current,
    limit: page.limit,
    username: searchQuery.value.username,
    status: searchQuery.value.status,
    nick_name: searchQuery.value.nick_name,
    email: searchQuery.value.email,
    phone: searchQuery.value.phone,
    real_name: searchQuery.value.real_name,
    id_number: searchQuery.value.id_number,
    sex: searchQuery.value.sex,
    role_id: searchQuery.value.role_id,
    depart_id: searchQuery.value.depart_id,
    post_id: searchQuery.value.post_id,
    create_time: searchQuery.value.create_time,
    update_time: searchQuery.value.update_time,
  }
  await apiQueryUser(data).then((res: DataResult) => {
    let {code, data, total, message} = res
    if (code === 0) {
      if (page.current == 1) {
        page.total = total
      }
      dataSource.value = data
      selectedKeys.value = []
    } else {
      layer.msg(message, {icon: 3, time: 2000})
    }
  })
  loading.value = false
}
const dataSource = ref()
const changeStatus = async (event: boolean, row: any) => {
  let status = event ? 0 : 1
  let data: switchUserStatusBody = {
    id_list: [row.id],
    status: status
  }
  await apiSwitchUserStatus(data).then((res: DataResult) => {
    let {code, message} = res
    if (code === 0) {
      layer.msg('操作成功', {icon: 1, time: 2000})
      queryDataSource()
    } else {
      layer.msg(message, {icon: 3, time: 2000})
    }
  })
}
const loadDataSource = async () => {
  page.current = 1
  await queryDataSource()
}
const model = ref({
  username: '',
  password: '',
  password_again: '',
  nick_name: '',
  email: '',
  phone: '',
  role_id: -1,
})
const visible = ref(false)
const currentRow = ref()
const changeVisible = (text: any, row?: any) => {
  title.value = text
  if (row) {
    model.value = JSON.parse(JSON.stringify(row))
    currentRow.value = row
  } else {
    model.value = {
      username: '',
      password: '',
      password_again: '',
      nick_name: '',
      email: '',
      phone: '',
      role_id: -1,
    }
  }
  visible.value = !visible.value
}

const addUser = async () => {
  if (model.value.password !== model.value.password_again) {
    layer.msg('两次输入的密码不一致', {icon: 3, time: 2000})
    return
  }
  if (model.value.role_id == -1) {
    layer.msg('请选择角色', {icon: 3, time: 2000})
    return
  }
  let data: addUserBody = {
    username: model.value.username,
    password: model.value.password,
    password_again: model.value.password_again,
    nick_name: model.value.nick_name,
    email: model.value.email,
    phone: model.value.phone,
    role_id: model.value.role_id,
  }
  await apiAddUser(data).then((res: Result) => {
    let {code, message} = res
    if (code === 0) {
      layer.msg('操作成功', {icon: 1, time: 2000})
      selectedKeys.value = []
      visible.value = false
      queryDataSource()
    } else {
      layer.msg(message, {icon: 3, time: 2000})
    }
  })
}

const editUser = async () => {
  if (model.value.role_id == -1) {
    layer.msg('请选择角色！', {icon: 3, time: 2000})
    return
  }
  let data: editUserBody = {
    username: currentRow.value.username,
    nick_name: model.value.nick_name,
    email: model.value.email,
    phone: model.value.phone,
    role_id: model.value.role_id,
  }
  await apiEditUser(data).then((res: Result) => {
        let {code, message} = res
        if (code === 0) {
          layer.msg('操作成功', {icon: 1, time: 2000})
          selectedKeys.value = []
          visible.value = false
          queryDataSource()
        } else {
          layer.msg(message, {icon: 3, time: 2000})
        }
      }
  )
}

const toSubmit = () => {
  if (title.value === '新增') {
    getRoleList()
    addUser()
  } else if (title.value === '编辑') {
    editUser()
  }
}

const deleteUserConfirm = (id_list: Array<number>) => {
  if (id_list.length === 0) {
    layer.msg('请选择要删除的用户!', {icon: 3, time: 2000})
    return false
  }
  layer.confirm('确定要删除用户吗？', {
    icon: 3,
    title: '提示',
    yes: async function (index: any) {
      // 确定按钮的回调函数
      await deleteUser(id_list)
      layer.close(index)
    }
  })
}

const deleteUser = async (id_list: Array<number>) => {
  let data: Array<any> = id_list
  await apiDeleteUser(data).then((res: Result) => {
    let {code, message} = res
    if (code === 0) {
      layer.msg('操作成功', {icon: 1, time: 2000})
      queryDataSource()
    } else {
      layer.msg(message, {icon: 3, time: 2000})
    }
  })
}

const toCancel = () => {
  visible.value = false
}

onMounted(() => {
  getRoleList()
  loadDataSource()
})
</script>

<style scoped>
.user-box {
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

.search-input {
  display: inline-block;
  width: 98%;
  margin-right: 10px;
}
</style>
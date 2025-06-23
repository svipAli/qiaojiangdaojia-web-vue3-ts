<template>
  <lay-container fluid="true" class="user-box">
    <lay-card>
      <lay-form style="margin-top: 10px" @keyup.enter="toSearch">
        <lay-row :space="30">
          <lay-col :md="6">
            <lay-form-item label="发票抬头" label-width="80">
              <lay-input
                  v-model="query.invoice_title"
                  :allow-clear="true"
                  style="width: 98%"
              ></lay-input>
            </lay-form-item>
          </lay-col>
          <lay-col :md="6">
            <lay-form-item label="发票税号" label-width="80">
              <lay-input
                  v-model="query.tax_no"
                  :allow-clear="true"
                  style="width: 98%"
              ></lay-input>
            </lay-form-item>
          </lay-col>
          <lay-col :md="5">
            <lay-form-item label="发票类型" label-width="80">
              <lay-select v-model="query.invoice_type" style="width: 160px">
                <lay-select-option :value="-1" label="全部"></lay-select-option>
                <lay-select-option :value="1">增值税普通发票</lay-select-option>
                <lay-select-option :value="2">增值税专用发票</lay-select-option>
              </lay-select>
            </lay-form-item>
          </lay-col>
          <lay-col :md="4">
            <lay-form-item label="开票状态" label-width="80">
              <lay-select v-model="query.status" style="width: 120px">
                <lay-select-option :value="-1" label="全部"></lay-select-option>
                <lay-select-option :value="0">未开具</lay-select-option>
                <lay-select-option :value="1">已开具</lay-select-option>
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
          height="650px"
          :columns="columns"
          :loading="loading"
          :data-source="dataSource"
          :default-toolbar="true"
          v-model:selectedKeys="selectedKeys">
        <template #toolbar>
          <lay-button type="primary" size="sm" @click="changeVisible('新增',null)">
            <lay-icon class="layui-icon-addition"></lay-icon>
            新增
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
          <lay-button
              size="xs"
              type="normal"
              @click="showInvoiceFile(row)"
          >查看发票
          </lay-button
          >
          <lay-button
              size="xs"
              type="normal"
              @click="dingDingPush([row])"
          >钉钉推送
          </lay-button
          >
          <lay-button
              size="xs"
              type="danger"
              @click="redInvoiceConfirm(row)"
          >冲红申请
          </lay-button
          >
          <lay-button size="xs" type="danger" @click="delQJInvoiceConfirm([row])">
            删除
          </lay-button
          >
        </template>
        <template #tax_point="{ data }">
          {{ data.tax_point }}%
        </template>
        <template #status="{ data }">
          {{ getStatus(data.status) }}
        </template>
        <template #push_status="{ data }">
          {{ getPushStatus(data.push_status) }}
        </template>
        <template #invoice_type="{ data }">
          {{ getType(data.invoice_type) }}
        </template>
        <template #create_time="{ data }">
          {{ convertTime(data.create_time) }}
        </template>
        <template #update_time="{ data }">
          {{ convertTime(data.update_time) }}
        </template>
        <template #push_time="{ data }">
          {{ convertTime(data.push_time) }}
        </template>
      </lay-table>
    </lay-card>
    <lay-layer v-model="visible" :title="title" :area="['800px', '800px']">
      <div style="padding: 20px">
        <lay-form :model="model">
          <lay-form-item label="发票抬头" prop="invoice_title" required>
            <lay-input v-model="model.invoice_title"></lay-input>
          </lay-form-item>
          <lay-form-item label="发票税号" prop="tax_no">
            <lay-input v-model="model.tax_no"></lay-input>
          </lay-form-item>
          <lay-form-item label="公司地址" prop="address">
            <lay-input v-model="model.address"></lay-input>
          </lay-form-item>
          <lay-form-item label="公司电话" prop="phone">
            <lay-input v-model="model.phone"></lay-input>
          </lay-form-item>
          <lay-form-item label="开户银行" prop="logistics_no">
            <lay-input v-model="model.bank_name"></lay-input>
          </lay-form-item>
          <lay-form-item label="银行账号" prop="logistics_no">
            <lay-input v-model="model.bank_account"></lay-input>
          </lay-form-item>
          <lay-form-item label="发票金额" prop="invoice_amount" required>
            <lay-input-number v-model="model.invoice_amount" :precision="2" :min="0" indicator="元"
                              position="right"></lay-input-number>
          </lay-form-item>
          <lay-form-item label="发票税点" prop="invoice_amount" required>
            <lay-input-number v-model="model.tax_point" :min="0" indicator="%"
                              position="right"></lay-input-number>
          </lay-form-item>
          <lay-form-item label="发票类型" prop="invoice_type" required>
            <lay-select v-model="model.invoice_type" style="width: 160px">
              <lay-select-option value="" label="选择发票类型"></lay-select-option>
              <lay-select-option :value="1">增值税普通发票</lay-select-option>
              <lay-select-option :value="2">增值税专用发票</lay-select-option>
            </lay-select>
          </lay-form-item>
          <lay-form-item label="发票内容" prop="invoice_content" required>
            <lay-textarea
                placeholder="请输入发票内容"
                v-model="model.invoice_content"
            ></lay-textarea>
          </lay-form-item>
          <lay-form-item label="接收邮箱" prop="logistics_no">
            <lay-input v-model="model.receive_email"></lay-input>
          </lay-form-item>
          <lay-form-item label="登记备注" prop="back_reason">
            <lay-textarea
                placeholder="请输入登记备注"
                v-model="model.invoice_remark"
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
  </lay-container>
</template>
<script setup lang="ts">
import {onMounted, reactive, ref} from 'vue'
import {layer} from "@layui/layui-vue";
import {convertTime} from "@/utils/globalFunctions";
import {
  addQJInvoiceBody,
  delQJInvoiceBody,
  editQJInvoiceBody,
  queryQJInvoiceBody,
  redQJInvoiceBody
} from "@/types/qiaojiang-invoice";
import {
  apiAddQJInvoice,
  apiDelQJInvoice, apiDingDingPushQJInvoice,
  apiEditQJInvoice,
  apiQueryQJInvoice,
  apiRedQJInvoice
} from "@/api/module/qiaojiang-invoice";
import {Result} from "@/types/result";
import {config} from '@/api/http'

defineOptions({
  name: 'QiaojiangInvoice',
})

const currentRow = ref()
const visible = ref(false)
const title = ref('')
const model = ref({
  invoice_title: '',
  tax_no: '',
  invoice_type: 1,
  address: '',
  phone: '',
  bank_name: '',
  bank_account: '',
  invoice_content: '',
  receive_email: '',
  invoice_amount: 0.00,
  tax_point: 6,
  invoice_remark: '',
})
const toCancel = () => {
  visible.value = false
  model.value = {
    invoice_title: '',
    tax_no: '',
    invoice_type: 1,
    address: '',
    phone: '',
    bank_name: '',
    bank_account: '',
    invoice_content: '',
    receive_email: '',
    invoice_amount: 0.00,
    tax_point: 6,
    invoice_remark: '',
  }
}
const changeVisible = (currentTitle: string, row: any) => {
  title.value = currentTitle
  if (currentTitle === "编辑") {
    currentRow.value = row
    model.value = row
  }
  visible.value = !visible.value
}
const getStatus = (status: number) => {
  switch (status) {
    case 0:
      return '未开具'
    case 1:
      return '已开具'
    case 2:
      return '需冲红'
    case 3:
      return '已冲红'
    default:
      return ''
  }
}
const getPushStatus = (status: number) => {
  switch (status) {
    case 0:
      return '未推送'
    case 1:
      return '已推送'
    case 2:
      return '推送失败'
    default:
      return ''
  }
}
const getType = (type: number) => {
  switch (type) {
    case 1:
      return '增值税普通发票'
    case 2:
      return '增值税专用发票'
    default:
      return ''
  }
}
const dingDingPush = async (row_list: any) => {
  let id_list: Array<number> = []
  for (let item of row_list) {
    if (item.status === 0) {
      id_list.push(item.id)
    } else {
      layer.msg('只有未开具的发票才可以推送！', {icon: 2, time: 1000})
      return
    }
  }
  let data: delQJInvoiceBody = {
    id_list: id_list
  }
  await apiDingDingPushQJInvoice(data).then((res: Result) => {
    let {code, data, message} = res
    if (code === 0) {
      layer.msg('已发起推送任务', {icon: 1, time: 1000})
      queryDataSource()
    } else {
      layer.msg(message, {icon: 2, time: 1000})
    }
  })
}

const delQJInvoice = async (id_list: Array<number>) => {
  let data: delQJInvoiceBody = {
    id_list: id_list
  }
  await apiDelQJInvoice(data).then((res: Result) => {
    let {code, data, message} = res
    if (code === 0) {
      layer.msg('已删除', {icon: 1, time: 1000})
      queryDataSource()
    } else {
      layer.msg(message)
    }
  })
}

const delQJInvoiceConfirm = (id_list: Array<any>) => {
  layer.confirm('确定要删除吗?', {
    title: '提示',
    icon: 3,
    yes: (index: string) => {
      let id_list_: Array<number> = []
      for (let item of id_list) {
        if (item.status === 0) {
          id_list_.push(item.id)
        } else {
          layer.msg('只有未开具的发票才可以删除！', {icon: 2, time: 1000})
          return
        }
      }
      delQJInvoice(id_list_)
      layer.close(index)
    }
  })
}
const redInvoice = async (row: any) => {
  let data: redQJInvoiceBody = {
    id: row.id
  }
  await apiRedQJInvoice(data).then((res: Result) => {
    let {code, data, message} = res
    if (code === 0) {
      layer.msg('已申请冲红', {icon: 1, time: 1000})
      queryDataSource()
    } else {
      layer.msg(message)
    }
  })
}

const redInvoiceConfirm = (row: any) => {
  layer.confirm('确定要冲红吗?', {
    title: '提示',
    icon: 3,
    yes: (index: string) => {
      redInvoice(row)
      layer.close(index)
    }
  })
}

const columns = ref([
  {title: '选项', width: '60px', type: 'checkbox', fixed: 'left'},
  {title: 'ID', width: '80px', key: 'id', sort: 'desc', fixed: 'left'},
  {title: '开具状态', width: '120px', key: 'status', sort: 'desc', customSlot: 'status'},
  {title: '推送状态', width: '120px', key: 'push_status', sort: 'desc', customSlot: 'push_status'},
  {title: '开具日期', width: '180px', key: 'invoice_date', sort: 'desc'},
  {title: '发票类型', width: '150px', key: 'invoice_type', sort: 'desc', customSlot: 'invoice_type'},
  {title: '发票抬头', width: '200px', key: 'invoice_title', sort: 'desc'},
  {title: '发票税号', width: '220px', key: 'tax_no', sort: 'desc'},
  {title: '公司地址', width: '220px', key: 'address', sort: 'desc'},
  {title: '公司电话', width: '150px', key: 'phone', sort: 'desc'},
  {title: '开户银行', width: '200px', key: 'bank_name', sort: 'desc'},
  {title: '银行账号', width: '180px', key: 'bank_account', sort: 'desc'},
  {title: '发票税率', width: '100px', key: 'tax_point', sort: 'desc', customSlot: 'tax_point'},
  {title: '发票金额', width: '100px', key: 'invoice_amount', sort: 'desc', totalRow: true},
  {title: '发票内容', width: '300px', key: 'invoice_content', sort: 'desc'},
  {title: '接收邮箱', width: '300px', key: 'receive_email', sort: 'desc'},
  {title: '登记备注', width: '300px', key: 'invoice_remark', sort: 'desc'},
  {title: '推送时间', width: '160px', key: 'push_time', sort: 'desc', customSlot: 'push_time'},
  {title: '更新时间', width: '160px', key: 'update_time', sort: 'desc', customSlot: 'update_time'},
  {title: '更新人', width: '120px', key: 'update_user_name', sort: 'desc'},
  {title: '创建时间', width: '160px', key: 'create_time', sort: 'desc', customSlot: 'create_time'},
  {title: '创建人', width: '120px', key: 'create_user_name', sort: 'desc'},
  {
    title: '操作',
    width: '310px',
    customSlot: 'operator',
    key: 'operator',
    fixed: 'right'
  }
])
const loading = ref(false)
const dataSource = ref()
const selectedKeys = ref<number[]>([])
const page = reactive({current: 1, limit: 10, total: 0})

const query = ref({
  invoice_title: '',
  tax_no: '',
  invoice_type: -1,
  status: -1,
  create_time: [],
  update_time: [],
})
const showInvoiceFile = (row: any) => {
  window.open(config.baseURL + '/' + row.invoice_file, '_blank')
}
const saveAddQJInvoice = async () => {
  let data: addQJInvoiceBody = model.value
  await apiAddQJInvoice(data).then((res: Result) => {
    let {code, data, message} = res
    if (code === 0) {
      toCancel()
      queryDataSource()
    } else {
      layer.msg(message)
    }
  })
}

const saveEditQJInvoice = async () => {
  let data: editQJInvoiceBody = {
    id: currentRow.value.id,
    invoice_title: model.value.invoice_title,
    tax_no: model.value.tax_no,
    invoice_type: model.value.invoice_type,
    address: model.value.address,
    phone: model.value.phone,
    bank_name: model.value.bank_name,
    bank_account: model.value.bank_account,
    invoice_content: model.value.invoice_content,
    receive_email: model.value.receive_email,
    invoice_amount: model.value.invoice_amount,
    tax_point: model.value.tax_point,
    invoice_remark: model.value.invoice_remark,
  }
  await apiEditQJInvoice(data).then((res: Result) => {
    let {code, data, message} = res
    if (code === 0) {
      toCancel()
      queryDataSource()
    } else {
      layer.msg(message)
    }
  })
}


const toSubmit = () => {
  if (title.value === '新增') {
    saveAddQJInvoice()
  } else if (title.value === '编辑') {
    saveEditQJInvoice()
  }
}

const toSearch = () => {
  page.current = 1
  queryDataSource()
}
const toReset = () => {
  query.value = {
    invoice_title: '',
    tax_no: '',
    invoice_type: -1,
    status: -1,
    create_time: [],
    update_time: [],
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


const queryDataSource = async () => {
  loading.value = true
  let data: queryQJInvoiceBody = {
    invoice_title: query.value.invoice_title,
    tax_no: query.value.tax_no,
    invoice_type: query.value.invoice_type,
    status: query.value.status,
    create_time: query.value.create_time,
    update_time: query.value.update_time,
    page: page.current,
    limit: page.limit,
  }
  await apiQueryQJInvoice(data).then((res: Result) => {
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
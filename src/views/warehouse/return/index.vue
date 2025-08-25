<template>
  <lay-container fluid="true" class="user-box">
    <lay-card>
      <lay-form style="margin-top: 10px" @keyup.enter="toSearch">
        <lay-row :space="30">
          <lay-col :md="6">
            <lay-form-item label="选择类目" label-width="80">
              <lay-select
                  placeholder="请选择"
                  v-model="query.class_id"
                  :show-search="true"
                  style="width: 100%"
                  :multiple="true"
              >
                <template #header>
                  <div style="padding: 10px">
                    <lay-checkbox v-model="checkboxValue" skin="primary"
                                  @change="selectAllChange" :value="-1">全部分类
                    </lay-checkbox>
                  </div>
                </template>
                <!--                <lay-select-option :value="-1" label="全部分类"></lay-select-option>-->
                <template v-for="key in classList">
                  <lay-select-option :value="key.id" :label="key.name"></lay-select-option>
                </template>
              </lay-select>
            </lay-form-item>
          </lay-col>
          <lay-col :md="7">
            <lay-form-item label="店铺" label-width="80">
              <lay-select v-model="query.shop_id" style="width: 100%" multiple>
                <lay-select-option :value="-1" label="全部"></lay-select-option>
                <template v-for="shop of shopList">
                  <lay-select-option :value="shop.id">{{ shop.name }}</lay-select-option>
                </template>
              </lay-select>
            </lay-form-item>
          </lay-col>
          <lay-col :md="5">
            <lay-form-item label="退货单据号" label-width="80">
              <lay-input
                  v-model="query.br_id"
                  :allow-clear="true"
              ></lay-input>
            </lay-form-item>
          </lay-col>
          <lay-col :md="5">
            <lay-form-item label="订单编号" label-width="80">
              <lay-input
                  v-model="query.order_no"
                  :allow-clear="true"
              ></lay-input>
            </lay-form-item>
          </lay-col>
          <lay-col :md="5">
            <lay-form-item label="物流单号" label-width="80">
              <lay-input
                  v-model="query.logistics_no"
                  :allow-clear="true"
              ></lay-input>
            </lay-form-item>
          </lay-col>
          <lay-col :md="5">
            <lay-form-item label="入库单号" label-width="80">
              <lay-input
                  v-model="query.put_in_warehouse_no"
                  :allow-clear="true"
              ></lay-input>
            </lay-form-item>
          </lay-col>
          <lay-col :md="5">
            <lay-form-item label="溯源码" label-width="80">
              <lay-input
                  v-model="query.product_code"
                  :allow-clear="true"
                  style="width: 98%"
              ></lay-input>
            </lay-form-item>
          </lay-col>
          <lay-col :md="5">
            <lay-form-item label="托盘编号" label-width="80">
              <lay-input
                  v-model="query.tray_no"
                  :allow-clear="true"
                  style="width: 98%"
              ></lay-input>
            </lay-form-item>
          </lay-col>
          <lay-col :md="5">
            <lay-form-item label="产品型号" label-width="80">
              <lay-input
                  v-model="query.product_model"
                  :allow-clear="true"
              ></lay-input>
            </lay-form-item>
          </lay-col>
          <lay-col :md="6">
            <lay-form-item label="确认时间" label-width="80">
              <lay-date-picker
                  :simple="true"
                  v-model="query.confirm_time"
                  :range="true"
                  :allow-clear="true"
                  style="width: 250px"
              ></lay-date-picker>
            </lay-form-item>
          </lay-col>
          <lay-col :md="6">
            <lay-form-item label="入库时间" label-width="80">
              <lay-date-picker
                  :simple="true"
                  v-model="query.put_in_warehouse_time"
                  :range="true"
                  :allow-clear="true"
                  style="width: 250px"
              ></lay-date-picker>
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
          <lay-col :md="6">
            <lay-form-item label="品质类型" label-width="80">
              <lay-select v-model="query.quality_type">
                <lay-select-option :value="-1" label="全部"></lay-select-option>
                <lay-select-option :value="0" label="待定"></lay-select-option>
                <lay-select-option :value="1" label="正品"></lay-select-option>
                <lay-select-option :value="2" label="次品"></lay-select-option>
                <lay-select-option :value="3" label="二手销售"></lay-select-option>
                <lay-select-option :value="4" label="报废"></lay-select-option>
              </lay-select>
            </lay-form-item>
          </lay-col>
          <lay-col :md="6">
            <lay-form-item label="退货仓库" label-width="80">
              <lay-select v-model="query.warehouse_name">
                <lay-select-option :value="-1" label="全部"></lay-select-option>
                <lay-select-option :value="0" label="待定"></lay-select-option>
                <lay-select-option :value="1" label="正品仓"></lay-select-option>
                <lay-select-option :value="4" label="次转正仓"></lay-select-option>
                <lay-select-option :value="2" label="次品仓"></lay-select-option>
                <lay-select-option :value="3" label="报废仓"></lay-select-option>
              </lay-select>
            </lay-form-item>
          </lay-col>
          <lay-col :md="6">
            <lay-form-item label="维修状态" label-width="80">
              <lay-select v-model="query.repair_status">
                <lay-select-option :value="-1" label="全部"></lay-select-option>
                <lay-select-option :value="0" label="待检测"></lay-select-option>
                <lay-select-option :value="1" label="已检测"></lay-select-option>
                <lay-select-option :value="2" label="待维修"></lay-select-option>
                <lay-select-option :value="3" label="已维修"></lay-select-option>
              </lay-select>
            </lay-form-item>
          </lay-col>
          <lay-col :md="6">
            <lay-form-item label="退货状态" label-width="80">
              <lay-select v-model="query.status">
                <lay-select-option :value="-1" label="全部"></lay-select-option>
                <lay-select-option :value="0" label="待确认"></lay-select-option>
                <lay-select-option :value="1" label="已确认"></lay-select-option>
                <lay-select-option :value="2" label="已入库"></lay-select-option>
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
          <lay-button type="primary" size="sm" @click="setTray">
            <lay-icon class="layui-icon-template-one"></lay-icon>
            设置托盘
          </lay-button>
          <lay-button size="sm" @click="setProductTray('')">
            <lay-icon class="layui-icon-template-one"></lay-icon>
            脱离托盘
          </lay-button>
          <lay-button type="normal" size="sm" @click="backProductAddWarehouseWindow">
            <lay-icon class="layui-icon-template-one"></lay-icon>
            入库单号
          </lay-button>
          <lay-button type="primary" size="sm" @click="backProductPutInWarehouseNoConfirmWindow">
            <lay-icon class="layui-icon-template-one"></lay-icon>
            入库确认
          </lay-button>
          <lay-button size="sm" @click="backProductPutInWarehouseNoCancelWindow">
            <lay-icon class="layui-icon-template-one"></lay-icon>
            入库反确认
          </lay-button>
          <lay-button size="sm" @click="exportBackProductPart(selectedKeys)">
            <lay-icon class="layui-icon-template-one"></lay-icon>
            次品明细导出
          </lay-button>
        </template>
        <template v-slot:operator="{ row }">
          <lay-button
              size="xs"
              type="primary"
              @click="changeVisible('维修配件', row)"
          >维修配件
          </lay-button
          >
        </template>
        <template #status="{ data }">
          {{ getStatus(data.status) }}
        </template>
        <template #repair_status="{ data }">
          {{ getRepairStatus(data.repair_status) }}
        </template>
        <template #quality_type="{ data }">
          {{ getQualityType(data.quality_type) }}
        </template>
        <template #warehouse_name="{ data }">
          {{ getWarehouseName(data.warehouse_name) }}
        </template>
        <template #complete_time="{ data }">
          {{ convertTime(data.complete_time) }}
        </template>
        <template #create_time="{ data }">
          {{ convertTime(data.create_time) }}
        </template>
        <template #update_time="{ data }">
          {{ convertTime(data.update_time) }}
        </template>
        <template #confirm_time="{ data }">
          {{ convertTime(data.confirm_time) }}
        </template>
        <template #put_in_warehouse_time="{ data }">
          {{ convertTime(data.put_in_warehouse_time) }}
        </template>
      </lay-table>
    </lay-card>
  </lay-container>
  <lay-layer v-model="partVisible" title="维修配件" :area="['1400px', '800px']">
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
          <lay-button size="sm" type="primary" @click="searchPartVisible(0)">
            <lay-icon class="layui-icon-addition"></lay-icon>
            新增机器配件
          </lay-button>
          <lay-button size="sm" type="primary" @click="searchPartVisible(1)">
            <lay-icon class="layui-icon-addition"></lay-icon>
            新增通用配件
          </lay-button>
          <lay-button size="sm" type="danger" @click="productPartRemove(selectedKeys2)">
            <lay-icon class="layui-icon-delete"></lay-icon>
            删除
          </lay-button>
        </template>
        <template v-slot:operator="{ row }">
          <lay-button size="xs" type="danger" @click="productPartRemove([row.id])"
          >删除
          </lay-button>
        </template>
        <template #count="{ row }">
          <lay-input-number v-model="row.count" :min="0" @change="changeProductPartCount(row)"/>
        </template>
        <template #get_product_part_status="{ data }">
          {{ getProductPartStatus(data.status) }}
        </template>
        <template #use_time="{ data }">
          {{ convertTime(data.use_time) }}
        </template>
      </lay-table>
      <lay-button type="primary" style="margin: 10px 10px" @click="setProductPartStatus([currentRow.id],1)">
        检测完成
      </lay-button>
      <lay-button style="margin: 10px 10px" @click="setProductPartStatus([currentRow.id],0)">恢复待检</lay-button>
    </lay-card>
  </lay-layer>
  <lay-layer v-model="addPartVisible" :title="partVisibleTitle" :area="['1000px', '750px']">
    <lay-card>
      <lay-form :model="searchPartForm">
        <lay-row>
          <lay-col :md="8">
            <lay-form-item label="商品名称" prop="name">
              <lay-input v-model="searchPartForm.product_model"/>
            </lay-form-item>
          </lay-col>
          <lay-col :md="4">
            <lay-form-item label=" " label-width="10px">
              <lay-button type="primary" @click="loadDataSource3(searchPartForm.product_model)">查询</lay-button>
            </lay-form-item>
          </lay-col>
        </lay-row>
      </lay-form>
    </lay-card>
    <div style="">
      <lay-card>
        <lay-table
            :height="'580px'"
            :columns="columns3"
            :loading="loading3"
            :default-toolbar="true"
            :data-source="dataSource3"
            v-model:selected-keys="selectedKeys3"
        >
          <template v-slot:toolbar>
            <lay-button size="sm" type="primary" @click="saveSearchPart">
              <lay-icon class="layui-icon-ok"></lay-icon>
              保存
            </lay-button>
          </template>
        </lay-table>
      </lay-card>
    </div>
  </lay-layer>
</template>
<script setup lang="ts">
import {onMounted, reactive, ref} from 'vue'
import {apiQueryShop} from "@/api/module/shop";
import {layer} from "@layui/layui-vue";
import {getShopQueryBody} from "@/types/shop";
import {
  convertTime,
  getProductPartStatus,
  getQualityType,
  getRepairStatus,
  getStatus,
  getWarehouseName
} from "@/utils/globalFunctions";
import {
  getBackQueryBody,
  saveProductPartBody, setProductPartCountBody,
  setProductPartStatusBody, setProductTrayBody
} from "@/types/warehouse-return";
import {
  apiBackProductPutInWarehouseNoCancel,
  apiBackProductPutInWarehouseNoConfirm,
  apiDelProductPart, apiExportProductPart,
  apiGetProductPart,
  apiQueryBack,
  apiQueryProductPart,
  apiSaveProductPart, apiSetProductPartCount, apiSetProductPartStatus, apiSetProductTray
} from "@/api/module/warehouse-return";
import {apiGetAllClasses} from "@/api/module/product";
import {setBackProductWarehouseNoBody} from "@/types/warehouse-back";
import {apiSetBackProductWarehouseNo} from "@/api/module/warehouse-back";

defineOptions({
  name: 'WarehouseReturn'
})

const checkboxValue = ref(true)
const selectAllChange = () => {
  if (checkboxValue.value) {
    query.value.class_id = classList.value.map((item: any) => item.id)
  } else {
    query.value.class_id = []
  }
}
const searchPartForm = ref({
  product_model: ''
})

const columns = ref([
  {title: '选项', width: '60px', type: 'checkbox', fixed: 'left'},
  {title: '序号', width: '60px', type: 'number', fixed: 'left'},
  {title: 'ID', width: '100px', key: 'id', sort: 'desc', fixed: 'left', hide: true},
  {title: '退货状态', width: '100px', key: 'status', sort: 'desc', customSlot: 'status', resize: true},
  {title: '订单编号', width: '200px', key: 'order_no', sort: 'desc', resize: true},
  {title: '入库单号', width: '200px', key: 'put_in_warehouse_no', sort: 'desc', resize: true},
  {title: '物流单号', width: '200px', key: 'logistics_no', sort: 'desc', resize: true},
  {title: '店铺名称', width: '250px', key: 'shop', sort: 'desc', resize: true},
  {title: '客服备注', width: '250px', key: 'kf_remark', sort: 'desc', resize: true},
  {title: '仓库名称', width: '160px', key: 'warehouse_name', sort: 'desc', customSlot: 'warehouse_name', resize: true},
  {title: '产品型号', width: '150px', key: 'product_model', sort: 'desc', resize: true},
  {title: '品质类型', width: '160px', key: 'quality_type', sort: 'desc', customSlot: 'quality_type', resize: true},
  {title: '产品数量', width: '150px', key: 'count', sort: 'desc', hide: true, resize: true},
  {title: '产品名称', width: '150px', key: 'product_name', sort: 'desc', resize: true},
  {title: '退货单据号', width: '200px', key: 'br_id', sort: 'desc', resize: true},
  {title: '维修状态', width: '100px', key: 'repair_status', sort: 'desc', customSlot: 'repair_status', resize: true},
  {title: '溯源码', width: '160px', key: 'product_code', sort: 'desc', resize: true},
  {title: '托盘编号', width: '120px', key: 'tray_no', sort: 'desc', resize: true},
  {title: '确认时间', width: '160px', key: 'confirm_time', sort: 'desc', customSlot: 'confirm_time', resize: true},
  {
    title: '入库时间',
    width: '160px',
    key: 'put_in_warehouse_time',
    sort: 'desc',
    customSlot: 'put_in_warehouse_time',
    resize: true
  },
  {
    title: '维修完成时间',
    width: '160px',
    key: 'complete_time',
    sort: 'desc',
    customSlot: 'complete_time',
    resize: true
  },
  {title: '更新时间', width: '160px', key: 'update_time', sort: 'desc', customSlot: 'update_time', resize: true},
  {title: '更新人', width: '120px', key: 'update_user_name', sort: 'desc', resize: true},
  {title: '创建时间', width: '160px', key: 'create_time', sort: 'desc', customSlot: 'create_time', resize: true},
  {title: '创建人', width: '120px', key: 'create_user_name', sort: 'desc', resize: true},
  {
    title: '操作',
    width: '120px',
    customSlot: 'operator',
    key: 'operator',
    fixed: 'right'
  }
])
const columns2 = ref([
  {title: '选项', width: '60px', type: 'checkbox'},
  {title: 'ID', width: '100px', key: 'id', hide: true},
  {title: '配件状态', width: '80px', key: 'status', customSlot: 'get_product_part_status'},
  {title: '配件名称', width: '150px', key: 'part_name'},
  {title: '配件型号', width: '150px', key: 'part_model'},
  {title: '配件数量', width: '100px', key: 'count', customSlot: 'count'},
  {title: '使用时间', width: '160px', key: 'use_time', customSlot: 'use_time'},
  {title: '备注', width: '160px', key: 'remark'},
  {
    title: '操作',
    width: '80px',
    customSlot: 'operator',
    key: 'operator',
    fixed: 'right'
  }
])
const columns3 = ref([
  {title: '选项', width: '60px', type: 'checkbox'},
  {title: 'ID', width: '100px', key: 'id', hide: true},
  {title: '配件名称', width: '150px', key: 'part_name'},
  {title: '配件型号', width: '150px', key: 'part_model'},
  {title: '备注', width: '160px', key: 'remark'}
])
const partVisibleTitle = ref('')
const shopList = ref()
const loading = ref(false)
const loading2 = ref(false)
const loading3 = ref(false)
const dataSource = ref()
const dataSource2 = ref()
const dataSource3 = ref()
const selectedKeys = ref<number[]>([])
const selectedKeys2 = ref<number[]>([])
const selectedKeys3 = ref<number[]>([])
const title = ref('')
const page = reactive({current: 1, limit: 100, total: 0, limits: [50, 100, 200, 500, 1000, 2000, 5000, 10000]})
const partVisible = ref(false)
const addPartVisible = ref(false)
const currentRow = ref()
const query = ref({
  br_id: '',
  order_no: '',
  product_code: '',
  put_in_warehouse_no: '',
  logistics_no: '',
  tray_no: '',
  product_model: '',
  shop_id: [-1],
  class_id: [-1],
  confirm_time: [],
  put_in_warehouse_time: [],
  create_time: [],
  update_time: [],
  repair_status: -1,
  repair_type: -1,
  quality_type: -1,
  status: -1,
  warehouse_name: -1,
})


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


const exportBackProductPart = async (id_list: Array<number>) => {
  await apiExportProductPart(id_list).then(res => {
    downloadBlob(res, `【次品】配件明细导出.csv`)
  })
}

const changeProductPartCount = async (row: any) => {
  let data: setProductPartCountBody = {
    part_id: row.id,
    count: row.count
  }
  await apiSetProductPartCount(data).then((res: Result) => {
    let {code, message} = res
    if (code === 0) {
      layer.msg('设置成功', {icon: 1, time: 2000})
      loadDataSource2()
    } else {
      layer.msg(message, {icon: 2, time: 2000})
    }
  })
}
const setTray = async () => {
  if (selectedKeys.value.length === 0) {
    layer.msg('请选择要设置的托盘', {icon: 2, time: 2000})
    return
  }
  layer.prompt({
    formType: 0,
    title: '设置托盘',
    placeholder: '请输入托盘号',
    area: ['400px', '200px'],
    yes: (id: string, value: string) => {
      if (value === '') {
        layer.msg('请输入托盘编号', {icon: 2, time: 2000})
        return
      }
      setProductTray(value)
      layer.close(id)
    }
  })
}
const setProductTray = async (tray_no: string) => {
  let data: setProductTrayBody = {
    id_list: selectedKeys.value,
    tray_no: tray_no
  }
  await apiSetProductTray(data).then((res: Result) => {
    let {code, message} = res
    if (code === 0) {
      layer.msg('设置成功', {icon: 1, time: 2000})
      queryDataSource()
    } else {
      layer.msg(message, {icon: 2, time: 2000})
    }
  })
}

const setRowWarehouseNo = (id_list: Array<number>, warehouse_no: string) => {
  for (let i = 0; i < id_list.length; i++) {
    let index = getCurrentRowIndex(id_list[i])
    if (index === -1) {
      continue
    }
    dataSource.value[index].put_in_warehouse_no = warehouse_no
  }
}
const setbackProductWarehouseNo = (id_list: Array<number>, warehouse_no: string, index: string) => {
  let data: setBackProductWarehouseNoBody = {
    id_list: id_list,
    put_in_warehouse_no: warehouse_no
  }
  apiSetBackProductWarehouseNo(data).then(res => {
    let {code, message} = res
    if (code === 0) {
      layer.msg('操作成功')
      setRowWarehouseNo(id_list, warehouse_no)
      selectedKeys.value = []
      layer.close(index)
    } else {
      layer.msg(message)
    }
  })
}
const getCurrentRowIndex = (row_id: number) => {
  for (let i = 0; i < dataSource.value.length; i++) {
    if (dataSource.value[i].id === row_id) {
      return i
    }
  }
  return -1
}
const getCurrentRow = (row_id: number) => {
  for (let item of dataSource.value) {
    if (item.id === row_id) {
      return item
    }
  }
  return null
}
const backProductAddWarehouseWindow = () => {
  if (selectedKeys.value.length === 0) {
    layer.msg('请选择需要入库的商品')
    return
  }
  for (let row_id of selectedKeys.value) {
    let item = getCurrentRow(row_id)
    if (item === null) {
      layer.msg('数据异常，数据不存在！')
      return
    }
    if (item.status !== 1) {
      layer.msg('请确认后再填写入库单号！')
      return
    }
  }
  layer.prompt({
    formType: 0,
    title: '填写入库单号',
    placeholder: '',
    area: ['300px', '200px'],
    yes: (index: string, value: string) => {
      setbackProductWarehouseNo(selectedKeys.value, value, index)
    }
  })
}
const backProductPutInWarehouseNoConfirm = async (data: Array<number>) => {
  await apiBackProductPutInWarehouseNoConfirm(data).then((res: Result) => {
    let {code, message} = res
    if (code === 0) {
      layer.msg('操作成功')
      queryDataSource()
    } else {
      layer.msg(message, {icon: 2, time: 2000})
    }
  })
}


const backProductPutInWarehouseNoConfirmWindow = () => {
  if (selectedKeys.value.length === 0) {
    layer.msg('请选择需要确认入库的商品')
    return
  }
  for (let row_id of selectedKeys.value) {
    let item = getCurrentRow(row_id)
    if (item === null) {
      layer.msg('数据异常，数据不存在！')
      return
    }
    if (item.status === 2) {
      layer.msg('已入库的商品，不可重复操作！')
      return
    }
    if (item.status !== 1 && item.put_in_warehouse_no !== '') {
      layer.msg('请确认退货商品,填写完入库单号后再确认入库！')
      return
    }
    backProductPutInWarehouseNoConfirm(selectedKeys.value)
  }
}
const backProductPutInWarehouseNoCancelWindow = () => {
  if (selectedKeys.value.length === 0) {
    layer.msg('请选择需要反确认入库的商品')
    return
  }
  for (let row_id of selectedKeys.value) {
    let item = getCurrentRow(row_id)
    if (item === null) {
      layer.msg('数据异常，数据不存在！')
      return
    }
    if (item.status !== 2) {
      layer.msg('非确认入库的商品，不可操作！')
      return
    }
    backProductPutInWarehouseNoCancel(selectedKeys.value)
  }
}
const backProductPutInWarehouseNoCancel = async (data: Array<number>) => {
  await apiBackProductPutInWarehouseNoCancel(data).then((res: Result) => {
    let {code, message} = res
    if (code === 0) {
      layer.msg('操作成功')
      queryDataSource()
    } else {
      layer.msg(message, {icon: 2, time: 2000})
    }
  })
}


const searchPartVisible = (type: number) => {
  addPartVisible.value = !addPartVisible.value
  if (type === 0) {
    partVisibleTitle.value = '新增机器配件'
    searchPartForm.value.product_model = currentRow.value.product_model
    loadDataSource3(currentRow.value.product_model)
  } else {
    partVisibleTitle.value = '新增通用配件'
    searchPartForm.value.product_model = "通用维修配件"
    loadDataSource3("通用维修配件")
  }
}

const loadDataSource3 = async (product_model: string) => {
  loading3.value = true
  await apiQueryProductPart({product_model: product_model}).then((res: Result) => {
    let {code, data, message} = res
    if (code === 0) {
      dataSource3.value = data
      selectedKeys3.value = []
    } else {
      layer.msg(message, {icon: 2, time: 2000})
    }
  })
  loading3.value = false
}

const saveSearchPart = async () => {
  let data: saveProductPartBody = {
    id: currentRow.value.id,
    part_list: selectedKeys3.value
  }
  await apiSaveProductPart(data).then((res: Result) => {
    let {code, message} = res
    if (code === 0) {
      loadDataSource2()
      addPartVisible.value = !addPartVisible.value
    } else {
      layer.msg(message, {icon: 2, time: 2000})
    }
  })
}

const loadDataSource2 = async () => {
  loading2.value = true
  await apiGetProductPart({id: currentRow.value.id}).then((res: Result) => {
    let {code, data, message} = res
    if (code === 0) {
      dataSource2.value = data
      selectedKeys2.value = []
    } else {
      layer.msg(message, {icon: 2, time: 2000})
    }
  })
  loading2.value = false
}

const setProductPartStatus = async (id_list: Array<number>, repair_status: number) => {
  let data: setProductPartStatusBody = {
    id_list: id_list,
    repair_status: repair_status
  }
  await apiSetProductPartStatus(data).then((res: Result) => {
    let {code, message} = res
    if (code === 0) {
      queryDataSource()
      partVisible.value = !partVisible.value
    } else {
      layer.msg(message, {icon: 2, time: 2000})
    }
  })


}
const loadShopList = async () => {
  let data: getShopQueryBody = {
    name: '',
    code_str: '',
    status: 0
  }
  await apiQueryShop(data).then((res: Result) => {
    let {code, data, message} = res
    if (code === 0) {
      shopList.value = data
    } else {
      layer.msg(message, {icon: 2, time: 2000})
    }
  })
}
const changeVisible = (curr_title: string, row: any) => {
  title.value = curr_title
  currentRow.value = row
  partVisible.value = !partVisible.value
  loadDataSource2()
}
const classList = ref()
const getAllProductClass = () => {
  apiGetAllClasses().then((res: Result) => {
    let {code, data, message} = res
    if (code === 0) {
      classList.value = data
      selectAllChange()
      return true
    } else {
      layer.msg(message, {icon: 2, time: 2000})
    }
  })
  return false
}

const toSearch = () => {
  page.current = 1
  queryDataSource()
}
const toReset = () => {
  query.value = {
    br_id: '',
    order_no: '',
    put_in_warehouse_no: '',
    product_code: '',
    logistics_no: '',
    tray_no: '',
    product_model: '',
    shop_id: [-1],
    class_id: [-1],
    confirm_time: [],
    put_in_warehouse_time: [],
    create_time: [],
    update_time: [],
    repair_status: -1,
    repair_type: -1,
    quality_type: -1,
    status: -1,
    warehouse_name: -1,
  }
}


const queryDataSource = async () => {
  loading.value = true
  let data: getBackQueryBody = {
    br_id: query.value.br_id,
    order_no: query.value.order_no,
    put_in_warehouse_no: query.value.put_in_warehouse_no,
    product_code: query.value.product_code,
    tray_no: query.value.tray_no,
    product_model: query.value.product_model,
    shop_id: query.value.shop_id,
    class_id: query.value.class_id,
    confirm_time: query.value.confirm_time,
    put_in_warehouse_time: query.value.put_in_warehouse_time,
    create_time: query.value.create_time,
    update_time: query.value.update_time,
    repair_status: query.value.repair_status,
    repair_type: query.value.repair_type,
    quality_type: query.value.quality_type,
    status: query.value.status,
    warehouse_name: query.value.warehouse_name,
    logistics_no: query.value.logistics_no,
    page: page.current,
    limit: page.limit,
  }
  await apiQueryBack(data).then((res: DataResult) => {
    let {code, data, total, message} = res
    if (code === 0) {
      dataSource.value = data
      page.total = total
      selectedKeys.value = []
    } else {
      layer.msg(message, {icon: 2, time: 2000})
    }
  })
  loading.value = false
}

const productPartRemove = (id_list: Array<number>) => {
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
  let data: saveProductPartBody = {
    id: currentRow.value.id,
    part_list: id_list
  } // 构建请求数据
  await apiDelProductPart(data).then((res: Result) => {
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
  getAllProductClass()
  loadShopList()
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
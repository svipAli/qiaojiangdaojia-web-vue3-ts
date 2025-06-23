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
                <lay-select-option :value="-1" label="全部分类"></lay-select-option>
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
        <template #repair_type="{ data }">
          {{ getRepairType(data.repair_type) }}
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
          <lay-button size="sm" type="primary" @click="loadDataSource2">
            <lay-icon class="layui-icon-refresh"></lay-icon>
            刷新配件
          </lay-button>
        </template>
        <template #use_count="{ row }">
          <lay-input-number v-model="row.use_count" :min="0" :max="row.count"
                            @change="changeProductPartUserCount(row)"/>
        </template>
        <template #residue_count="{ data }">
          {{ data.count - data.use_count }}
        </template>
        <template #get_product_part_status="{ data }">
          {{ getProductPartStatus(data.status) }}
        </template>
        <template #use_time="{ data }">
          {{ convertTime(data.use_time) }}
        </template>
      </lay-table>
      <lay-button type="primary" style="margin: 10px 10px" @click="setProductRepairType([currentRow.id],1)">
        换包装完成
      </lay-button>
      <lay-button type="primary" style="margin: 10px 10px" @click="setProductRepairType([currentRow.id],2)">
        拆修完成
      </lay-button>
      <lay-button style="margin: 10px 10px" @click="setProductRepairType([currentRow.id],0)">恢复待修</lay-button>
    </lay-card>
  </lay-layer>
</template>
<script setup lang="ts">
import {onMounted, reactive, ref} from 'vue'
import {apiQueryShop} from "@/api/module/shop";
import {layer} from "@layui/layui-vue";
import {getShopQueryBody} from "@/types/shop";
import {convertTime} from "@/utils/globalFunctions";
import {
  getBackQueryBody,
} from "@/types/warehouse-return";
import {
  apiGetProductPart,
  apiQueryBack,
} from "@/api/module/warehouse-return";
import {apiGetAllClasses} from "@/api/module/product";
import {apiSetProductPartUseCount, apiSetProductRepairType} from "@/api/module/warehouse-repair";
import {setProductPartUseCountBody, setProductRepairTypeBody} from "@/types/warehouse-repair";


defineOptions({
  name: 'WarehouseRepair'
})


const getRepairType = (repair_type: number) => {
  switch (repair_type) {
    case 0:
      return "待维修";
    case 1:
      return "换包装维修";
    case 2:
      return "拆机维修";
    default:
      return "未知";

  }
}
const getStatus = (status: number) => {
  switch (status) {
    case 0:
      return "待确认";
    case 1:
      return "已确认";
    case 2:
      return "已入库";
    default:
      return "未知";
  }
}
const getRepairStatus = (repair_status: number) => {
  switch (repair_status) {
    case 0:
      return "待检测";
    case 1:
      return "已检测";
    case 2:
      return "待维修";
    case 3:
      return "已维修";
    default:
      return "未知";

  }
}
const getQualityType = (quality_type: number) => {
  switch (quality_type) {
    case 0:
      return "待定";
    case 1:
      return "正品";
    case 2:
      return "次品";
    case 3:
      return "二手销售";
    case 4:
      return "报废";
    default:
      return "未知";

  }
}

const getWarehouseName = (warehouse_name: number) => {
  switch (warehouse_name) {
    case 0:
      return "待定";
    case 1:
      return "正品仓";
    case 2:
      return "次品仓";
    case 3:
      return "报废仓";
    case 4:
      return "次转正仓";
    default:
      return "未知";

  }
}

const getProductPartStatus = (status: number) => {
  switch (status) {
    case 0:
      return "未使用";
    case 1:
      return "已使用";
    default:
      return "未知";
  }
}

const columns = ref([
  {title: '选项', width: '60px', type: 'checkbox', fixed: 'left'},
  {title: 'ID', width: '100px', key: 'id', sort: 'desc', fixed: 'left'},
  {title: '维修状态', width: '100px', key: 'repair_status', sort: 'desc', customSlot: 'repair_status'},
  {title: '维修方式', width: '100px', key: 'repair_type', sort: 'desc', customSlot: 'repair_type'},
  {title: '退货状态', width: '100px', key: 'status', sort: 'desc', customSlot: 'status'},
  {title: '托盘编号', width: '120px', key: 'tray_no', sort: 'desc'},
  {title: '订单编号', width: '200px', key: 'order_no', sort: 'desc'},
  {title: '溯源码', width: '160px', key: 'product_code', sort: 'desc'},
  {title: '产品型号', width: '150px', key: 'product_model', sort: 'desc'},
  {title: '产品数量', width: '150px', key: 'count', sort: 'desc', hide: true},
  {title: '产品名称', width: '150px', key: 'product_name', sort: 'desc'},
  {title: '退货单据号', width: '200px', key: 'br_id', sort: 'desc'},
  {title: '物流单号', width: '200px', key: 'logistics_no', sort: 'desc'},
  {title: '入库单号', width: '200px', key: 'put_in_warehouse_no', sort: 'desc'},
  {title: '店铺名称', width: '250px', key: 'shop', sort: 'desc'},
  {title: '品质类型', width: '160px', key: 'quality_type', sort: 'desc', customSlot: 'quality_type'},
  {title: '仓库名称', width: '160px', key: 'warehouse_name', sort: 'desc', customSlot: 'warehouse_name'},
  {title: '确认时间', width: '160px', key: 'confirm_time', sort: 'desc', customSlot: 'confirm_time'},
  {title: '入库时间', width: '160px', key: 'put_in_warehouse_time', sort: 'desc', customSlot: 'put_in_warehouse_time'},
  {title: '维修完成时间', width: '160px', key: 'complete_time', sort: 'desc', customSlot: 'complete_time'},
  {title: '更新时间', width: '160px', key: 'update_time', sort: 'desc', customSlot: 'update_time'},
  {title: '更新人', width: '120px', key: 'update_user_name', sort: 'desc'},
  {title: '创建时间', width: '160px', key: 'create_time', sort: 'desc', customSlot: 'create_time'},
  {title: '创建人', width: '120px', key: 'create_user_name', sort: 'desc'},
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
  {title: '配件数量', width: '100px', key: 'count', align: 'center'},
  {title: '使用数量', width: '100px', key: 'use_count', customSlot: 'use_count'},
  {title: '剩余数量', width: '100px', key: 'residue_count', customSlot: 'residue_count', align: 'center'},
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
const shopList = ref()
const loading = ref(false)
const loading2 = ref(false)
const dataSource = ref()
const dataSource2 = ref()
const selectedKeys = ref<number[]>([])
const selectedKeys2 = ref<number[]>([])
const title = ref('')
const page = reactive({current: 1, limit: 100, total: 0, limits: [50, 100, 200, 500, 1000, 2000, 5000, 10000]})
const partVisible = ref(false)
const currentRow = ref()
const query = ref({
  br_id: '',
  order_no: '',
  put_in_warehouse_no: '',
  logistics_no: '',
  product_code: '',
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

const changeProductPartUserCount = async (row: any) => {
  let data: setProductPartUseCountBody = {
    part_id: row.id,
    use_count: row.use_count
  }

  await apiSetProductPartUseCount(data).then((res: Result) => {
    let {code, message} = res
    if (code === 0) {
      layer.msg('使用成功', {icon: 1, time: 2000})
      loadDataSource2()
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
    } else {
      layer.msg(message, {icon: 2, time: 2000})
    }
  })
  loading2.value = false
}

const setProductRepairType = async (id_list: Array<number>, repair_status: number) => {
  let data: setProductRepairTypeBody = {
    id_list: id_list,
    repair_type: repair_status
  }
  await apiSetProductRepairType(data).then((res: Result) => {
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
    logistics_no: '',
    product_code: '',
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
    } else {
      layer.msg(message, {icon: 2, time: 2000})
    }
  })
  loading.value = false
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
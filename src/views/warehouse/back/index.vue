<template>
  <lay-container fluid="true" class="user-box">
    <lay-card>
      <lay-form style="margin-top: 10px" @keyup.enter="toSearch">
        <lay-row :space="30">
          <lay-col :md="5">
            <lay-form-item label="单据号" label-width="80">
              <lay-input
                  v-model="searchQuery.br_id"
                  :allow-clear="true"
                  style="width: 98%"
              ></lay-input>
            </lay-form-item>
          </lay-col>
          <lay-col :md="8">
            <lay-form-item label="店铺" label-width="80">
              <lay-select v-model="searchQuery.shop_id" style="width: 400px">
                <lay-select-option :value="-1" label="全部"></lay-select-option>
                <template v-for="shop of shopList">
                  <lay-select-option :value="shop.id">{{ shop.name }}</lay-select-option>
                </template>
              </lay-select>
            </lay-form-item>
          </lay-col>
          <lay-col :md="5">
            <lay-form-item label="订单号" label-width="80">
              <lay-input
                  v-model="searchQuery.order_no"
                  :allow-clear="true"
                  style="width: 98%"
              ></lay-input>
            </lay-form-item>
          </lay-col>
          <lay-col :md="5">
            <lay-form-item label="物流单号" label-width="80">
              <lay-input
                  v-model="searchQuery.logistics_no"
                  :allow-clear="true"
                  style="width: 98%"
              ></lay-input>
            </lay-form-item>
          </lay-col>
          <lay-col :md="6">
            <lay-form-item label="单据状态" label-width="80">
              <lay-select v-model="searchQuery.status">
                <lay-select-option :value="-1" label="全部"></lay-select-option>
                <lay-select-option :value="0" label="待处理"></lay-select-option>
                <lay-select-option :value="1" label="处理完成"></lay-select-option>
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
          <lay-button size="sm" type="primary" @click="changeVisible11('新增')">
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
              @click="switchBackRecordStatus(row)"
          >{{ row.status === 0 ? '确认' : '反确认' }}
          </lay-button
          >
          <lay-button
              size="xs"
              type="primary"
              @click="changeVisible11('编辑', row)"
          >编辑
          </lay-button
          >
          <lay-button
              size="xs"
              type="normal"
              @click="addProductVisible(row)"
          >商品
          </lay-button
          >
          <lay-button
              size="xs"
              type="normal"
              @click="changeSrcVisible(row.br_id)"
          >资源
          </lay-button
          >
          <lay-popconfirm
              content="确定要删除吗?"
              @confirm="confirm([row.id])"
          >
            <lay-button size="xs" type="danger"
            >删除
            </lay-button
            >
          </lay-popconfirm>
        </template>
        <template #shop="{ data }">
          {{ getShopName(data.shop_id) }}
        </template>
        <template #status="{ data }">
          {{ getBackRecordStatus(data.status) }}
        </template>
        <template #create_time="{ data }">
          {{ convertTime(data.create_time) }}
        </template>
        <template #update_time="{ data }">
          {{ convertTime(data.update_time) }}
        </template>
      </lay-table>
    </div>
    <lay-layer v-model="visible11" :title="title" :area="['800px', '750px']">
      <div style="padding: 20px">
        <lay-form :model="model11" ref="layFormRef11">
          <lay-form-item label="店铺名称" prop="shop_id">
            <lay-select v-model="model11.shop_id" style="width: 100%">
              <template v-for="shop of shopList">
                <lay-select-option :value="shop.id">{{ shop.name }}</lay-select-option>
              </template>
            </lay-select>
          </lay-form-item>
          <lay-form-item label="订单号" prop="order_no">
            <lay-input v-model="model11.order_no"></lay-input>
          </lay-form-item>
          <lay-form-item label="退款单号" prop="refund_no">
            <lay-input v-model="model11.refund_no"></lay-input>
          </lay-form-item>
          <lay-form-item label="淘宝名称" prop="taobao_name">
            <lay-input v-model="model11.taobao_name"></lay-input>
          </lay-form-item>
          <lay-form-item label="物流名称" prop="order_no">
            <lay-input v-model="model11.logistics_name"></lay-input>
          </lay-form-item>
          <lay-form-item label="物流单号" prop="logistics_no">
            <lay-input v-model="model11.logistics_no"></lay-input>
          </lay-form-item>
          <lay-form-item label="客服备注" prop="kf_remark">
            <lay-textarea
                placeholder="请输入客服备注"
                v-model="model11.kf_remark"
            ></lay-textarea>
          </lay-form-item>
          <lay-form-item label="退换货原因" prop="back_reason">
            <lay-textarea
                placeholder="请输入退换货原因"
                v-model="model11.back_reason"
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
    <lay-layer v-model="batchOptionVisible" title="批量设置" :area="['300px', '250px']">
      <div style="padding: 10px">
        <lay-form style="margin-top: 10px" :model="batchOption">
          <lay-form-item label="品质类型" prop="quality_type">
            <lay-select v-model="batchOption.quality_type" style="width: 100%">
              <lay-select-option :value="0" label="待定"></lay-select-option>
              <lay-select-option :value="1" label="正品"></lay-select-option>
              <lay-select-option :value="2" label="次品"></lay-select-option>
              <lay-select-option :value="3" label="二手销售"></lay-select-option>
              <lay-select-option :value="4" label="报废"></lay-select-option>
            </lay-select>
          </lay-form-item>
          <lay-form-item label="转入仓库" prop="warehouse_name">
            <lay-select v-model="batchOption.warehouse_name" style="width: 100%">
              <lay-select-option :value="0" label="待定"></lay-select-option>
              <lay-select-option :value="1" label="正品仓"></lay-select-option>
              <lay-select-option :value="4" label="次转正仓"></lay-select-option>
              <lay-select-option :value="2" label="次品仓"></lay-select-option>
              <lay-select-option :value="3" label="报废仓"></lay-select-option>
            </lay-select>
          </lay-form-item>
          <div style="width: 100%; text-align: center">
            <lay-button size="sm" type="primary" @click="batchOptionSet"
            >保存
            </lay-button
            >
          </div>
        </lay-form>
      </div>
    </lay-layer>
    <lay-layer v-model="productVisible1" title="商品管理" :area="['1400px', '800px']">
      <lay-card>
        <lay-table
            :height="'100%'"
            :columns="columns3"
            :loading="loading3"
            :default-toolbar="true"
            :data-source="dataSource3"
            v-model:selected-keys="selectedKeys3"
            @change="queryDataSource3"
        >
          <template v-slot:toolbar>
            <lay-button size="sm" type="primary" @click="searchProductVisible">
              <lay-icon class="layui-icon-addition"></lay-icon>
              新增
            </lay-button
            >
            <lay-button size="sm" type="danger" @click="backProductRemove(selectedKeys3)">
              <lay-icon class="layui-icon-delete"></lay-icon>
              删除
            </lay-button>
            <lay-button size="sm" type="primary" @click="backProductConfirmMany(1)">
              <lay-icon class="layui-icon-ok"></lay-icon>
              确认
            </lay-button>
            <lay-button size="sm" type="primary" @click="backProductConfirmMany(0)">
              <lay-icon class="layui-icon-circle"></lay-icon>
              反确认
            </lay-button>
            <lay-button size="sm" type="normal" @click="backProductAddWarehouseWindow(selectedKeys3)">
              <lay-icon class="layui-icon-form"></lay-icon>
              入库
            </lay-button>
            <lay-button size="sm" type="primary" @click="batchOptionWindow">
              <lay-icon class="layui-icon-note"></lay-icon>
              批量设置
            </lay-button>
          </template>
          <template v-slot:operator="{ row }">
            <lay-button
                size="xs"
                type="primary"
                @click="backProductConfirm([row],row.status === 0 ? 1 : 0)"
            >{{ backProductStatusBtn(row.status) }}
            </lay-button>
            <lay-button
                size="xs"
                type="normal"
                @click="backProductAddWarehouseWindow([row.id])"
            >入库
            </lay-button>
            <lay-button size="xs" type="danger" @click="backProductRemove([row.id])"
            >删除
            </lay-button
            >
          </template>
          <template #status="{ data }">
            {{ getBackProductStatus(data.status) }}
          </template>
          <template #quality_type="{ data }">
            <lay-select
                style="width: 100px"
                v-model="data.quality_type"
                :disabled="data.status !== 0"
            >
              <lay-select-option :value="0" label="待定"></lay-select-option>
              <lay-select-option :value="1" label="正品"></lay-select-option>
              <lay-select-option :value="2" label="次品"></lay-select-option>
              <lay-select-option :value="3" label="二手销售"></lay-select-option>
              <lay-select-option :value="4" label="报废"></lay-select-option>
            </lay-select>
          </template>
          <template #warehouse_name="{ data }">
            <lay-select
                style="width: 100px"
                v-model="data.warehouse_name"
                :disabled="data.status !== 0"
            >
              <lay-select-option :value="0" label="待定"></lay-select-option>
              <lay-select-option :value="1" label="正品仓"></lay-select-option>
              <lay-select-option :value="4" label="次转正仓"></lay-select-option>
              <lay-select-option :value="2" label="次品仓"></lay-select-option>
              <lay-select-option :value="3" label="报废仓"></lay-select-option>
            </lay-select>
          </template>
        </lay-table>
      </lay-card>
    </lay-layer>
    <lay-layer v-model="addProductVisible1" title="添加商品" :area="['1000px', '750px']">
      <div style="padding: 20px">
        <lay-card>
          <lay-form :model="searchAddProductModel">
            <lay-form-item label="产品型号" prop="product_model" mode="inline">
              <lay-input v-model="searchAddProductModel.product_model"></lay-input>
            </lay-form-item>
            <lay-form-item label="产品名称" prop="product_name" mode="inline">
              <lay-input v-model="searchAddProductModel.product_name"></lay-input>
            </lay-form-item>
            <lay-form-item mode="inline">
              <lay-button type="primary" @click="toSearch2">搜索</lay-button>
              <lay-button @click="reset2">重置</lay-button>
            </lay-form-item>
          </lay-form>
        </lay-card>
        <lay-card>
          <lay-table
              :page="page2"
              :height="'100%'"
              :columns="columns2"
              :loading="loading2"
              :default-toolbar="true"
              :data-source="dataSource2"
              v-model:selected-keys="selectedKeys2"
              @change="queryDataSource2"
          >
            <template v-slot:toolbar>
              <lay-button size="sm" type="primary" @click="saveSearchProduct(selectedKeys2)">
                <lay-icon class="layui-icon-ok"></lay-icon>
                保存
              </lay-button>
            </template>
            <template v-slot:operator="{ row }">
              <lay-button size="xs" type="primary" @click="saveSearchProduct([row.id])">
                <lay-icon class="layui-icon-ok"></lay-icon>
                保存
              </lay-button>
              <lay-button size="xs" type="normal" @click="batchSaveSearchProduct([row.id])"
              >批量保存
              </lay-button
              >
            </template>
          </lay-table>
        </lay-card>
      </div>
    </lay-layer>
    <lay-layer v-model="src_visible1" title="资源" :area="['1000px', '600px']">
      <lay-container fluid style="padding: 10px">
        <lay-form-item label="视频地址" label-width="80">
          <lay-input
              v-model="video_url"
              :allow-clear="true"
              style="width: 98%"
              :readonly="true"
          ></lay-input>
        </lay-form-item>
        <lay-button type="primary" size="sm" @click="startRecord">
          <lay-icon class="layui-icon-circle-dot"></lay-icon>
          开始录制
        </lay-button>
        <lay-button type="danger" size="sm" @click="stopRecord">
          <lay-icon class="layui-icon-logout"></lay-icon>
          停止录制
        </lay-button>
        <lay-button type="normal" size="sm" @click="getVideoUrl(current_src_br_id)">
          <lay-icon class="layui-icon-refresh"></lay-icon>
          刷新视频
        </lay-button>
        <lay-button type="danger" size="sm" @click="delRecord">
          <lay-icon class="layui-icon-delete"></lay-icon>
          删除视频
        </lay-button>
        <div style="margin-top: 10px">
          <video id="vide_player" preload="auto" :src="video_url" controls width="660" height="360">
            Your browser does not support the video tag.
          </video>
        </div>
        <lay-upload field="file" url="https://www.qiaojiangdaojia.top" :before-upload="beforeUpload" text="手动上传">
        </lay-upload>
        <lay-progress :percent="percent" :show-text="true" :text="showText"></lay-progress>
      </lay-container>
    </lay-layer>
  </lay-container>
</template>

<script setup lang="ts">
import {onMounted, reactive, ref} from 'vue'
import {layer} from '@layui/layui-vue'
import {
  addBackRecordBody, batchOptionSetBody,
  editBackRecordBody,
  getBackProductBody,
  getBackQueryBody, getVideoUrlBody,
  saveAddBackProductBody,
  setBackProductWarehouseNoBody,
  switchAddBackProductStatusBody,
  switchBackRecordStatusBody, updateVideoUrlBody
} from "@/types/warehouse-back";
import {
  apiAddBackRecord,
  apiBackQuery, apiBatchOptionSet,
  apiDelBackProduct, apiDelBackRecord, apiDelVideoUrl,
  apiEditBackRecord,
  apiGetBackProduct, apiGetVideoUrl,
  apiSaveAddBackProduct,
  apiSetBackProductWarehouseNo,
  apiSwitchBackProductStatus,
  apiSwitchBackRecordStatusBody, apiUpdateVideoUrl
} from "@/api/module/warehouse-back";
import {apiQueryProduct,} from "@/api/module/product";
import {queryProductBody,} from "@/types/product";
import {convertTime, getCurrentDay} from "@/utils/globalFunctions";
import {useUserStore} from '@/store/user'
import {getShopQueryBody} from "@/types/shop";
import {apiQueryShop} from "@/api/module/shop";

import COS from 'cos-js-sdk-v5';

defineOptions({
  name: 'WarehouseBack'
})
const cos = new COS({
  SecretId: 'AKIDNdgbN0Rhn2FLG2kLkz2xtlV6byQjdUQI', // sts服务下发的临时 secretId
  SecretKey: 'lU2TjsqhijCUfrwsdbR4Vt9GB90Wt45y', // sts服务下发的临时 secretKey
});
const percent = ref(0);
const showText = ref('0%');
const userStore = useUserStore()
const video_url = ref('');
const beforeUpload = (file: any) => {
  cos.uploadFile({
    Bucket: 'qiaojiangdaojia-1313349622', // 填入您自己的存储桶，必须字段
    Region: 'ap-shanghai',  // 存储桶所在地域，例如 ap-beijing，必须字段
    Key: "cb_video/" + getCurrentDay() + "/" + current_src_br_id.value + "/" + file.name,  // 存储在桶里的对象键（例如1.jpg，a/b/test.txt），必须字段
    Body: file, // 必须，上传文件对象，可以是 input[type="file"]标签选择本地文件后得到的 file 对象
    SliceSize: 1024 * 1024 * 5,     // 触发分块上传的阈值，超过5MB使用分块上传，默认 1MB，非必须
    ChunkSize: 1024 * 1024, // 分块大小，默认 1MB，非必须
    onTaskReady: function (taskId) {  // 非必须
      // console.log(taskId);
    },
    onProgress: function (progressData) { // 非必须
      percent.value = progressData.percent * 100;
      showText.value = '上传进度：' + percent.value + '%';
    },
    // 支持自定义 headers 非必须
    Headers: {
      'x-cos-meta-test': 123
    },
  }, function (err, data) {
    if (err) {
      console.log('上传失败', err);
    } else {
      let file_url = data.Location;
      if (!data.Location.startsWith('http')) {
        file_url = 'http://' + data.Location;
      }
      update_video_url(file_url, current_src_br_id.value)
    }
  });
  return new Promise((resolver) => resolver(false));
}
const update_video_url = async (file_url: string, br_id: string) => {
  let data: updateVideoUrlBody = {
    video_url: file_url,
    br_id: br_id
  }
  await apiUpdateVideoUrl(data).then(res => {
    let {code, message, data} = res
    if (code === 0) {
      getVideoUrl(br_id)
    } else {
      layer.msg(message)
    }
  })
}
const batchOption = ref({
  quality_type: 0,
  warehouse_name: 0,
})
const startRecord = async () => {
  // 这里可以调用录制视频的API
  if (current_src_br_id.value === '') {
    return;
  }
  fetch('http://127.0.0.1:35520/record_start', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      "order_no": current_src_br_id.value,
    })
  })
      .then(response => response.json())
      .then(data => {
        if (data.code === 0) {
          layer.msg(data.msg)
        } else {
          layer.msg('开始录制失败...')
        }
      })
      .catch(error => {
        console.error('There was an error!', error);
      });
}

const getCurrentRowIndex = (id: number) => {
  for (let i = 0; i <= dataSource3.value.length; i++) {
    if (dataSource3.value[i].id === id) {
      return i
    }
  }
  return null;
}

const batchOptionSet = async () => {
  if (selectedKeys3.value.length === 0) {
    layer.msg('请选择需要设置的产品！')
    return;
  }
  for (let i = 0; i < selectedKeys3.value.length; i++) {
    let index = getCurrentRowIndex(selectedKeys3.value[i])
    if (index !== null) {
      if (dataSource3.value[index].status !== 0) {
        layer.msg('只有待确认的产品才能设置！')
        return;
      }
    } else {
      layer.msg('请选择需要设置的产品！')
      return;
    }
  }
  let data: batchOptionSetBody = {
    product_list: selectedKeys3.value,
    quality_type: batchOption.value.quality_type,
    warehouse_name: batchOption.value.warehouse_name,
  }
  await apiBatchOptionSet(data).then(res => {
    let {code, message, data} = res
    if (code === 0) {
      layer.msg("设置成功！")
      queryDataSource3(currentRow.value)
      batchOptionVisible.value = false
    } else {
      layer.msg(message)
    }
  })
}
const batchOptionWindow = () => {
  if (selectedKeys3.value.length === 0) {
    layer.msg('请选择需要设置的产品！')
    return;
  }
  batchOption.value = {
    quality_type: 0,
    warehouse_name: 0,
  }
  batchOptionVisible.value = !batchOptionVisible.value;
}

const stopRecord = async () => {
  // 这里可以调用录制视频的API
  fetch('http://127.0.0.1:35520/record_stop', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': userStore.token
    },
  }).then((response) => {
    if (response.status === 200) {
      layer.msg('已停止录制，正在上传视频，请过几秒点击刷新视频按钮查看是否上传成功...')
    }
  }).catch(error => {
    console.error('There was an error!', error);
    layer.msg('停止录制失败...采取强制停止...')
    fetch('http://127.0.0.1:35520/close_camera', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
    })
  });
}

const current_src_br_id = ref('')
const src_visible1 = ref(false)

const getVideoUrl = async (br_id: string) => {
  let data: getVideoUrlBody = {
    br_id: br_id
  }
  await apiGetVideoUrl(data).then(res => {
    let {code, message, data} = res
    if (code === 0) {
      if (data.video_url.length > 0) {
        layer.msg("视频链接获取成功！")
        video_url.value = data.video_url
      } else {
        video_url.value = ''
        layer.msg("未上传视频链接！")
      }
    } else {
      layer.msg(message)
    }
  })
}

const getShopName = (shop_id: number) => {
  for (let shop of shopList.value) {
    if (shop.id === shop_id) {
      return shop.name
    }
  }
  return "未知的店铺"
}

const delRecord = async () => {
  // 这里可以调用录制视频的API
  if (video_url.value === '' || video_url.value === null || video_url.value === undefined) {
    return;
  }
  layer.confirm('确定要删除视频吗？', {
    icon: 3,
    title: '提示',
    yes: async function (index: any) {
      // 确定按钮的回调函数
      let data: getVideoUrlBody = {
        br_id: current_src_br_id.value,
      }
      await apiDelVideoUrl(data).then(res => {
        let {code, message, data} = res
        if (code === 0) {
          layer.msg("视频删除成功！")
          video_url.value = ''
          layer.close(index)
        }
      })
    }
  })
}

const changeSrcVisible = (br_id: string) => {
  src_visible1.value = !src_visible1.value
  if (src_visible1.value) {
    current_src_br_id.value = br_id
    showText.value = '0%'
    getVideoUrl(br_id)
  } else {
    current_src_br_id.value = ''
    video_url.value = ''
  }
}

const backProductStatusBtn = (status: number) => {
  switch (status) {
    case 0:
      return '确认'
    case 1:
      return '反确认'
    case 2:
      return '反确认'
  }
}


const getBackRecordStatus = (status: number) => {
  switch (status) {
    case 0:
      return '待处理'
    case 1:
      return '处理完成'
  }
}

const getBackProductStatus = (status: number) => {
  switch (status) {
    case 0:
      return '待确认'
    case 1:
      return '已确认'
    case 2:
      return '已入库'
  }
}

const searchAddProductModel = ref({
  product_model: '',
  product_name: '',
})

const searchQuery = ref({
  shop_id: -1,
  status: -1,
  br_id: '',
  order_no: '',
  logistics_no: '',
  create_time: [],
  update_time: [],
})

function toReset() {
  searchQuery.value = {
    shop_id: -1,
    status: -1,
    br_id: '',
    order_no: '',
    logistics_no: '',
    create_time: [],
    update_time: []
  }
}

function toSearch() {
  page.current = 1
  queryDataSource()
}

function toSearch2() {
  page2.current = 1
  queryDataSource2()
}

const currentRow = ref()
const addProductVisible = (row: any) => {
  productVisible1.value = !productVisible1.value
  if (productVisible1.value) {
    currentRow.value = row
  } else {
    currentRow.value = {}
  }
  queryDataSource3(row)
}

const searchProductVisible = () => {
  addProductVisible1.value = !addProductVisible1.value
  selectedKeys2.value = []
  loadDataSource2()
}

const batchSaveSearchProduct = (product_list: Array<number>) => {
  layer.prompt({
    formType: 0,
    title: '请输入批量保存数量',
    placeholder: '',
    area: ['300px', '200px'],
    yes: (index: string, value: string) => {
      saveAddBackProduct(product_list, Number(value))
      layer.close(index)
    }
  })
}

const saveSearchProduct = (product_list: Array<number>) => {
  if (product_list.length === 0) {
    layer.msg('请选择商品')
    return
  }
  saveAddBackProduct(product_list, 1)
}

const saveAddBackProduct = async (product_list: Array<number>, count: number) => {
  let data: saveAddBackProductBody = {
    br_id: currentRow.value.br_id,
    product_list: product_list,
    count: count,
  }
  await apiSaveAddBackProduct(data).then(res => {
    let {code, message} = res
    if (code === 0) {
      layer.msg('保存成功')
      addProductVisible1.value = false
      queryDataSource3(currentRow.value)
    } else {
      layer.msg(message)
    }
  })
}

const backProductRemove = async (id_list: Array<number>) => {
  for (let row_id of id_list) {
    let item = getDataSourceRow(dataSource3, row_id)
    if (item === null) {
      layer.msg('数据异常，数据不存在！')
      return
    } else if (item.status !== 0) {
      layer.msg('请反确认后再删除！')
      return
    }
  }
  await apiDelBackProduct(id_list).then(res => {
    let {code, message} = res
    if (code === 0) {
      layer.msg('操作成功')
      queryDataSource3(currentRow.value)
    } else {
      layer.msg(message)
    }
  })
}


const backProductConfirmMany = (status: number) => {
  let row_list = []
  for (let item of dataSource3.value) {
    if (selectedKeys3.value.includes(item.id)) {
      row_list.push(item)
    }
  }
  if (row_list.length > 0) {
    backProductConfirm(row_list, status)
  }
}


const backProductConfirm = async (row_list: any, status: number) => {
  let data: Array<switchAddBackProductStatusBody> = []
  for (let row of row_list) {
    data.push({
      id: row.id,
      status: status,
      quality_type: row.quality_type,
      warehouse_name: row.warehouse_name,
    })
  }
  await apiSwitchBackProductStatus(data).then(res => {
    let {code, message} = res
    if (code === 0) {
      layer.msg('操作成功')
      queryDataSource3(currentRow.value)
      return true
    } else {
      layer.msg(message)
      return false
    }
  })
  return false
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
      queryDataSource3(currentRow.value)
      layer.close(index)
    } else {
      layer.msg(message)
    }
  })
}
const getDataSourceRow = (DataSource: any, row_id: any) => {
  for (let item of DataSource.value) {
    if (item.id === row_id) {
      return item
    }
  }
  return null
}

const backProductAddWarehouseWindow = (row_list: any) => {
  if (row_list.length === 0) {
    layer.msg('请选择需要入库的商品')
    return
  }
  for (let row_id of row_list) {
    let item = getDataSourceRow(dataSource3, row_id)
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
      setbackProductWarehouseNo(row_list, value, index)
    }
  })
}

const batchOptionVisible = ref(false)
const loading = ref(false)
const loading2 = ref(false)
const loading3 = ref(false)
const selectedKeys = ref<number[]>([])
const selectedKeys2 = ref<number[]>([])
const selectedKeys3 = ref<number[]>([])
const page = reactive({current: 1, limit: 40, total: 0})
const page2 = reactive({current: 1, limit: 10, total: 0})
const columns = ref([
  {title: '选项', width: '60px', type: 'checkbox', fixed: 'left'},
  {title: '序号', width: '60px', type: 'number', fixed: 'left'},
  {title: '状态', width: '100px', key: 'status', sort: 'desc', customSlot: 'status', fixed: 'left'},
  {title: '店铺名称', width: '250px', key: 'shop_id', sort: 'desc', customSlot: 'shop'},
  {title: '订单号', width: '180px', key: 'order_no'},
  {title: '退货原因', width: '160px', key: 'back_reason', sort: 'desc'},
  {title: '客服备注', width: '160px', key: 'kf_remark'},
  {title: '退款单号', width: '160px', key: 'refund_no'},
  {title: '淘宝名称', width: '150px', key: 'taobao_name', sort: 'desc'},
  {title: '物流名称', width: '120px', key: 'logistics_name', sort: 'desc'},
  {title: '物流单号', width: '150px', key: 'logistics_no'},
  {title: '退货单据号', width: '200px', key: 'br_id', sort: 'desc'},
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

const columns2 = ref([
  {title: '选项', width: '60px', type: 'checkbox', fixed: 'left'},
  {title: 'ID', width: '80px', key: 'id', fixed: 'left', sort: 'desc'},
  {title: '类目名称', width: '150px', key: 'class_name', sort: 'desc'},
  {title: '产品型号', width: '200px', key: 'product_model', sort: 'desc'},
  {title: '产品名称', width: '200px', key: 'product_name', sort: 'desc'},
  {
    title: '操作',
    width: '120px',
    customSlot: 'operator',
    key: 'operator',
    fixed: 'right'
  }
])

const columns3 = ref([
  {title: '选项', width: '60px', type: 'checkbox', fixed: 'left'},
  {title: '序号', width: '80px', type: 'number', fixed: 'left', sort: 'desc'},
  {title: 'ID', width: '80px', key: 'id', fixed: 'left', sort: 'desc', hide: true},
  {title: '产品状态', width: '100px', key: 'status', sort: 'desc', customSlot: 'status', align: 'center'},
  {title: '托盘编号', width: '120px', key: 'tray_no', sort: 'desc'},
  {title: '溯源码', width: '180px', key: 'product_code', sort: 'desc'},
  {title: '产品型号', width: '180px', key: 'product_model', sort: 'desc'},
  {title: '产品名称', width: '180px', key: 'product_name', sort: 'desc'},
  {title: '数量', width: '80px', key: 'count', sort: 'desc', align: 'center'},
  {title: '品质类型', width: '120px', key: 'quality_type', sort: 'desc', customSlot: 'quality_type'},
  {title: '转入仓库', width: '120px', key: 'warehouse_name', sort: 'desc', customSlot: 'warehouse_name'},
  {title: '入库单号', width: '200px', key: 'put_in_warehouse_no', sort: 'desc'},
  {
    title: '操作',
    width: '160px',
    customSlot: 'operator',
    key: 'operator',
    fixed: 'right'
  }
])

const dataSource = ref()
const dataSource2 = ref()
const dataSource3 = ref()
const reset2 = () => {
  searchAddProductModel.value = {
    product_model: '',
    product_name: '',
  }
}
const loadDataSource = async () => {
  page.current = 1
  await queryDataSource()
}
const loadDataSource2 = async () => {
  page2.current = 1
  await queryDataSource2()
}

const queryDataSource = async () => {
  loading.value = true
  const data: getBackQueryBody = {
    page: page.current,
    limit: page.limit,
    shop_id: searchQuery.value.shop_id,
    status: searchQuery.value.status,
    br_id: searchQuery.value.br_id,
    logistics_no: searchQuery.value.logistics_no,
    create_time: searchQuery.value.create_time,
    update_time: searchQuery.value.update_time,
    order_no: searchQuery.value.order_no
  }
  await apiBackQuery(data).then((res: DataResult) => {
    let {code, data, total, message} = res
    if (code === 0) {
      if (page.current == 1) {
        page.total = total
      }
      dataSource.value = data
    } else {
      layer.msg(message, {icon: 3, time: 2000})
    }
  })
  loading.value = false
}

const queryDataSource2 = async () => {
  loading2.value = true
  const data: queryProductBody = {
    page: page2.current,
    limit: page2.limit,
    product_model: searchAddProductModel.value.product_model,
    product_name: searchAddProductModel.value.product_name,
  }
  await apiQueryProduct(data).then((res: DataResult) => {
    let {code, data, total, message} = res
    if (code === 0) {
      page2.total = total
      dataSource2.value = data
    } else {
      layer.msg(message, {icon: 3, time: 2000})
    }
  })
  loading2.value = false
}

const queryDataSource3 = async (row: any) => {
  loading2.value = true
  const data: getBackProductBody = {
    br_id: row.br_id
  }
  await apiGetBackProduct(data).then((res: DataResult) => {
    let {code, data, message} = res
    if (code === 0) {
      dataSource3.value = data
    } else {
      layer.msg(message, {icon: 3, time: 2000})
    }
  })
  loading3.value = false
}


const model11 = ref<any>({})
const layFormRef11 = ref()
const visible11 = ref(false)
const addProductVisible1 = ref(false)
const productVisible1 = ref(false)
const title = ref('')
const changeVisible11 = (text: any, row?: any) => {
  title.value = text
  if (row) {
    if (row.status !== 0) {
      layer.msg('退货单当前状态不可修改，请先反确认再操作！')
      return
    }
    model11.value = JSON.parse(JSON.stringify(row))
    currentRow.value = row
  } else {
    model11.value = {}
    currentRow.value = {}
    loadShopList()
  }
  visible11.value = !visible11.value
}

const DelBackRecord = async (data: Array<number>) => {
  if (data.length === 0) {
    layer.msg('请选择要删除的数据！')
    return
  }
  await apiDelBackRecord(data).then(res => {
    let {code, message} = res
    if (code === 0) {
      layer.msg('操作成功')
      loadDataSource()
    } else {
      layer.msg(message)
    }
  })

}

function toRemove() {
  if (selectedKeys.value.length == 0) {
    layer.msg('您未选择数据，请先选择要删除的数据', {icon: 3, time: 2000})
    return
  }
  layer.confirm('确认删除所有选中的数据？', {
    title: '提示',
    btn: [
      {
        text: '确定',
        callback: (id: any) => {
          let data: Array<number> = selectedKeys.value
          DelBackRecord(data)
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


const switchBackRecordStatus = async (row: any) => {
  let switch_status = row.status === 0 ? 1 : 0
  let data: switchBackRecordStatusBody = {
    br_id: row.br_id,
    status: switch_status
  }
  await apiSwitchBackRecordStatusBody(data).then(res => {
    let {code, message} = res
    if (code === 0) {
      layer.msg('操作成功')
      loadDataSource()
    } else {
      layer.msg(message)
    }
  })
}
const editBackRecord = async () => {
  let data_ = model11.value
  data_.br_id = currentRow.value.br_id
  let data: editBackRecordBody = data_
  await apiEditBackRecord(data).then(res => {
    let {code, message} = res
    if (code === 0) {
      layer.msg('操作成功')
      loadDataSource()
      visible11.value = false
    } else {
      layer.msg(message)
    }
  })
}

const addBackRecord = async () => {
  let data: addBackRecordBody = model11.value
  await apiAddBackRecord(data).then(res => {
    let {code, message} = res
    if (code === 0) {
      layer.msg('操作成功')
      loadDataSource()
      visible11.value = false
    } else {
      layer.msg(message)
    }
  })
}

function toSubmit() {
  if (title.value === '新增') {
    addBackRecord()
  } else if (title.value === '编辑') {
    editBackRecord()
  }
}


function toCancel() {
  visible11.value = false
}

function confirm(data: Array<number>) {
  DelBackRecord(data)
}

const shopList = ref()
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
      layer.msg(message, {icon: 3, time: 2000})
    }
  })
}

onMounted(() => {
  loadShopList()
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

</style>
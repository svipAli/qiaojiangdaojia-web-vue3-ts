<template>
  <lay-container fluid="true" class="user-box">
    <lay-card>
      <lay-form style="margin-top: 10px">
        <lay-row :space="30">
          <lay-col :md="6">
            <lay-form-item label="手机号码" label-width="80">
              <lay-input
                  v-model="query.phone"
                  :allow-clear="true"
                  style="width: 98%"
              ></lay-input>
            </lay-form-item>
          </lay-col>
          <lay-col :md="3">
            <lay-form-item label="验证码" label-width="80">
              <lay-input
                  v-model="query.code"
                  :allow-clear="true"
                  style="width: 98%"
              ></lay-input>
            </lay-form-item>
          </lay-col>
          <lay-col :md="6">
            <lay-form-item label-width="20">
              <lay-button
                  type="normal"
                  @click="getPhoneVerifyCode"
              >
                获取验证码
              </lay-button>
              <lay-button
                  type="primary"
                  @click="verifyCodeLogin"
              >
                登录
              </lay-button>
              <lay-button @click=""> 重置</lay-button>
            </lay-form-item>
          </lay-col>
          <lay-col :md="5">
            <lay-form-item :label="'当前登录账号:'+userName" label-width="80">
            </lay-form-item>
          </lay-col>
        </lay-row>
      </lay-form>
    </lay-card>
    <lay-button type="normal" size="sm" @click="refreshAW(7)">已预约</lay-button>
    <lay-button type="normal" size="sm" @click="refreshAW(8)">服务中</lay-button>
    <lay-row :space="10" style="margin-top: 0px;">
      <lay-col :md="12">
        <div style="height: 600px;overflow: auto">
          <template v-for="aw in aw_list">
            <lay-card>
              <lay-row :space="10">
                <lay-col :md="2">
                  <div class="aw">
                    安装
                  </div>
                </lay-col>
                <lay-col :md="16">
                  <div>
                    <lay-icon class="layui-icon-template-one"></lay-icon>
                    {{ aw.incidentsNum }}
                  </div>
                  <div>
                    <lay-icon class="layui-icon-website"></lay-icon>
                    {{ aw.detailedAddress }}
                  </div>
                  <div>
                    <lay-icon class="layui-icon-username"></lay-icon>
                    {{ aw.customerName }}
                    <lay-icon class="layui-icon-cellphone"></lay-icon>
                    {{ aw.customerMobile }}
                  </div>
                </lay-col>
                <lay-col :md="6">
                  <div style="margin-top:22px">
                    <lay-button type="normal" size="sm" @click="plusLocation(aw.incidentsId)">
                      <lay-icon class="layui-icon-find-fill"></lay-icon>
                      打卡
                    </lay-button>
                    <lay-button type="primary" size="sm" @click="uploadImages(aw)">
                      <lay-icon class="layui-icon-upload"></lay-icon>
                      上传
                    </lay-button>
                  </div>
                </lay-col>
              </lay-row>
            </lay-card>
          </template>
        </div>
      </lay-col>
      <lay-col :md="12">
        <template v-if="visible">
          <lay-card>
            <lay-row :space="10">
              <lay-col :md="8">
                <lay-form-item :label="'工单号: '+currentData.incidentsNum" label-width="80"></lay-form-item>
              </lay-col>
              <lay-col :md="8">
                <lay-button
                    type="normal"
                    size="sm"
                    @click="setBarCode"
                >
                  输入唯一码
                </lay-button>
              </lay-col>
              <lay-col :md="8">
                <lay-button
                    type="primary"
                    size="sm"
                    @click="setAWDone"
                >
                  工单完工
                </lay-button>
              </lay-col>
            </lay-row>
            <lay-row>
              <lay-table
                  height="550px"
                  :columns="columns"
                  :loading="loading"
                  :data-source="dataSource"
                  @change="loadDataSource"
              >
                <template #image="{ data }">
                  <img :src="data.image" style="width: 200px" alt="">
                </template>
                <template v-slot:operator="{ row }">
                  <lay-button
                      size="xs"
                      type="primary"
                      @click="setCurrentRow(row)"
                  >上传图片
                  </lay-button>
                  <lay-button
                      size="xs"
                      type="primary"
                      @click="nodeSubmit(row)"
                  >提交节点
                  </lay-button>
                </template>
              </lay-table>
            </lay-row>
          </lay-card>
        </template>
      </lay-col>
    </lay-row>
  </lay-container>
  <lay-layer v-model="uploadVisible" title="上传图片" :area="['300px', '240px']">
    <div style="padding: 20px">
      <lay-upload :drag="true"
                  url="https://cs-plus.panasonic.cn/api/cssWechatServer/imgUpload"
                  field="_pesFile"
                  @done="doneHandle"
      >
      </lay-upload>
    </div>
  </lay-layer>
</template>


<script setup lang="ts">
import {ref} from 'vue'
import {layer} from "@layui/layui-vue";

import {
  apiAWGetNode,
  apiAWLocation, apiAWSaveImage, apiAWSetAWDown, apiAWSetBarCode,
  apiGetPhoneVerifyCode,
  apiRefreshAW,
  apiVerifyCodeLogin
} from "@/api/module/qiaojiang/PlusMiniProgram";

defineOptions({
  name: 'QiaojiangplusMiniProgram',
})
const identyCode = ref('')
const userName = ref('')
const query = ref({
  phone: '',
  code: ''
})
const visible = ref(false)
const uploadVisible = ref(false)
const currentData = ref()
const currentRow = ref()
const loading = ref(false)

function validatePhoneNumber(phone: any, strict: boolean) {
  // 移除可能的空格、横线等
  const cleanPhone = phone.replace(/[\s-]/g, '');

  // 严格模式：验证具体号段
  if (strict) {
    return /^1(?:3\d|4[5-9]|5[0-35-9]|6[2567]|7[0-8]|8\d|9[0-35-9])\d{8}$/.test(cleanPhone);
  }

  // 宽松模式：只验证1开头+11位数字
  return /^1\d{10}$/.test(cleanPhone);
}

const getPhoneVerifyCode = async () => {
  if (!validatePhoneNumber(query.value.phone, true)) {
    layer.msg("手机号码错误!", {icon: 3, time: 2000})
  }
  const {code, data} = await apiGetPhoneVerifyCode({phone: query.value.phone})
  if (code === 0 && data.status === "S") {
    layer.msg("验证码发送成功!", {icon: 1, time: 2000})
  } else {
    layer.msg(data.msg, {icon: 2, time: 2000})
  }
}
const verifyCodeLogin = async () => {
  if (!validatePhoneNumber(query.value.phone, true)) {
    layer.msg("手机号码错误!", {icon: 3, time: 2000})
  }
  if (query.value.code.length !== 6) {
    layer.msg("验证码长度错误, 应该是6位字符!", {icon: 3, time: 2000})
  }
  const {code, data} = await apiVerifyCodeLogin({phone: query.value.phone, code: query.value.code})
  if (code === 0 && data.status === "S") {
    layer.msg("登录成功!", {icon: 1, time: 2000})
    identyCode.value = JSON.parse(data.data).identyCode
    userName.value = JSON.parse(data.data).userName
  } else {
    layer.msg(data.msg, {icon: 2, time: 2000})
  }
}

const aw_list = ref()

const refreshAW = async (status: number) => {
  const {code, data} = await apiRefreshAW({status: status, token: identyCode.value})
  if (code === 0 && data.status === "S") {
    aw_list.value = data.data
  } else {
    layer.msg(data.msg, {icon: 2, time: 2000})
  }
}

const plusLocation = async (incidents_id: string) => {
  if (!incidents_id) {
    layer.msg("请选择需要打卡的工单!", {icon: 3, time: 2000})
    return
  }
  layer.prompt({
    type: 7,
    area: ['600px', '200px'],
    title: '现场打卡',
    placeholder: "请输入需要打卡的坐标，例如（31.17022766673702,121.38534404207883）",
    yes: (index: string, value: string) => {
      apiAWLocation({
        location: value,
        incidents_id: String(incidents_id),
        token: identyCode.value,
      }).then((res) => {
        const {code, data} = res
        if (code == 0 && data.status === "S") {
          layer.msg("打卡成功!", {icon: 1, time: 2000})
          layer.close(index)
          refreshAW(8)
        } else {
          layer.msg(data.msg, {icon: 2, time: 2000})
        }
      })
    }
  })
}

const uploadImages = (aw: any) => {
  if (aw) {
    currentData.value = aw
    loadDataSource()
    visible.value = !visible.value
  } else {
    layer.msg("请选择要操作的工单!", {icon: 3, time: 2000})
  }
}
const dataSource = ref()
const columns = ref([
  {title: '序号', width: '50px', type: 'number', fixed: 'left'},
  {title: '节点名称', width: '150px', key: 'workstageName'},
  {title: '图片', width: '200px', key: 'image', customSlot: 'image'},
  {
    title: '操作',
    width: '120px',
    customSlot: 'operator',
    key: 'operator',
    fixed: 'right'
  }
])

const loadDataSource = async () => {
  if (!currentData.value) {
    return null;
  }
  loading.value = true
  const {code, data} = await apiAWGetNode({
    incidents_id: String(currentData.value.incidentsId),
    token: identyCode.value,
  })
  if (code === 0) {
    dataSource.value = data
  } else {
    dataSource.value = null
  }
  loading.value = false
}
const setCurrentRow = (row: any) => {
  currentRow.value = row
  uploadVisible.value = !uploadVisible.value
}
const nodeSubmit = (row: any) => {
  currentRow.value = row
  saveImage("")
}

const saveImage = async (img_url: string) => {
  const {code, data} = await apiAWSaveImage({
    incidents_id: String(currentRow.value.incidentsId),
    incidentsWorkstageId: currentRow.value.incidentsWorkstageId,
    img_url: img_url,
    token: identyCode.value,
  })
  if (code === 0 && data.status === "S") {
    layer.msg("上传成功!", {icon: 1, time: 2000})
    uploadVisible.value = false
    await loadDataSource()
  } else {
    layer.msg("上传失败!", {icon: 2, time: 2000})
  }

}

const doneHandle = (result: any) => {
  let data = JSON.parse(result.data)
  if (data.status === "S") {
    let img_url = data.data.filePath
    saveImage(img_url)
  } else {
    layer.msg("上传失败!", {icon: 2, time: 2000})
  }
}

const setBarCode = async () => {
  layer.prompt({
    type: 7,
    area: ['600px', '200px'],
    title: '输入唯一码',
    placeholder: "请输入唯一码内容(用钉钉扫码出来的结果复制并粘贴到这里)",
    yes: (index: string, value: string) => {
      apiAWSetBarCode({
        incidents_id: String(currentData.value.incidentsId),
        barcode: value,
        token: identyCode.value,
      }).then((res) => {
        const {code, data} = res
        if (code == 0 && data.status === "S") {
          layer.msg("设置成功!", {icon: 1, time: 2000})
          layer.close(index)
        } else {
          layer.msg(data.msg, {icon: 2, time: 2000})
        }
      })
    }
  })
}
const setAWDone = async () => {
  const {code, data} = await apiAWSetAWDown({
    incidents_id: String(currentData.value.incidentsId),
    token: identyCode.value,
  })
  if (code === 0 && data.status === "S") {
    layer.msg("工单已完工!", {icon: 1, time: 2000})
    visible.value = false
    await refreshAW(8)
  } else {
    layer.msg(data.msg, {icon: 2, time: 2000})
  }
}

</script>
<style scoped>
.user-box {
  height: calc(100vh - 110px);
  margin-top: 10px;
  box-sizing: border-box;
  overflow: auto;
}

.aw {
  width: 50px;
  height: 50px;
  line-height: 50px;
  text-align: center;
  margin: 0 auto;
  background-color: #1196D9;
  color: white;
  letter-spacing: 2px;
  border-radius: 50px;
  margin-top: 12px;
}
</style>
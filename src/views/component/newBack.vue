<template>
  <lay-container fluid="true" class="user-box">
    <lay-form style="margin-top: 10px">
      <lay-form-item label="店铺名" prop="shop_name">
        <lay-input v-model="model.shop_name"></lay-input>
      </lay-form-item>
      <lay-form-item label="密码" prop="password" tips="密码应当包含字母、数字和特殊符号中的任意两种">
        <lay-input v-model="model.password" type="password"></lay-input>
      </lay-form-item>
      <lay-form-item label="描述" prop="desc">
        <lay-textarea placeholder="请输入描述" v-model="model.describe"></lay-textarea>
      </lay-form-item>
      <lay-form-item style="text-align: center;">
        <lay-button type="primary" @click="submit">提交</lay-button>
        <lay-button type="default" @click="">重置</lay-button>
      </lay-form-item>
    </lay-form>
  </lay-container>
</template>

<script setup lang="ts">
import {ref} from 'vue'

const props = defineProps(['row'])
const model = ref({
  shop_name: '',
  password: '',
  describe: '',
})
</script>

<style scoped>
.user-box {
  height: calc(100vh - 110px);
  margin-top: 10px;
  box-sizing: border-box;
  overflow: hidden;
}
</style>
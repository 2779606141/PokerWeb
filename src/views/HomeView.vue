<template>
  <el-container class="layout-container-demo" style="height: 100%">
    <el-container>
      <el-header style="text-align: right; font-size: 12px">
        <el-select
            v-model="value"
            placeholder="选择卡牌"
            size="large"
            style="width: 240px"
            @change="handleChange"
        >
          <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
          />
        </el-select>
        <div class="toolbar">
          <router-link to="/home/user" style="text-decoration: none; color: inherit;">
            <el-icon style="margin-right: 8px; margin-top: 1px">
              <user />
            </el-icon>
            <span>用户中心111</span>
          </router-link>
        </div>
      </el-header>

      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { Menu as IconMenu, Message, Setting ,User} from '@element-plus/icons-vue'
import { RouterView } from 'vue-router'


const value = ref('')
const options = [
  {
    value: '/home1/home',
    label: '斗地主',
  },
  {
    value: 'Option2',
    label: '三国杀',
  },
]

const selectedComponent = ref('')

const handleChange = (val) => {
  // 根据选择框的值设置选中的组件
  selectedComponent.value = val
}
</script>

<style scoped>
.layout-container-demo .el-header {
  position: relative;
  background-color: var(--el-color-primary-light-7);
  color: var(--el-text-color-primary);
}

.layout-container-demo .el-menu {
  border-right: none;
}

.layout-container-demo .el-main {
  padding: 0;
}

.layout-container-demo .toolbar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  right: 20px;
}
</style>

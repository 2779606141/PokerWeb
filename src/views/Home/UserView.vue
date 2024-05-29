<template>
  <el-container class="layout-container-demo" style="height: 100%">
    <el-aside width="300px">
      <el-scrollbar>
        <el-menu :default-openeds="['1', '3']" :router="true">
          <el-menu-item index="info">
            <el-icon>
              <user />
            </el-icon>
            <span>用户信息</span>
          </el-menu-item>
          <el-menu-item index="change-password">
            <el-icon>
              <key />
            </el-icon>
            <span>修改密码</span>
          </el-menu-item>
          <el-menu-item index="charge">
            <el-icon>
              <money />
            </el-icon>
            <span>充值</span>
          </el-menu-item>
        </el-menu>
      </el-scrollbar>
    </el-aside>

    <el-container>


      <el-main>
        <RouterView />
      </el-main>
    </el-container>
  </el-container>
</template>

<script lang="ts" setup>
import {User,Key,Money} from '@element-plus/icons-vue'
import { RouterView } from 'vue-router'

</script>

<style scoped>
.layout-container-demo .el-header {
  position: relative;
  background-color: var(--el-color-primary-light-7);
  color: var(--el-text-color-primary);
}

.layout-container-demo .el-menu {
  border-right: none;
  background-color: #f5f5f5;
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

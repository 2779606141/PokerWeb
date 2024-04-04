<template>
  <el-container class="layout-container-demo" style="height: 100%">
    <el-aside width="200px">
      <el-scrollbar>
        <h5 style="text-align: center">菜单栏</h5>
        <el-menu :default-openeds="['1', '3']" :router="true">
          <el-sub-menu index="1">
            <template #title>
              <el-icon>
                <message />
              </el-icon>
              摄像头
            </template>
            <el-menu-item index="/home/cam">Option 1</el-menu-item>
            <el-menu-item index="/home/cam1">Option 2</el-menu-item>
            <el-menu-item index="/home/cam2">Option 3</el-menu-item>
          </el-sub-menu>
          <el-menu-item index="/home/pic">
            <el-icon>
              <icon-menu />
            </el-icon>
            <span>图片</span>
          </el-menu-item>
          <el-menu-item index="/home/vid">
            <el-icon>
              <icon-menu />
            </el-icon>
            <span>视频</span>
          </el-menu-item>
        </el-menu>
      </el-scrollbar>
    </el-aside>

    <el-container>
      <el-header style="text-align: right; font-size: 12px">
        <div class="toolbar">
          <el-dropdown>
            <el-icon style="margin-right: 8px; margin-top: 1px">
              <setting />
            </el-icon>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item>View</el-dropdown-item>
                <el-dropdown-item>Add</el-dropdown-item>
                <el-dropdown-item>Delete</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          <span>Tom</span>
        </div>
      </el-header>

      <el-main>
        <RouterView />
      </el-main>
    </el-container>
  </el-container>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { Menu as IconMenu, Message, Setting } from '@element-plus/icons-vue'
import { RouterView } from 'vue-router'

const item = {
  date: '2016-05-02',
  name: 'Tom',
  address: 'No. 189, Grove St, Los Angeles'
}
const tableData = ref(Array.from({ length: 20 }).fill(item))
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

<template>
  <el-container class="layout-container-demo" style="height: 100%">
    <el-aside  width="300px">
      <el-scrollbar>
        <el-menu :default-openeds="['1', '3']" :router="true">
          <el-sub-menu index="1">
            <template #title>
              <el-icon>
                <message />
              </el-icon>
              摄像头
            </template>
            <el-menu-item index="cam">记牌器</el-menu-item>
            <el-menu-item index="realtime">实时识别</el-menu-item>
            <el-menu-item index="frame">发送帧</el-menu-item>
            <el-menu-item index="testcam">高级记牌器</el-menu-item>
          </el-sub-menu>
          <el-menu-item index="pic">
            <el-icon>
              <icon-menu />
            </el-icon>
            <span>图片</span>
          </el-menu-item>
          <el-menu-item index="vid">
            <el-icon>
              <icon-menu />
            </el-icon>
            <span>视频</span>
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
import { Menu as IconMenu, Message, Setting ,User} from '@element-plus/icons-vue'
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

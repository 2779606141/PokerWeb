<template>
  <el-container class="layout-container-demo" style="height: 100%">
    <el-container>
      <el-header class="header">
        <div class="toolbar left">
          <router-link to="/home" style="text-decoration: none; color: inherit;">
            <el-icon style="margin-right: 8px; margin-top: 1px">
              <house />
            </el-icon>
            <span>回到主页面</span>
          </router-link>
        </div>
        <div class="toolbar center">
          {{ selectedText }}
        </div>
        <div class="toolbar right">
          <router-link to="/home/user" style="text-decoration: none; color: inherit;">
            <el-icon style="margin-right: 8px; margin-top: 1px">
              <user />
            </el-icon>
            <span>用户中心</span>
          </router-link>
        </div>
      </el-header>

      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { ref, watch} from 'vue';
import { House, User } from '@element-plus/icons-vue';
import { useRouter } from 'vue-router';
import axios from "axios";
import { ElMessage } from "element-plus";

const router = useRouter();

const options = [
  {
    value: 'poker',
    label: '扑克牌',
  },
  {
    value: 'sgs',
    label: '三国杀',
  },
  {
    value: 'games',
    label: '首页',
  },
  {
    value: 'user',
    label: '用户中心',
  },
];

const selectedText = ref('首页'); // 默认显示扑克牌


watch(() => router.currentRoute.value.path, (path) => {
  const parentPath = path.split('/')[2]; // 获取父路由部分
  const option = options.find(opt => opt.value === parentPath);
  if (option) {
    selectedText.value = option.label;
  }
});

</script>

<style scoped>
.layout-container-demo .header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: var(--el-color-primary-light-7);
  color: var(--el-text-color-primary);
  padding: 0 20px;
  font-size: 16px; /* 增大整体字体 */
}

.toolbar {
  display: flex;
  align-items: center;
}

.toolbar.left {
  justify-content: flex-start;
  flex: 1;
}

.toolbar.center {
  justify-content: center;
  flex: 1;
}

.toolbar.right {
  justify-content: flex-end;
  flex: 1;
}

.layout-container-demo .el-main {
  padding: 0;
}
</style>

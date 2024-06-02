<template>
  <el-container class="layout-container-demo" style="height: 100%">
    <el-container>
      <el-header class="header">
        <div class="toolbar left">
          <router-link to="/home" style="text-decoration: none; color: inherit;">
            <el-icon style="margin-right: 8px; margin-top: 1px">
              <house/>
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
              <user/>
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
import {ref, watch, onMounted} from 'vue';
import {House, User} from '@element-plus/icons-vue';
import {useRouter} from 'vue-router';
import axios from "axios";
import {ElMessage} from "element-plus";

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

const selectedText = ref('首页'); // 默认显示首页

const updateSelectedText = (path) => {
  const segments = path.split('/');
  const parentPath = segments.length > 2 ? segments[2] : 'games'; // 处理路径长度问题
  const option = options.find(opt => opt.value === parentPath);
  if (option) {
    selectedText.value = option.label;
  } else {
    selectedText.value = '首页'; // 如果匹配不到，默认显示首页
  }
};

// 在组件挂载时更新selectedText
onMounted(() => {
  updateSelectedText(router.currentRoute.value.path);
});

// 监听路由变化并更新selectedText
watch(() => router.currentRoute.value.path, (path) => {
  updateSelectedText(path);
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

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
import { ref, onMounted } from 'vue';
import { House, User } from '@element-plus/icons-vue';
import { useRouter } from 'vue-router';
import axios from "axios";

const router = useRouter();

const value = ref('斗地主'); // 设置默认值为 '斗地主'
const options = [
  {
    value: '/home/poker',
    label: '斗地主',
  },
  {
    value: '/home/sgs',
    label: '三国杀',
  },
];

// const handleChange = (val) => {
//   // 根据选择器的值跳转路由
//   router.push(val);
// };
const handleChange = (val) => {
  // 发送包含路由名称信息的请求
  axios.post('http://localhost:5000/change-model', { name: val.slice(6) })
      .then(response => {
        // 处理响应
        console.log(response.data.message);
        router.push(val);
      })
      .catch(error => {
        // 处理错误
        console.error('Error:', error);
      });
};

onMounted(() => {
  // 监听路由变化，在路由变化时更新选择框的值
  router.afterEach((to, from) => {
    // 根据当前路由的路径找到对应的标签(label)，并设置为选择框的值
    const option = options.find(opt => opt.value === to.path);
    if (option) {
      value.value = option.label;
    }
  });
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

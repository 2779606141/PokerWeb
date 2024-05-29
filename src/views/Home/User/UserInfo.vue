<template>
  <div class="user-info">
    <h2>用户信息</h2>
    <div v-if="userInfo">
      <p>用户名: {{ userInfo.username }}</p>
      <p>手机号: {{ userInfo.phone }}</p>
      <p>邮箱: {{ userInfo.email }}</p>
      <p>资产: {{ userInfo.asset }}</p>
    </div>
    <div v-else>
      <p>加载中...</p>
    </div>
    <el-button type="danger" @click="logout">登出</el-button>
  </div>
</template>

<script>
import axios from 'axios';
import Cookies from "js-cookie";
import {ElMessage} from "element-plus";

export default {
  data() {
    return {
      userInfo: null
    };
  },
  mounted() {
    // 获取用户信息
    this.getUserInfo();
  },
  methods: {
    async getUserInfo() {
      try {
        // 向后端发送请求获取用户信息
        const response = await axios.get('http://localhost:5000/user/info', {
          headers: {
            Authorization: `Bearer ${Cookies.get('token')}` // 发送令牌
          }
        });
        this.userInfo = response.data;
      } catch (error) {
        if (error.response && error.response.status === 401) {
          // 如果错误状态码是401，清空cookies并跳转到登录页面
          Cookies.remove('token');
          Cookies.remove('username');
          Cookies.remove('password');
          Cookies.remove('remember');
          ElMessage.error(error.response.data.error);
          this.$router.push('/login');
        } else {
          ElMessage.error(error.response.data.error || '未知错误');
        }
      }
    },
    logout() {
      // 清除令牌并导航到登录页面
      Cookies.remove('username');
      Cookies.remove('password');
      Cookies.remove('remember');
      Cookies.remove('token');
      this.$router.push('/login');
    }
  }
};
</script>

<style scoped>
.user-info {
  max-width: 400px;
  margin: 100px auto; /* 居中显示 */
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  text-align: center;
  background-color: #fff;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.user-info h2 {
  margin-bottom: 20px;
}

.user-info p {
  margin: 10px 0;
}

.el-button {
  margin: 10px 5px;
}
</style>

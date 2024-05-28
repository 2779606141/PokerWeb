<template>
  <div class="user-info">
    <h2>用户信息</h2>
    <div v-if="userInfo">
      <p>用户名: {{ userInfo.username }}</p>
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
            Authorization: `Bearer ${localStorage.getItem('token')}` // 发送令牌
          }
        });
        this.userInfo = response.data;
      } catch (error) {
        console.error('获取用户信息失败:', error);
      }
    },
    logout() {
      // 清除令牌并导航到登录页面
      localStorage.removeItem('token');
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

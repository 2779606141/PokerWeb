<template>
  <div class="user-info">
    <h2>用户信息</h2>
    <div v-if="userInfo">
      <p>用户名: {{ userInfo.username }}</p>
      <p>资产: {{ userInfo.assets }}</p>
    </div>
    <div v-else>
      <p>加载中...</p>
    </div>
    <button @click="changePassword">修改密码</button>
    <button @click="recharge">充值</button>
    <button @click="logout">登出</button>
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
    changePassword() {
      // 导航到修改密码页面
      this.$router.push('/change-password');
    },
    recharge() {
      // 导航到充值页面
      this.$router.push('/recharge');
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
  margin: auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  text-align: center;
}
</style>

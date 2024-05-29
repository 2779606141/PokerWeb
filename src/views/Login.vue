<template>
  <div class="login-container">
    <el-card class="login-card">
      <h3 class="login-title">登录</h3>
      <el-form
          :model="form"
          :rules="rules"
          ref="loginForm"
          label-width="100px"
          class="login-form"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
              type="password"
              v-model="form.password"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-checkbox v-model="form.remember">记住密码</el-checkbox>
          <router-link to="/forget-password" class="forget-password">忘记密码</router-link>
          <router-link to="/register" class="register">注册账户</router-link>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">登录</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue';
import { ElForm, ElFormItem, ElInput, ElCheckbox, ElButton, ElMessage } from 'element-plus';
import { useRouter } from 'vue-router';
import axios from 'axios';
import Cookies from 'js-cookie';

export default {
  components: {
    ElForm,
    ElFormItem,
    ElInput,
    ElCheckbox,
    ElButton,
  },
  setup() {
    const form = reactive({
      username: '',
      password: '',
      remember: false,
    });

    const rules = ref({
      username: [
        { required: true, message: '请输入用户名', trigger: 'blur' },
      ],
      password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
      ],
    });

    const loginForm = ref(null);
    const router = useRouter();

    onMounted(() => {
      // 页面加载时检查 cookies
      const remember = Cookies.get('remember') === 'true';
      if (remember) {
        form.username = Cookies.get('username') || '';
        form.password = Cookies.get('password') || '';
        form.remember = remember;
      }
    });

    const onSubmit = async () => {
      loginForm.value.validate(async (valid) => {
        if (valid) {
          try {
            const response = await axios.post('http://localhost:5000/user/login', {
              username: form.username,
              password: form.password,
            });

            if (response.data.message === '登录成功') {
              // 将 token 存储在 cookies 中
              Cookies.set('token', response.data.token, { secure: true, sameSite: 'Strict' });

              if (form.remember) {
                Cookies.set('username', form.username, { expires: 7 });  // 设置7天后过期
                Cookies.set('password', form.password, { expires: 7 });  // 设置7天后过期
                Cookies.set('remember', 'true', { expires: 7 });  // 设置7天后过期
              } else {
                Cookies.remove('username');
                Cookies.remove('password');
                Cookies.remove('remember');
              }

              ElMessage.success('登录成功！');
              await router.push('/home');
            } else {
              ElMessage.error(response.data.error || '未知错误');
            }
          } catch (error) {
            ElMessage.error(error.response.data.error);
          }
        } else {
          ElMessage.error('请输入完整信息');
        }
      });
    };

    return {
      form,
      rules,
      loginForm,
      onSubmit,
    };
  },
};
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.login-card {
  width: 360px;
  padding: 20px;
}

.login-title {
  text-align: center;
  margin-bottom: 20px;
}

.forget-password,
.register {
  margin-left: 10px;
  color: #409eff;
  text-decoration: none;
}

.forget-password:hover,
.register:hover {
  text-decoration: underline;
}
</style>

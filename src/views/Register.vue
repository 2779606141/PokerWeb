<template>
  <div class="register-container">
    <el-card class="register-card">
      <h3 class="register-title">注册</h3>
      <el-form
          :model="form"
          :rules="rules"
          ref="registerForm"
          label-width="100px"
          class="register-form"
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
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input
              type="password"
              v-model="form.confirmPassword"
          ></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="form.phone"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="form.email"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">注册</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { ref, reactive } from 'vue';
import { ElForm, ElFormItem, ElInput, ElButton, ElMessage } from 'element-plus';
import { useRouter } from 'vue-router';
import axios from 'axios';
import {API} from "../../api.config.js";

export default {
  components: {
    ElForm,
    ElFormItem,
    ElInput,
    ElButton,
  },
  setup() {
    const form = reactive({
      username: '',
      password: '',
      confirmPassword: '',
      phone: '',
      email: ''
    });

    const rules = ref({
      username: [
        { required: true, message: '请输入用户名', trigger: 'blur' },
      ],
      password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        {
          validator: (rule, value, callback) => {
            if (value.length >= 6) {
              callback();
            } else {
              callback(new Error('密码长度至少为6位'));
            }
          },
          trigger: 'blur'
        }
      ],
      confirmPassword: [
        { required: true, message: '请确认密码', trigger: 'blur' },
        {
          validator: (rule, value, callback) => {
            if (value === form.password) {
              callback();
            } else {
              callback(new Error('两次输入密码不一致'));
            }
          },
          trigger: 'blur'
        }
      ],
      phone: [
        {
          validator: (rule, value, callback) => {
            if (!value || (/^\d{11}$/.test(value))) {
              callback();
            } else {
              callback(new Error('手机号必须是11位数字'));
            }
          },
          trigger: 'blur'
        }
      ],
      email: [
        {
          type: 'email',
          message: '请输入有效的邮箱地址',
          trigger: ['blur', 'change']
        }
      ],
    });

    const registerForm = ref(null);
    const router = useRouter();

    const onSubmit = async () => {
      registerForm.value.validate(async (valid) => {
        if (valid) {
          try {
            const response = await axios.post(API.baseUrl + '/user/register', {
              username: form.username,
              password: form.password,
              phone: form.phone,
              email: form.email,
            });

            if (response.data.message === '注册成功') {
              ElMessage.success('注册成功！');
              await router.push('/login');
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
      registerForm,
      onSubmit,
    };
  },
};
</script>

<style scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.register-card {
  width: 360px;
  padding: 20px;
}

.register-title {
  text-align: center;
  margin-bottom: 20px;
}
</style>

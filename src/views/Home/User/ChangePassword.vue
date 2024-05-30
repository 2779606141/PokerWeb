<template>
  <div class="change-password">
    <el-card class="box-card">
      <h2 class="change-password-title">修改密码</h2>
      <el-form
          :model="form"
          :rules="rules"
          ref="changePasswordForm"
          label-width="100px"
          class="change-password-form"
      >
        <el-form-item label="旧密码" prop="oldPassword">
          <el-input type="password" v-model="form.oldPassword" autocomplete="off" />
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input type="password" v-model="form.newPassword" autocomplete="off" />
        </el-form-item>
        <el-form-item label="确认新密码" prop="confirmPassword">
          <el-input type="password" v-model="form.confirmPassword" autocomplete="off" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">提交</el-button>
          <el-button @click="onReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import axios from "axios";
import Cookies from "js-cookie";
import {ElMessage} from "element-plus";
import {API} from "../../../../api.config.js";


export default {
  setup() {
    const router = useRouter();
    const form = reactive({
      oldPassword: '',
      newPassword: '',
      confirmPassword: ''
    });

    const validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请确认新密码'));
      } else if (value !== form.newPassword) {
        callback(new Error('两次输入密码不一致'));
      } else {
        callback();
      }
    };

    const rules = ref({
      oldPassword: [
        { required: true, message: '请输入旧密码', trigger: 'blur' }
      ],
      newPassword: [
        { required: true, message: '请输入新密码', trigger: 'blur' },
        { min: 6, message: '密码长度不能小于6位', trigger: 'blur' }
      ],
      confirmPassword: [
        { required: true, message: '请确认新密码', trigger: 'blur' },
        { validator: validatePass2, trigger: 'blur' }
      ]
    });

    const changePasswordForm = ref(null);

    const onSubmit = async () => {
      changePasswordForm.value.validate(async (valid) => {
        if (valid) {
          try {
            const response = await axios.post(API.baseUrl + '/user/change-password', {
              oldPassword: form.oldPassword,
              newPassword: form.newPassword,
            }, {
              headers: {
                Authorization: `Bearer ${Cookies.get('token')}`
              }
            });
            if (response.data.message === '修改成功') {
              ElMessage.success('修改成功！');
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

    const onReset = () => {
      form.oldPassword = '';
      form.newPassword = '';
      form.confirmPassword = '';
    };

    return {
      form,
      rules,
      changePasswordForm,
      onSubmit,
      onReset,
    };
  },
};
</script>

<style scoped>
.change-password {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 100px auto; /* 居中显示 */
}

.box-card {
  width: 400px;
  padding: 20px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.change-password-title {
  text-align: center;
  margin-bottom: 20px;
}

.el-form-item {
  margin-bottom: 20px;
}

.el-button {
  margin-right: 10px;
}
</style>

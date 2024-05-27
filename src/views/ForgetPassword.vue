<template>
  <div class="forgot-password-container">
    <el-card class="forgot-password-card">
      <h3 class="forgot-password-title">忘记密码</h3>
      <el-form
          :model="forgotForm"
          :rules="forgotRules"
          ref="forgotForm"
          label-width="100px"
          class="forgot-password-form"
      >
        <el-form-item label="用户名/邮箱" prop="usernameOrEmail">
          <el-input v-model="forgotForm.usernameOrEmail"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">发送重置链接</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { ref } from 'vue';
import { ElCard, ElForm, ElFormItem, ElInput, ElButton, ElMessage } from 'element-plus';

export default {
  components: {
    ElCard,
    ElForm,
    ElFormItem,
    ElInput,
    ElButton,
  },
  setup() {
    const forgotForm = ref({
      usernameOrEmail: '',
    });

    const forgotRules = ref({
      usernameOrEmail: [
        { required: true, message: '请输入用户名或邮箱地址', trigger: 'blur' },
        { type: 'email', message: '请输入有效的邮箱地址', trigger: ['blur', 'change'] },
      ],
    });

    const forgotFormRef = ref(null);

    const onSubmit = () => {
      forgotFormRef.value.validate((valid) => {
        if (valid) {
          // 这里可以添加发送重置密码链接的逻辑，比如调用 API
          ElMessage.success('重置密码链接已发送到您的邮箱！');
          // 实际的 API 调用应该在这里
        } else {
          ElMessage.error('表单验证失败');
          return false;
        }
      });
    };
    return {
      forgotForm,
      forgotRules,
      forgotFormRef,
      onSubmit,
    };
  },
};
</script>

<style scoped>
.forgot-password-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.forgot-password-card {
  width: 360px;
  padding: 20px;
}

.forgot-password-title {
  text-align: center;
  margin-bottom: 20px;
}
</style>
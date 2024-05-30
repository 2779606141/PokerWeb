<template>
  <div>
    <h2>上传图片并检测</h2>
    <el-upload
        class="upload-demo"
        :show-file-list="false"
        :on-change="handleUpload"
    >
      <el-button type="primary">点击上传</el-button>
    </el-upload>
    <el-image
        v-if="imagePreviewUrl"
        :src="imagePreviewUrl"
        style="max-width: 400px; max-height: 400px; margin-top: 20px;"
    />
    <el-button
        type="primary"
        @click="detect"
        :disabled="!imagePreviewUrl"
        style="margin-top: 20px; margin-bottom: 20px;"
    >
      上传并检测
    </el-button>
    <el-image
        v-if="detectionImageUrl"
        :src="detectionImageUrl"
        style="max-width: 400px; max-height: 400px; margin-top: 20px;"
    />
    <el-alert
        v-if="errorMessage"
        title="错误"
        type="error"
        :closable="false"
        show-icon
        style="margin-top: 20px;"
    >
      {{ errorMessage }}
    </el-alert>
  </div>
</template>

<script>
import axios from 'axios';
import {API} from "../../../../api.config.js";

export default {
  data() {
    return {
      errorMessage: '',
      imagePreviewUrl: '',
      detectionImageUrl: ''
    };
  },
  methods: {
    handleUpload(event) {
      const file = event.raw;
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imagePreviewUrl = e.target.result;
      };
      reader.readAsDataURL(file);
    },
    async detect() {
      try {
        const response = await axios.post(API.baseUrl + '/detect/image', {
          image: this.imagePreviewUrl,
        });

        this.detectionImageUrl = response.data.processedImage;
        this.errorMessage = ''; // 清空错误消息
      } catch (error) {
        console.error('图片检测失败', error);
        this.errorMessage = '图片检测失败，请稍后重试';
      }
    },
  },
};
</script>

<style>
.upload-demo {
  display: inline-block;
}
</style>

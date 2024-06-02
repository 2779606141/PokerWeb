<template>
  <div class="upload-container">
    <h2>上传图片并检测</h2>
    <div class="button-container">
      <el-upload
          class="upload-demo"
          :show-file-list="false"
          :on-change="handleUpload"
      >
        <el-button type="primary" class="upload-button">点击上传</el-button>
      </el-upload>
      <el-button
          type="success"
          @click="detect"
          :disabled="!imagePreviewUrl"
          class="detect-button"
      >
        上传并检测
      </el-button>
    </div>
    <div class="image-container">
      <el-image
          v-if="imagePreviewUrl"
          :src="imagePreviewUrl"
          class="uploaded-image"

      />
      <el-image
          v-if="detectionImageUrl"
          :src="detectionImageUrl"
          class="detection-image"

      />
    </div>
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
          game:"sgs"
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
.upload-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.button-container {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.upload-button {
  margin-right: 20px;
}

.detect-button {
  margin-bottom: 20px;
}

.image-container {
  display: flex;
  justify-content: center;
}

.uploaded-image,
.detection-image {
  max-width: 750px;
  max-height: 1050px;
  margin-top: 20px;
  margin-right: 20px;
}
</style>

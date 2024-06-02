<template>
  <div class="upload-container">
    <h2>上传视频并检测</h2>
    <div class="button-container">
      <el-upload
          class="upload-demo"
          :show-file-list="false"
          :on-change="handleUpload"
          accept="video/*"
      >
        <el-button type="primary" class="upload-button">点击上传</el-button>
      </el-upload>
      <el-button
          type="success"
          @click="detect"
          :disabled="!videoFile"
          class="detect-button"
      >
        上传并检测
      </el-button>
    </div>
    <div class="video-container" v-if="videoPreviewUrl || detectionVideoUrl">
      <video
          v-if="videoPreviewUrl"
          controls
          :src="videoPreviewUrl"
          class="uploaded-video"
      ></video>
      <video
          v-if="detectionVideoUrl"
          controls
          :src="detectionVideoUrl"
          class="detection-video"
      ></video>
    </div>
    <p v-if="uploadError" class="error-message">{{ uploadError }}</p>
  </div>
</template>

<script>
import axios from 'axios';
import {ElLoading, ElMessage} from "element-plus";
import { API } from "../../../../api.config.js";

export default {
  data() {
    return {
      videoFile: null,
      videoPreviewUrl: '',
      detectionVideoUrl: '',
      uploadError: null
    };
  },

  methods: {
    handleUpload(event) {
      const file = event.raw;
      this.videoFile = file;
      if (file) {
        this.videoPreviewUrl = URL.createObjectURL(file);
      } else {
        this.videoPreviewUrl = '';
      }
    },

    async detect() {
      if (!this.videoFile) {
        this.uploadError = '请选择一个视频文件';
        return;
      }
      const loadingInstance = ElLoading.service({
            lock: true,
            text: '加载中',
            background: 'rgba(0, 0, 0, 0.7)',
          });

      const formData = new FormData();
      formData.append('video', this.videoFile);
      formData.append('game', 'poker');

      try {
        const response = await axios.post(`${API.baseUrl}/detect/video`, formData, {
          responseType: 'blob'
        });

        const blob = new Blob([response.data], { type: 'video/mp4' });
        this.detectionVideoUrl = URL.createObjectURL(blob);
        this.uploadError = null;
      } catch (error) {
        this.uploadError = '上传视频失败，请重试';
        ElMessage.error(this.uploadError);
      }finally {
            loadingInstance.close();
          }
    }
  }
}
</script>

<style scoped>
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

.video-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.uploaded-video,
.detection-video {
  max-width: 750px;
  max-height: 1050px;
  margin-top: 20px;
}

.error-message {
  color: red;
  margin-top: 10px;
}
</style>

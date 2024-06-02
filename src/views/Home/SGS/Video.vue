<template>
  <div class="upload-container">
    <h2>上传视频并检测</h2>
    <input type="file" @change="handleVideoChange" accept="video/*" style="display: none;" ref="videoInput" />
    <div class="button-container">
      <el-button type="primary" @click="chooseVideo" class="upload-button">选择视频</el-button>
      <el-button type="success" @click="uploadVideo" class="upload-button">上传视频</el-button>
    </div>
    <video
        v-if="processedVideoUrl"
        controls
        :src="processedVideoUrl"
        class="uploaded-video"
    ></video>
    <p v-if="uploadError" class="error-message">{{ uploadError }}</p>
  </div>
</template>

<script>
import {API} from "../../../../api.config.js";

export default {
  data() {
    return {
      videoFile: null,
      processedVideoUrl: null,
      uploadError: null
    }
  },
  methods: {
    chooseVideo() {
      this.$refs.videoInput.click();
    },

    handleVideoChange(event) {
      this.videoFile = event.target.files[0]
      if (this.videoFile) {
        this.processedVideoUrl = URL.createObjectURL(this.videoFile)
      } else {
        this.processedVideoUrl = null
      }
    },
    uploadVideo() {
      if (!this.videoFile) {
        this.uploadError = '请选择一个视频文件'
        return
      }

      const formData = new FormData()
      formData.append('video', this.videoFile)

      const xhr = new XMLHttpRequest()
      xhr.open('POST', API.baseUrl + '/detectVideo', true)
      xhr.responseType = 'blob' // 设置responseType为'blob'以正确处理视频数据

      xhr.onload = () => {
        if (xhr.status === 200) {
          const blob = new Blob([xhr.response], { type: 'video/mp4' })
          this.processedVideoUrl = URL.createObjectURL(blob)
          this.uploadError = null
        } else {
          this.uploadError = '上传视频失败，请重试'
        }
      }

      xhr.onerror = () => {
        this.uploadError = '上传视频失败，请重试'
      }

      xhr.send(formData)
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

.uploaded-video {
  max-width: 750px;
  max-height: 1050px;
  margin-top: 20px;
  margin-right: 20px;
}

.error-message {
  color: red;
  margin-top: 10px;
}
</style>
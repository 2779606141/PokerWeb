<template>
  <div>
    <input type="file" @change="handleVideoChange" accept="video/*" />
    <button @click="uploadVideo">上传视频</button>
    <video
      v-if="processedVideoUrl"
      controls
      :src="processedVideoUrl"
      style="max-width: 100%; margin-top: 20px"
    ></video>
    <p v-if="uploadError" style="color: red">{{ uploadError }}</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      videoFile: null,
      processedVideoUrl: null,
      uploadError: null
    }
  },
  methods: {
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
      xhr.open('POST', 'http://localhost:5000/detectVideo', true)
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

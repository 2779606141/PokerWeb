<template>
  <div class="camera-container">
    <div class="button-container">
      <el-button @click="startCamera" type="primary">开启摄像头</el-button>
      <el-button @click="stopCamera" type="danger">关闭摄像头</el-button>
      <el-button @click="sendCurrentFrameToServer" type="success">发送当前帧</el-button>
    </div>
    <div class="video-container">
      <video ref="videoElement" autoplay></video>
      <canvas ref="processedCanvas" style="margin-left: 30px"></canvas>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import {API} from "../../../../api.config.js"; // 引入axios

export default {
  name: 'CameraComponent',
  data() {
    return {
      stream: null, // 保存媒体流的引用
      processing: false // 是否正在处理图像
    }
  },
  beforeUnmount(){
    this.stopCamera();
  },
  methods: {
    async startCamera() {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        try {
          const constraints = { video: true }
          this.stream = await navigator.mediaDevices.getUserMedia(constraints)
          this.$refs.videoElement.srcObject = this.stream
          this.startProcessing()
        } catch (error) {
          console.error('Error accessing media devices', error)
          alert('无法访问摄像头，请检查权限设置。')
        }
      } else {
        alert('您的浏览器不支持getUserMedia API。')
      }
    },
    stopCamera() {
      if (this.stream) {
        this.stream.getTracks().forEach((track) => track.stop())
        this.$refs.videoElement.srcObject = null
      }
      this.processing = false // 停止处理图像
    },
    startProcessing() {
      this.processing = true;
      // 保留对视频流处理的初始化代码，但移除自动发送帧的逻辑
      // 因为发送帧的操作已经通过一个单独的按钮点击来触发

      const video = this.$refs.videoElement;
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');

      const processFrame = () => {
        if (!this.processing) {
          return; // 如果不再处理视频流，则退出
        }

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        // 注意，这里不再自动发送帧到服务器，而是等待用户点击发送按钮
        if (this.processing) {
          // 继续监控视频流，但不发送帧
          requestAnimationFrame(processFrame);
        }
      };

      requestAnimationFrame(processFrame); // 启动视频流处理循环
    },

    sendFrameToServer(imageData) {
      axios.post(API.baseUrl + '/detect/image', {
        image: imageData
      })
          .then((response) => {
            this.updateProcessedFrame(response.data.processedImage)
          })
          .catch((error) => {
            console.error('Error sending image to server:', error)
          })
    },
    sendCurrentFrameToServer() {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      const video = this.$refs.videoElement;

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      const imageData = canvas.toDataURL('image/jpeg');
      this.sendFrameToServer(imageData);
    },
    updateProcessedFrame(processedImage) {
      const img = new Image()
      img.onload = () => {
        const canvas = this.$refs.processedCanvas
        canvas.width = img.width
        canvas.height = img.height
        const context = canvas.getContext('2d')
        context.drawImage(img, 0, 0)
      }
      img.src = processedImage
    }
  }
}
</script>

<style scoped>
.camera-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background-color: inherit;
  border-radius: 8px;
  box-shadow: none;
}

.button-container {
  margin-bottom: 20px;
}

.video-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

video, canvas {
  max-width: 100%;
  border: 2px solid #007bff;
  border-radius: 5px;
}

video {
  margin-right: 20px;
}
</style>
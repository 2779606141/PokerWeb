<template>
  <div class="camera-container">
    <div class="button-container">
      <el-button @click="startCamera" type="primary">开启摄像头</el-button>
      <el-button @click="stopCamera" type="danger">关闭摄像头</el-button>
    </div>
    <div class="video-container">
      <video ref="videoElement" autoplay></video>
      <canvas ref="processedCanvas"></canvas>
    </div>
  </div>
</template>

<script>
import {io} from 'socket.io-client';
import {API} from "../../../../api.config.js";

export default {
  name: 'CameraComponent',
  data() {
    return {
      stream: null, // 保存媒体流的引用
      processing: false, // 是否正在处理图像
      socket: null,
    }
  },

  created() {
    this.socket = io(API.baseUrl + ''); // 服务器地址，根据实际情况调整
    this.socket.on('connect', () => console.log('Connected to WebSocket server.'));
    this.socket.on('processed', (data) => {
      if (!this.processing) {
        return;
      }
      const blob = new Blob([data], {type: 'image/jpeg'});
      this.updateProcessedFrame(blob);
    });
    this.socket.binaryType = 'blob'; // 确保接收的是二进制数据
  },

  beforeUnmount() {
    // 当组件即将销毁时关闭WebSocket连接
    if (this.socket) {
      this.socket.close();
    }
    // 如果摄像头还在运行,则关闭摄像头
    this.stopCamera();
  },

  methods: {
    async startCamera() {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        try {
          const constraints = {video: true}
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
      this.processing = true
      const canvas = document.createElement('canvas')
      const context = canvas.getContext('2d')
      const video = this.$refs.videoElement

      let lastSentTime = Date.now();

      const processFrame = () => {
        const now = Date.now();
        if (!this.processing) {
          return;
        }
        if (now - lastSentTime < 100) {
          requestAnimationFrame(processFrame);
          return;
        }

        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        canvas.toBlob(blob => {
          this.socket.emit('image', { image: blob, game: "poker" });
        }, 'image/webp');
        lastSentTime = now;
        if (this.processing) {
          // 检查是否还应该继续处理
          requestAnimationFrame(processFrame)
        }
      }
      requestAnimationFrame(processFrame)
    },


    updateProcessedFrame(blob) {
      const img = new Image();
      img.onload = () => {
        const canvas = this.$refs.processedCanvas; // 确保此处引用的canvas正确
        if (canvas) {
          canvas.width = img.width;
          canvas.height = img.height;
          const context = canvas.getContext('2d');
          context.clearRect(0, 0, canvas.width, canvas.height); // 清除之前的绘图
          context.drawImage(img, 0, 0, img.width, img.height); // 画图尺寸应与图像原始尺寸匹配
        }
      };
      img.src = URL.createObjectURL(blob); // 将Blob转换为URL
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
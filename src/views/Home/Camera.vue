<template>
  <div>
    <button @click="startCamera">开启摄像头</button>
    <button @click="stopCamera">关闭摄像头</button>
    <div>
      <video ref="videoElement" autoplay></video>
    </div>
  </div>
</template>

<script>
import axios from 'axios'; // 引入axios

export default {
  name: 'CameraComponent',
  data() {
    return {
      stream: null, // 保存媒体流的引用
      processing: false // 是否正在处理图像
    }
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
      this.processing = true
      const canvas = document.createElement('canvas')
      const context = canvas.getContext('2d')
      const video = this.$refs.videoElement

      let lastSentTime = Date.now();

      const processFrame = () => {
        const now = Date.now();
        if (!this.processing){
          return;
        }
        if(now - lastSentTime < 200){
          requestAnimationFrame(processFrame);
          return;
        }

        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        context.drawImage(video, 0, 0, canvas.width , canvas.height );

        const imageData = canvas.toDataURL('image/jpeg')

        this.sendFrameToServer(imageData)
        lastSentTime = now;

        if (this.processing) {
          // 检查是否还应该继续处理
          requestAnimationFrame(processFrame)
        }
      }

      requestAnimationFrame(processFrame)
    },
    sendFrameToServer(imageData) {
      axios.post('http://localhost:5000/detectCam1', {
        image: imageData
      })
          .then((response) => {
            console.log('Server response:', response.data); // 直接在控制台输出服务器返回的字符串
          })
          .catch((error) => {
            console.error('Error sending image to server:', error)
          })
    },
  }
}
</script>

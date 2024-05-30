<template>
  <div>
    <button @click="startCamera">开启摄像头</button>
    <button @click="stopCamera">关闭摄像头</button>
    <div style="display: flex">
      <video ref="videoElement" autoplay></video>
    </div>
    <ul>
      <li v-for="(result, index) in displayedResults" :key="index">{{ result }}</li>
    </ul>
  </div>
</template>

<script>
import { io } from 'socket.io-client'
import {API} from "../../../../api.config.js";
export default {
  name: 'CameraComponent',
  data() {
    return {
      stream: null, // 保存媒体流的引用
      processing: false, // 是否正在处理图像
      socket: null,
      displayedResults: [], // 用于存储已显示的识别结果
      pokerDeck: this.createPokerDeck()
    }
  },
  created() {
    this.createPokerDeck()
    this.socket = io(API.baseUrl + '') // 服务器地址，根据实际情况调整
    this.socket.on('connect', () => console.log('Connected to WebSocket server.'))
    this.socket.on('processed', (data) => {
      if (!this.processing) {
        return
      }
      console.log(data)
      for (const card of data) {
        if (this.pokerDeck[card] < 3) {
          this.pokerDeck[card]++
        } else if (!this.displayedResults.includes(card)) {
          this.displayedResults.push(card)
        }
      }
      // const uniqueResults = data.filter(result => !this.displayedResults.includes(result));
      // this.displayedResults.push(...uniqueResults);
      // this.displayResults(uniqueResults); // 显示结果
    })
  },
  beforeUnmount() {
    // 当组件即将销毁时关闭WebSocket连接
    if (this.socket) {
      this.socket.close()
    }
    // 还可以在这里关闭摄像头，如果摄像头还在运行
    this.stopCamera()
  },
  methods: {
    createPokerDeck() {
      const suits = ['黑桃', '红桃', '方块', '梅花']
      const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']
      let pokerDeck = {} // 创建一个空字典用于存储扑克牌
      // 遍历花色和点数，构建扑克牌字典
      suits.forEach((suit) => {
        ranks.forEach((rank) => {
          // 构建扑克牌的名称
          let cardName = `${suit}${rank}`
          // 默认次数为0
          pokerDeck[cardName] = 0
        })
      })
      return pokerDeck
    },
    displayResults(results) {
      // 简单示例：直接打印到控制台
      results.forEach((result) => {
        console.log(result)
      })
      // 或者，你可以更新页面上的某个元素来显示这些结果
      // 例如，将结果追加到某个<div>或者列表中
    },
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
        this.stream.getTracks()[0].stop()
        this.$refs.videoElement.srcObject = null
      }
      this.processing = false // 停止处理图像
    },
    startProcessing() {
      this.processing = true
      const canvas = document.createElement('canvas')
      const context = canvas.getContext('2d')
      const video = this.$refs.videoElement

      let lastSentTime = Date.now()

      const processFrame = () => {
        const now = Date.now()
        if (!this.processing) {
          return
        }
        if (now - lastSentTime < 200) {
          requestAnimationFrame(processFrame)
          return
        }

        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        context.drawImage(video, 0, 0, canvas.width, canvas.height)

        canvas.toBlob((blob) => {
          this.socket.emit('image1', blob)
        }, 'image/webp')
        lastSentTime = now
        if (this.processing) {
          // 检查是否还应该继续处理
          requestAnimationFrame(processFrame)
        }
      }
      requestAnimationFrame(processFrame)
    },
    updateProcessedFrame(blob) {
      const img = new Image()
      img.onload = () => {
        const canvas = this.$refs.processedCanvas
        if (canvas) {
          // 检查canvas是否存在
          canvas.width = img.width
          canvas.height = img.height
          const context = canvas.getContext('2d')
          context.drawImage(img, 0, 0)
        }
      }
      img.src = URL.createObjectURL(blob) // 创建一个URL表示指定的Blob对象或File对象
    }
  }
}
</script>

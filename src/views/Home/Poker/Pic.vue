<script>
import axios from 'axios'

export default {
  data() {
    return {
      errorMessage: '',
      imagePreviewUrl: '', // 用于存储图片预览的 URL
      formData: null, // 用于存储上传的 FormData 对象
      detectionImageUrl: '' // 用于存储检测后的图片 URL
    }
  },
  methods: {
    async login() {
      try {
        const response = await axios.post('http://localhost:5000/user/login', {
          userName: this.username,
          password: this.password
        })
        const { code, data, msg } = response.data
        if (code === 0) {
          // 登录成功
          console.log('登录成功', data.token)
          this.errorMessage = '' // 清空错误消息
        } else {
          // 登录失败，显示错误消息
          this.errorMessage = msg
        }
      } catch (error) {
        console.error('登录失败', error)
        this.errorMessage = '登录失败，请稍后重试'
      }
    },
    async previewImage(event) {
      // 从事件对象中获取上传的文件
      const file = event.target.files[0]
      // 将文件存储在 FormData 对象中
      this.formData = new FormData()
      this.formData.append('file', file)

      // 通过 FileReader 对象预览图片
      const reader = new FileReader()
      reader.onload = (e) => {
        this.imagePreviewUrl = e.target.result
      }
      reader.readAsDataURL(file)
    },
    async detect() {
      try {
        const response = await axios.post('http://localhost:5000/detect', this.formData, {
          responseType: 'arraybuffer', // 指定响应类型为二进制数据
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })

        // 将后端返回的二进制数据转换为 Blob 对象
        const blob = new Blob([response.data], { type: 'image/jpeg' })
        // 通过 URL.createObjectURL() 方法创建 Blob 对象的 URL
        this.detectionImageUrl = URL.createObjectURL(blob)
      } catch (error) {
        console.error('图片检测失败', error)
        // 在实际应用中，您可能希望在页面上显示错误消息
      }
    }
  }
}
</script>

<template>
  <div>
    <h2>上传图片并检测</h2>
    <input type="file" @change="previewImage" accept="image/*" />
    <img
      v-if="imagePreviewUrl"
      :src="imagePreviewUrl"
      style="max-width: 400px; max-height: 400px"
    />
    <button @click="detect">上传并检测</button>
    <img
      v-if="detectionImageUrl"
      :src="detectionImageUrl"
      style="max-width: 400px; max-height: 400px"
    />
    <el-button plain>Plain</el-button>
  </div>
</template>

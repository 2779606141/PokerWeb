<template>
  <div class="camera-container">
    <div class="button-container">
      <el-button @click="startCamera" type="primary">开启摄像头</el-button>
      <el-button @click="stopCamera" type="danger">关闭摄像头</el-button>
    </div>
    <div class="video-container">
      <video ref="videoElement" autoplay></video>
    </div>
  </div>
  <div class="poker-container">
    <table>
      <thead>
      <tr>
        <th>黑桃</th>
        <th>红桃</th>
        <th>方块</th>
        <th>梅花</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="rank in ranks" :key="rank">
        <td v-for="suit in suits" :key="suit" :class="{ highlighted: pokerDeck[suit + rank] >= 3 }">
          {{ suit + rank }}
        </td>
      </tr>
      </tbody>
    </table>
    <el-button @click="reCount" type="primary">重新计牌</el-button>
    <div class="poker-type">
      当前牌型：<span ref="pokerTypeDisplay">{{ currentPokerType }}</span>
    </div>
  </div>
</template>

<script>
import {io} from 'socket.io-client'
import {API} from "../../../../api.config.js";

export default {
  name: 'CameraComponent',
  data() {
    return {
      ranks: ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'],//点数
      suits: ['黑桃', '红桃', '方块', '梅花'],//花色
      stream: null, // 保存媒体流的引用
      processing: false, // 是否正在处理图像
      socket: null,
      displayedResults: [], // 用于存储已显示的识别结果
      pokerDeck: this.createPokerDeck(),
      currentPokerType: '', // 当前显示的牌型
      timer: null, // 计时器变量
      cardsDuringTimer: [] // 新增数组用于存储计时器期间的牌
    }
  },

  created() {
    this.socket = io(API.baseUrl) // 服务器地址
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
          this.cardsDuringTimer.push(card) // 将牌添加到 cards_during_timer 数组
          this.startTimer() // 启动或重置计时器
        }
      }
    })
  },

  beforeUnmount() {
    // 当组件即将销毁时关闭WebSocket连接
    if (this.socket) {
      this.socket.close()
    }
    // 关闭摄像头，如果摄像头还在运行
    this.stopCamera()
  },

  methods: {
    reCount() {
      this.pokerDeck = this.createPokerDeck()
      this.displayedResults = []
      this.currentPokerType = ''
      this.cardsDuringTimer = []
    },

    // 创建一副牌的map
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

    startTimer() {
      // 如果计时器已经启动，则先清除
      if (this.timer) {
        clearTimeout(this.timer)
      }
      // 重置计时器
      this.timer = setTimeout(() => {
        // 计时器结束时执行的操作
        console.log('计时器结束，cards_during_timer:', this.cardsDuringTimer)
        // this.checkType()
        this.currentPokerType = this.checkType()
        this.cardsDuringTimer = [] // 清空数组，为下一次计时做准备
      }, 2000) // 设置计时器为1秒
    },

    //统计出现次数
    countOccurrences(array) {
      return array.reduce((acc, value) => {
        acc.set(value, (acc.get(value) || 0) + 1)
        return acc
      }, new Map())
    },

    //识别牌型
    checkType() {
      //单张直接返回
      if (this.cardsDuringTimer.length === 1) {
        return this.cardsDuringTimer[0]
      }
      const cardNumbers = this.cardsDuringTimer.map((card) => {
        const point = card[2]
        return card.length === 4 ? '10' : point
      })

      // 替换牌面值并转换为数值
      const mappedCards = cardNumbers.map((card) => {
        switch (card) {
          case 'J':
            return 11
          case 'Q':
            return 12
          case 'K':
            return 13
          case 'A':
            return 14
          case '2':
            return 15
          default:
            return parseInt(card, 10) // 其他情况直接转为整数
        }
      })

      //字符转数值
      function charToValue(card) {
        switch (card) {
          case 'J':
            return 11;
          case 'Q':
            return 12;
          case 'K':
            return 13;
          case 'A':
            return 14;
          case '2':
            return 15;
          default:
            return parseInt(card, 10); // 其他情况直接转为整数
        }
      }

      //数值转字符
      function valueToChar(card) {
        switch (card) {
          case 11:
            return 'J';
          case 12:
            return 'Q';
          case 13:
            return 'K';
          case 14:
            return 'A';
          case 15:
            return '2';
          default:
            return card.toString(); // 其他情况直接返回点数作为字符串
        }
      }

      //排序
      mappedCards.sort((a, b) => a - b)
      const numberCounts = this.countOccurrences(mappedCards)

      //对子
      if (this.cardsDuringTimer.length === 2) {
        console.log(numberCounts.get(13));//识别 K 的时候输出 2
        console.log(cardNumbers[0]);//K
        if (numberCounts.get(charToValue(cardNumbers[0])) === 2) {
          return `对子：${cardNumbers[0]} ${cardNumbers[0]}`
        } else {
          return `错误: ${this.numbersToCards(mappedCards)}`
        }
      }

      //炸弹或三带一
      if (this.cardsDuringTimer.length === 4) {
        if (numberCounts.get(charToValue(cardNumbers[0])) === 4) {
          return `炸弹：${cardNumbers[0]} ${cardNumbers[0]} ${cardNumbers[0]} ${cardNumbers[0]}`
        }
        //三带一
        let threeCard = this.findFirstEntry(numberCounts, (card, count) => count === 3)
        if (threeCard != null) {
          let extraCard = this.findFirstEntry(numberCounts, (card, count) => count === 1)
          return `三${valueToChar(threeCard)}带一${valueToChar(extraCard)}`
        } else {
          return `错误: ${this.numbersToCards(mappedCards)}`
        }
      }


      if (this.cardsDuringTimer.length > 4) {
        // 三带二
        // 确保 cardsDuringTimer 长度为 5，即存在三带一对的情况
        let threeCard = this.findFirstEntry(numberCounts, (card, count) => count === 3)

        if (this.cardsDuringTimer.length === 5 && threeCard != null) {
          let extraCard = this.findFirstEntry(numberCounts, (card, count) => count === 2)
          if (extraCard != null) {
            return `三${valueToChar(threeCard)}带一对${valueToChar(extraCard)}`
          } else {
            return `错误: ${this.numbersToCards(mappedCards)}`
          }
        }

        //四带二
        let fourCard = this.findFirstEntry(numberCounts, (card, count) => count === 4)
        if (this.cardsDuringTimer.length === 6 && fourCard != null) {
          const remainingCards = mappedCards.filter(card => card !== fourCard);
          return `四带二 ：四${valueToChar(fourCard)}带${valueToChar(remainingCards[0]) + "," + valueToChar(remainingCards[0])}`
        }

        //四带两对
        if (this.cardsDuringTimer.length === 8 && fourCard != null) {
          // 检查剩下的牌中是否有两对
          const remainingCounts = new Map(numberCounts);
          remainingCounts.delete(fourCard);
          let pairCount = 0;
          for (const count of remainingCounts.values()) {
            if (count === 2) {
              pairCount++;
            }
          }
          if (pairCount === 2) {
            const remainingPairs = Array.from(remainingCounts.keys()).filter(card => remainingCounts.get(card) === 2);
            return `四${fourCard}带两对${valueToChar(remainingPairs[0]) + "," + valueToChar(remainingPairs[1])}`;
          } else {
            return `错误: ${this.numbersToCards(mappedCards)}`
          }
        }

        //判断顺子
        if (Array.from(numberCounts.entries()).every(([_, count]) => count === 1)) {
          if (this.isConsecutive(mappedCards) && !mappedCards.includes(15)) {
            return `顺子：${this.numbersToCards(mappedCards)}`
          } else {
            return `错误: ${this.numbersToCards(mappedCards)}`
          }
        }

        //判断连对
        if (Array.from(numberCounts.entries()).every(([_, count]) => count === 2)) {
          if (this.isConsecutive(mappedCards) && !mappedCards.includes(15)) {
            return `连对：${this.numbersToCards(mappedCards)}`
          } else {
            return `错误: ${this.numbersToCards(mappedCards)}`
          }
        }

        //判断飞机
        let threeCards = Array.from(numberCounts.entries())
            .filter((entry) => entry[1] === 3)
            .map((entry) => entry[0])
            .sort((a, b) => a - b); // 按从小到大排序
        console.log(threeCards);
        let extraCards = {}
        if (!this.isConsecutive(threeCards)) {
          return `错误: ${this.numbersToCards(mappedCards)}`
        } else {
          if (threeCards.length > 1 ) {
            if (mappedCards.length === 3 * threeCards.length) {
              return `飞机：${this.numbersToCards(mappedCards)}`
            } else if (mappedCards.length === 4 * threeCards.length) {
              extraCards = mappedCards.filter((value) => !threeCards.includes(value))
              return `飞机：${this.numbersToCards(mappedCards.filter((value) => !extraCards.includes(value)))}
          ${this.numbersToCards(extraCards)}`
            } else if (mappedCards.length === 5 * threeCards.length) {
              extraCards = mappedCards.filter((value) => !threeCards.includes(value))
              if (this.allAdjacentElementsAppearTwice(extraCards)) {
                return `飞机：${this.numbersToCards(mappedCards.filter((value) => !extraCards.includes(value)))}
          ${this.numbersToCards(extraCards)}`
              }
            } else {
              return `错误: ${this.numbersToCards(mappedCards)}`
            }
          } else {
            return `错误: ${this.numbersToCards(mappedCards)}`
          }
        }

      }
    },

    findFirstEntry(map, predicate) {
      for (let [key, value] of map) {
        if (predicate(key, value)) {
          return key
        }
      }
      return null
    },

    isConsecutive(array) {
      // 遍历数组，检查相邻元素的差值
      for (let i = 0; i < array.length - 1; i++) {
        // 如果相邻元素之间的差值不是1或0，则数组不连续
        if (array[i + 1] - array[i] !== 1 && array[i + 1] - array[i] !== 0) {
          return false
        }
      }
      // 如果所有相邻元素的差值都是1，则数组连续
      return true
    },

    allAdjacentElementsAppearTwice(arr) {
      // 假设数组是有序的，并且相同的元素是相邻的
      if (arr.length % 2 !== 0) {
        // 如果数组长度不是偶数，那么不可能所有元素都出现两次
        return false
      }
      for (let i = 0; i < arr.length; i += 2) {
        // 检查相邻的元素是否相等
        if (arr[i] !== arr[i + 1]) {
          // 如果不相等，说明不是所有元素都出现两次
          return false
        }
      }
      // 所有相邻元素都相等，说明所有元素都出现两次
      return true
    },

    numbersToCards(numbers) {
      // 创建一个映射对象，用于快速查找牌面值
      const cardValues = {
        11: 'J',
        12: 'Q',
        13: 'K',
        14: 'A',
        15: '2'
      }
      // 使用map函数遍历数组并替换值
      return numbers.map((number) => {
        // 检查数字是否在映射对象中，如果是则返回对应的牌面值，否则返回原数字（假设其他数字是有效的）
        return cardValues[number] || number
      })
    },

    async startCamera() {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        try {
          const constraints = {video: true}
          this.stream = await navigator.mediaDevices.getUserMedia(constraints)
          this.$refs.videoElement.srcObject = this.stream
          this.startProcessing()
          this.$refs.videoElement.addEventListener('loadedmetadata', () => {
            this.$refs.videoElement.requestPictureInPicture();
          });
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
          this.socket.emit('image1', { image: blob, game: "poker" })
        }, 'image/webp')
        lastSentTime = now
        if (this.processing) {
          // 检查是否还应该继续处理
          requestAnimationFrame(processFrame)
        }
      }
      requestAnimationFrame(processFrame)
    },

  }
}
</script>

<style scoped>
.camera-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
}

.button-container {
  margin-bottom: 20px;
}

.video-container {
  max-width: 0;
  max-height: 0;
  visibility: hidden;
}

video {
  width: 100%;
  height: auto;
}

.poker-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

table {
  border-collapse: collapse;
  width: 80%;
  max-width: 800px;
}

th, td {
  border: 1px solid #ccc;
  padding: 8px;
  text-align: center;
}

th {
  background-color: #f2f2f2;
}

.highlighted {
  background-color: yellow;
}

button {
  margin-top: 10px;
}

.poker-type {
  font-size: 24px; /* 设置字体大小为 24 像素 */
}
</style>

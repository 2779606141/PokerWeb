<template>
  <el-container class="layout-container-demo" style="height: 100%">
    <el-container>
      <el-header class="header">
        <div class="toolbar left">
          <router-link to="/home" style="text-decoration: none; color: inherit;">
            <el-icon style="margin-right: 8px; margin-top: 1px">
              <house/>
            </el-icon>
            <span>回到主页面</span>
          </router-link>
        </div>
        <div class="toolbar center">
          {{ selectedText }}
        </div>
        <div class="toolbar right">
          <div @click="drawer = true" style="cursor: pointer;">
          <el-icon style="margin-right: 8px; margin-top: 1px">
            <chat-line-round/>
          </el-icon>
          <span style="margin-right: 20px">AI助手</span>
          </div>
          <router-link to="/home/user" style="text-decoration: none; color: inherit;">
            <el-icon style="margin-right: 8px; margin-top: 1px">
              <user/>
            </el-icon>
            <span>用户中心</span>
          </router-link>
        </div>
      </el-header>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
  <el-drawer v-model="drawer" title="AI助手">
    <div class="chat-container">
      <div class="messages" ref="messagesContainer">
        <!-- 显示用户提问和AI回复 -->
        <div
            class="message"
            v-for="(message, index) in messages"
            :key="index"
            :class="message.role"
        >
          <span class="message-content">{{ message.content }}</span>
        </div>
      </div>
      <div class="input-container">
        <input
            type="text"
            v-model="inputMessage"
            placeholder="输入消息..."
            class="chat-input"
            @keyup.enter="sendMessage"
        />
        <el-button @click="sendMessage" class="send-button">发送</el-button>
      </div>
    </div>
  </el-drawer>
</template>

<script>
import {ref, watch, onMounted, nextTick} from 'vue';
import { House, User, ChatLineRound } from '@element-plus/icons-vue';
import { useRouter } from 'vue-router';
import { ElDrawer, ElButton,ElMessage } from 'element-plus';
import axios from "axios";
import {API} from "../../api.config.js";

export default {
  components: {
    ElDrawer,
    ElButton,
    House, User, ChatLineRound
  },
  setup() {
    const router = useRouter();
    const drawer = ref(false);
    const messages = ref([]);
    const inputMessage = ref('');
    const messagesContainer = ref(null);

    const sendMessage = async () => {
      if (inputMessage.value.trim()) {
        // 添加用户的提问到消息列表
        addMessage(inputMessage.value, 'user');
        try {
          const response = await axios.post(API.baseUrl + '/ai', {
            content: inputMessage.value,
          });
          // 假设后端返回的数据格式是 { response: 'AI回复的内容' }
          const aiResponse = response.data.response;
          addMessage(aiResponse, 'ai');
        } catch (error) {
          console.error('发送消息失败：', error);
          ElMessage.error('发送消息失败');
        } finally {
          // 清空输入框
          inputMessage.value = '';
          // 滚动到消息列表底部
          scrollMessagesToBottom();
        }
      }
    };

    // 添加消息到消息列表的方法
    const addMessage = (content, role) => {
      messages.value.push({ content, role });
    };

    // 滚动到消息列表底部的方法
    const scrollMessagesToBottom = () => {
      nextTick(() => {
        if (messagesContainer.value) {
          messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
        }
      });
    };

    // 在组件挂载后滚动到底部
    onMounted(() => {
      nextTick(() => {
        scrollMessagesToBottom();
      });
    });

    const options = [
      { value: 'poker', label: '扑克牌' },
      { value: 'sgs', label: '三国杀' },
      { value: 'games', label: '首页' },
      { value: 'user', label: '用户中心' },
    ];

    const selectedText = ref('首页'); // 默认显示首页

    const updateSelectedText = (path) => {
      const segments = path.split('/');
      const parentPath = segments.length > 2 ? segments[2] : 'games'; // 处理路径长度问题
      const option = options.find(opt => opt.value === parentPath);
      if (option) {
        selectedText.value = option.label;
      } else {
        selectedText.value = '首页'; // 如果匹配不到，默认显示首页
      }
    };

    // 在组件挂载时更新selectedText
    onMounted(() => {
      updateSelectedText(router.currentRoute.value.path);
    });

    // 监听路由变化并更新selectedText
    watch(() => router.currentRoute.value.path, (path) => {
      updateSelectedText(path);
    });

    // 返回给模板使用的响应式数据和方法
    return {
      drawer,
      selectedText,
      messages,
      inputMessage,
      sendMessage,
      messagesContainer,
      // 如果你需要在模板中调用其他方法或响应式数据，也在这里返回它们
    };
  },
};
</script>

<style scoped>
.layout-container-demo .header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: var(--el-color-primary-light-7);
  color: var(--el-text-color-primary);
  padding: 0 20px;
  font-size: 16px; /* 增大整体字体 */
}

.toolbar {
  display: flex;
  align-items: center;
}

.toolbar.left {
  justify-content: flex-start;
  flex: 1;
}

.toolbar.center {
  justify-content: center;
  flex: 1;
}

.toolbar.right {
  justify-content: flex-end;
  flex: 1;
}

.layout-container-demo .el-main {
  padding: 0;
}

.chat-container {
  display: flex;
  flex-direction: column;
  height: 100%;
}
.messages {
  flex: 1;
  overflow-y: auto;
  padding: 10px;
  background-color: #f9f9f9;
  border-radius: 10px;
  margin-bottom: 10px;
}
.message {
  padding: 8px;
  margin-bottom: 8px;
  border-radius: 5px;
  background-color: #e9e9e9;
}
.message.user {
  text-align: right;
  background-color: #e0f7fa;
  color: #006064;
}

.message.ai {
  text-align: left;
  background-color: #e9e9e9;
  color: #000;
}
.input-container {
  display: flex;
  align-items: center;
  padding: 10px;
  border-radius: 10px;
}

.chat-input {
  flex: 1;
  padding: 10px 15px;
  border: 1px solid #d1d5db;
  border-radius: 20px;
  font-size: 16px;
  margin-right: 10px;
  outline: none;
  transition: border-color 0.3s ease;
}

.chat-input:focus {
  border-color: #409eff; /* Element Plus 主色 */
}

.send-button {
  background-color: #409eff;
  border-radius: 20px;
  padding: 10px 20px;
  font-size: 16px;
  color: #fff;
}

.send-button:hover {
  background-color: #66b1ff; /* 更浅的蓝色 */
}

.send-button:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
}
</style>

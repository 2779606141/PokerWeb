<template>
  <div class="game-container">
    <h2>支持的游戏</h2>
    <el-row :gutter="20">
      <el-col v-for="game in games" :key="game.name" :span="6">
        <el-card shadow="hover" @click="goToGame(game.url)">
          <img :src="game.image" :alt="game.name" class="game-image" />
          <div class="game-info">
            <span>{{ game.name }}</span>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-pagination
        background
        layout="prev, pager, next"
        :total="total"
        :page-size="pageSize"
        @current-change="handlePageChange"
    />
  </div>
</template>

<script>
import axios from 'axios';
import { ElMessage} from 'element-plus';
import { API } from "../../../api.config.js";
import debounce from 'lodash/debounce';

const API_PATHS = {
  getGames: `${API.baseUrl}/getGames`,
  changeModel: `${API.baseUrl}/change-model`
};

export default {
  data() {
    return {
      games: [],
      total: 0,
      pageSize: 8,
      currentPage: 1,
    };
  },
  created() {
    this.fetchGames();
  },
  methods: {
    async fetchGames() {
      try {
        const response = await axios.get(API_PATHS.getGames, {
          params: {
            page: this.currentPage,
            pageSize: this.pageSize,
          },
        });
        this.games = response.data.games;
        this.total = response.data.total;
      } catch (error) {
        ElMessage.error('获取游戏列表失败');
        console.error('获取游戏列表失败', error);
      }
    },
    handlePageChange: debounce(function(page) {
      this.currentPage = page;
      this.fetchGames();
    }, 300),
    // async goToGame(url) {
    //   const loadingInstance = ElLoading.service({
    //     lock: true,
    //     text: '加载中',
    //     background: 'rgba(0, 0, 0, 0.7)',
    //   });
    //   try {
    //     const response = await axios.post(API_PATHS.changeModel, { name: url });
    //     console.log(response.data.message);
    //     ElMessage.success('模型切换成功');
    //     this.$router.push(url);
    //   } catch (error) {
    //     ElMessage.error('跳转失败');
    //     console.error('跳转失败', error);
    //   } finally {
    //     loadingInstance.close();
    //   }
    // },
    goToGame(url){
      this.$router.push(url);
    }
  },
};

</script>

<style>
.game-container {
  padding: 100px; /* 可以根据需要调整边距大小 */
}

.el-card {
  cursor: pointer;
}

.game-image {
  width: 100%;
}

.game-info {
  padding: 14px;
}

.el-pagination {
  display: flex;
  justify-content: center;
  margin-top: 20px; /* 根据需要调整上方间距 */
}
</style>

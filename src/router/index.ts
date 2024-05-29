import { createRouter, createWebHistory } from 'vue-router'
import PokerView from '../views/Home/PokerView.vue'
import HomeView from '../views/HomeView.vue'
import Pic from '@/views/Home/Poker/Pic.vue'
import Video from '@/views/Home/Poker/Video.vue'
import Realtime from '@/views/Home/Poker/Realtime.vue'
import SendFrame from '@/views/Home/Poker/SendFrame.vue'
import Game from '@/views/Home/Poker/DouDiZhu.vue'
import Login from '@/views/Login.vue'
import Register from '@/views/Register.vue'
import ForgetPassword from '@/views/ForgetPassword.vue'
import Pic_SGS from '@/views/Home/SGS/Pic.vue'
import Video_SGS from '@/views/Home/SGS/Video.vue'
import Realtime_SGS from '@/views/Home/SGS/Realtime.vue'
import SendFrame_SGS from '@/views/Home/SGS/SendFrame.vue'
import SGSView from "@/views/Home/SGSView.vue";
import ChangePassword from "@/views/Home/User/ChangePassword.vue";
import UserView from "@/views/Home/UserView.vue";
import UserInfo from "@/views/Home/User/UserInfo.vue";
import Cookies from "js-cookie";
import Games from "@/views/Home/Games.vue"

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      // redirect:'/home'
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/register',
      name: 'register',
      component: Register
    },
    {
      path: '/forget-password',
      name: 'forget-password',
      component: ForgetPassword
    },
    {
      path: '/home',
      name: 'home',
      component: HomeView,
      meta: { requiresAuth: true },
      children: [
        {
          path: '', // 子路由的路径为空，表示默认路由
          redirect: '/home/games' // 默认路由重定向到 '/home/pic'
        },
        {
          path: 'games',
          name: 'Games',
          component: Games,
        },
        {
          path: 'user',
          name: 'User',
          component: UserView,
          children:[
            {
              path: '', // 子路由的路径为空，表示默认路由
              redirect: '/home/user/info'
            },
            {
              path:'info',
              name:'Info',
              component:UserInfo
            },
            {
              path: 'change-password',
              name: 'ChangePassword',
              component: ChangePassword
            },
          ]        },
        {
          path: 'poker',
          name: 'poker',
          component: PokerView,
          children: [
            {
              path: '', // 子路由的路径为空，表示默认路由
              redirect: '/home/poker/pic' // 默认路由重定向到 '/home/pic'
            },
            {
              path: 'pic',
              name: 'Pic',
              component: Pic
            },
            {
              path: 'vid',
              name: 'Vid',
              component: Video
            },
            {
              path: 'game',
              name: 'Game',
              component: Game
            },
            {
              path: 'realtime',
              name: 'Realtime',
              component: Realtime
            },
            {
              path: 'frame',
              name: 'Frame',
              component: SendFrame
            },
          ]
        },
        {
          path: 'sgs',
          name: 'sgs',
          component: SGSView,
          // meta: { requiresAuth: true },
          children: [
            {
              path: '', // 子路由的路径为空，表示默认路由
              redirect: '/home/sgs/pic' // 默认路由重定向到 '/home/pic'
            },
            {
              path: 'pic',
              name: 'Pic_SGS',
              component: Pic_SGS
            },
            {
              path: 'vid',
              name: 'Vid_SGS',
              component: Video_SGS
            },
            {
              path: 'cam1',
              name: 'Cam1_SGS',
              component: Realtime_SGS
            },
            {
              path: 'cam2',
              name: 'Cam2_SGS',
              component: SendFrame_SGS
            },
          ]
        }
      ]
    },

    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue')
    }
    // {
    //   path: '*',
    //   name:'Cam2',
    //   component:Camera2
    // }
  ]
})

// 设置全局前置守卫
router.beforeEach((to, from, next) => {
  // 检查目标路由是否需要认证
  if (to.meta.requiresAuth) {
    // 如果需要认证，则检查用户是否已经登录
    const isAuthenticated = !!Cookies.get('token'); /* 根据你的认证逻辑判断用户是否已登录 */
    if (isAuthenticated) {
      // 如果已经登录，则允许访问目标路由
      next()
    } else {
      // 如果未登录，则重定向到登录页面
      next('/login')
    }
  } else {
    // 如果不需要认证，则直接允许访问目标路由
    next()
  }
})
export default router

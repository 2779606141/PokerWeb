import { createRouter, createWebHistory } from 'vue-router'
import PokerView from '../views/PokerView.vue'
import HomeView from '../views/HomeView.vue'
import Pic from '@/views/Poker/Pic.vue'
import Video from '@/views/Poker/Video.vue'
import Jipaiqi from '@/views/Poker/Jipaiqi.vue'
import Realtime from '@/views/Poker/Realtime.vue'
import SendFrame from '@/views/Poker/SendFrame.vue'
import JipaiqiPlus from '@/views/Poker/JipaiqiPlus.vue'
import Login from '@/views/Login.vue'
import Register from '@/views/Register.vue'
import ForgetPassword from '@/views/ForgetPassword.vue'
import User from '@/views/Poker/User.vue'

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
      children: [
        {
          path: '', // 子路由的路径为空，表示默认路由
          redirect: '/home/poker/pic' // 默认路由重定向到 '/home/pic'
        },
        {
          path: 'user',
          name: 'User',
          component: User
        },
        {
          path: 'poker',
          name: 'poker',
          component: PokerView,
          // meta: { requiresAuth: true },
          children: [
            {
              path: '', // 子路由的路径为空，表示默认路由
              redirect: '/home/poker/pic' // 默认路由重定向到 '/home/pic'
            },
            {
              path: 'pic', // 子路由的完整路径为 '/home/pic'
              name: 'Pic',
              component: Pic
            },
            {
              path: 'vid',
              name: 'Vid',
              component: Video
            },
            {
              path: 'cam',
              name: 'Cam',
              component: Jipaiqi
            },
            {
              path: 'cam1',
              name: 'Cam1',
              component: Realtime
            },
            {
              path: 'cam2',
              name: 'Cam2',
              component: SendFrame
            },
            {
              path: 'testcam',
              name: 'Testcam',
              component: JipaiqiPlus
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
    const isAuthenticated = !!localStorage.getItem('token') /* 根据你的认证逻辑判断用户是否已登录 */
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

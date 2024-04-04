import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Pic from '../views/Home/Pic.vue';
import Video from "../views/Home/Video.vue"
import Camera from "@/views/Home/Camera.vue";
import Camera1 from "@/views/Home/Camera1.vue";
import Camera2 from "@/views/Home/Camera2.vue";


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path:'/',
      redirect:'/home'
    },
    {
      path: '/home',
      name: 'home',
      component: HomeView,
      children: [
        {
          path: '', // 子路由的路径为空，表示默认路由
          redirect: '/home/cam' // 默认路由重定向到 '/home/pic'
        },
        {
          path: 'pic', // 子路由的完整路径为 '/home/pic'
          name: 'Pic',
          component: Pic
        },
        {
          path:'vid',
          name:'Vid',
          component:Video
        },
        {
          path:'cam',
          name:'Cam',
          component:Camera
        },
        {
          path:'cam1',
          name:'Cam1',
          component:Camera1
        },
        {
          path:'cam2',
          name:'Cam2',
          component:Camera2
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
  ]
})

export default router

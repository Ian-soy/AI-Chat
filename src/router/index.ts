
import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  { 
    path: '/',
    redirect: "/homesearch",
    children: [
      {
        path: "homesearch",
        component: () => import("../views/search/index.vue"),
        name: "homesearch",
        meta: {
          title: "搜索",
          affix: true
        }
      }
    ]
  },
]

export const router = createRouter({
  history: createWebHashHistory(),
  routes
})

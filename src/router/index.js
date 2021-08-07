import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import MainPage from '@/views/MainPage'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Munich Criminal Rate',
      component: MainPage
    }
  ]
})

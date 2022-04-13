import { createRouter, createWebHashHistory } from 'vue-router';
import Home from '/@/views/home/index.vue';
import Setting from '/@/views/setting/index.vue';
import Layout from '/@/layout/index.vue';
import ApiDocument from '/@/views/apiDocument/index.vue';

const routes = [
  {
    path: '/',
    component: Layout,
    redirect: '/home',
    children: [
      { path: 'home', name: 'home', component: Home },
      { path: 'setting', name: 'setting', component: Setting },
      { path: 'apiDocument', name: 'apiDocument', component: ApiDocument },
    ],
    meta: {
      index: 0,
    },
  },
];

export default createRouter({
  routes,
  history: createWebHashHistory(),
});

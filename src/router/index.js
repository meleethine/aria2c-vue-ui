import Vue from "vue";
import VueRouter from "vue-router";
import Downloading from "../views/Downloading.vue";

Vue.use(VueRouter);

const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}


const routes = [
  {
    path: "/",
    name: "Downloading",
    component: Downloading,
    meta: {
      keepAlive: true,
      isTab: false,
      isAuth: false
    },
  },
  {
    path: '/task/:gid',
    name: 'TaskDetail',
    component: () => import('../views/TaskDetail.vue'),
    meta: {
      keepAlive: true,
      isTab: false,
      isAuth: false
    },
  },
  {
    path: "/completed",
    name: "Completed",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/Completed.vue"),
      meta: {
        keepAlive: true,
        isTab: false,
        isAuth: false
      },
  },
  {
    path: "/settings",
    name: "Settings",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/Settings.vue"),
      meta: {
        keepAlive: true,
        isTab: false,
        isAuth: false
      },
  },
  {
    path: "/servers",
    name: "Servers",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/Servers.vue"),
      meta: {
        keepAlive: true,
        isTab: false,
        isAuth: false
      },
  },
];

const router = new VueRouter({
  mode:'history',
  routes,
});

export default router;

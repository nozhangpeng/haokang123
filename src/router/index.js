import Vue from "vue";
import VueRouter from "vue-router";
import Home from "@views/Home.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "home",
    component: Home,
    redirect: "/sectioncontrol"
  },
  {
    path: "/sectioncontrol",
    name: "sectioncontrol",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "@views/SectionControl.vue")
  },
  {
    path: "/processcontrol",
    name: "processcontrol",
    component: () =>
      import(/* webpackChunkName: "about" */ "@views/ProcessControl.vue")
  }
];

const router = new VueRouter({
  routes
});

export default router;

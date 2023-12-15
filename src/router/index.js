import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import RegisterView from "@/views/RegisterView.vue";
import EditionView from "@/views/EditionView.vue";
import PersonView from "@/views/PersonView.vue";
import RessourcesView from "@/views/RessourcesView.vue";
import PersonDataView from "@/views/PersonDataView.vue";
import RangeRegisterPrototype from "@/views/RangeRegisterPrototype.vue";
import FacSimileView from "@/views/FacSimileView.vue";

const rootURL = `${process.env.VUE_APP_APP_ROOT_URL}`

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/registres',
    name: 'registres',
    component: RegisterView
  },
  {
    path: '/edition/:id',
    name: 'edition',
    component:EditionView,
  },
  {
    path: '/persons',
    name: 'persons',
    component:PersonView,
  },
  {
    path:'/persons/person/:id',
    name: 'person',
    component: PersonDataView
    },
  {
    path: '/ressources',
    name: 'ressources',
    component: RessourcesView,
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  },
  {
    path:'/prototype-range',
    name: 'prototype-range',
    component: RangeRegisterPrototype,
  },
    {
      path: '/facsimile/:register/:canvas',
      name: 'facsimile',
      component: FacSimileView,
    },
]

const router = createRouter({
  history: createWebHistory(rootURL),
  linkActiveClass: 'is-active',
  routes
})

export default router

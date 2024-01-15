import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import PersonView from "@/views/PersonView.vue";
import RessourcesView from "@/views/RessourcesView.vue";
import PersonDataView from "@/views/PersonDataView.vue";
import RangeRegisterPrototype from "@/views/RegistersView.vue";
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
    component: RangeRegisterPrototype
  },
  {
    path: '/persons',
    name: 'persons',
    component:PersonView,
  },
  {
    path:'/persons/:id',
    name: 'person',
    component: PersonDataView
    },
  {
    path: '/ressources',
    name: 'ressources',
    component: RessourcesView,
  },
    {
      path: '/facsimile',
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

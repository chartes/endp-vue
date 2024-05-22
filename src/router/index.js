import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import PersonView from "@/views/PersonView.vue";
import RessourcesView from "@/views/RessourcesView.vue";
import PersonDataView from "@/views/PersonDataView.vue";
import RangeRegisterPrototype from "@/views/RegisterView.vue";
import FacSimileView from "@/views/FacSimileView.vue";
import ContactView from "@/views/ContactView.vue";
import AboutView from "@/views/AboutView.vue";
import TermsOfServiceView from "@/views/TermsOfServiceView.vue";
import NotFoundPage from "@/views/NotFoundPage.vue";

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
      path: '/facsimile/:volumeIndex/:canvasIndex',
      params: true,
      name: 'facsimile',
      component: FacSimileView,
    },
  {
    path:'/contact',
    name: 'contact',
    component: ContactView,
  },
  {
    path:'/about',
    name: 'about',
    component: AboutView,
  },
  {
    path:'/termsofservice',
    name: 'termsofservice',
    component: TermsOfServiceView
  },
  {
    path: '/:pathMatch(.*)*',
    component: NotFoundPage
  }

]

const router = createRouter({
  history: createWebHistory(rootURL),
  linkActiveClass: 'is-active',
  routes
})

export default router
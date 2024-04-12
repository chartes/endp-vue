<template>
  <div class="app-content">
    <div class="column is-align-items-center app-sidebar__menu">
      <AppNavBar/>
      <AppMenuAside :class="{ 'is-opened': isMobileMenuOpen, 'is-home': isHome }" />
      <BurgerButton @click="toggleMobileMenu($event)" class="burger-button" :class="{ 'is-opened': isMobileMenuOpen }" />
    </div>
    <div class="column is-full app-main-content__area">
      <router-view/>
    </div>
  </div>
  <AppFooter/>
</template>

<script setup>
import {computed, ref, watch} from "vue";
import {useRoute} from "vue-router";
import AppNavBar from "@/components/AppNavbar.vue";
import AppMenuAside from "@/components/AppMenuAside.vue";
import AppFooter from "@/components/AppFooter.vue";
import BurgerButton from "@/components/BurgerButton.vue";

let isMobileMenuOpen = ref(false)

const toggleMobileMenu = function($event) {
  $event.preventDefault();
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
}

const route = useRoute();
watch(route, (nextRoute, previousRoute) => {
  isMobileMenuOpen.value = false;
  console.log(nextRoute.name, previousRoute.name);
  if (nextRoute.name !== "facsimile" || previousRoute.name !== "facsimile") {
    window.scrollTo(0,0);
  }
});

const isHome = computed(() => {
  return route.name === "home";
});

</script>

<style>
html,
body,
.app-main-content__area,
.app-sidebar__menu {
  width: 100%;
}

.column.app-sidebar__menu {
  height: 50px;
}

.app-main-content__area {
  min-height: 50px;
}

.app-main-content__area {
  min-height: 100vh;
  padding: 0;
}

.column.app-sidebar__menu {
}

.column.app-sidebar__menu {
  display: flex;
  padding: 0 var(--desktop-side-padding);
  background-color: var(--brown);
}

body {
  background-color: #ffffff;
}

.burger-button {
  display: none;
}


@media (max-width: 1380px) {
  .column.app-sidebar__menu {
    padding: 0 var(--tablet-side-padding);
  }
}

@media screen and (max-width: 1024px) {

  .column.app-sidebar__menu {
    position: sticky;
    top: 0;
    z-index: 100;
  }

  .burger-button {
    position: absolute;
    top: 13px;
    right: 20px;
    display: inline-block;
  }
}

</style>
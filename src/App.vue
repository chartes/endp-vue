<template>
  <div class="columns">
    <div class="column is-2 app-sidebar__menu">
      <AppNavBar/>
      <AppMenuAside/>
    </div>
    <div class="column is-full app-main-content__area">
      <router-view/>
    </div>
  </div>
  <!--<AppFooter/>-->
</template>

<script setup>
import AppNavBar from "@/components/AppNavbar.vue";
import AppMenuAside from "@/components/AppMenuAside.vue";
//import AppFooter from "@/components/AppFooter.vue";
</script>

<style>
html,
body,
.app-main-content__area,
.app-sidebar__menu {
  height: 100vh;
  width: 100%;
  font: 16px/24px Georgia, "Bitstream Vera Serif", Times, serif;
}

body {
  background-color: #ffffff;
}
</style>
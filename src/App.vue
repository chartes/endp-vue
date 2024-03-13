<template>
  <div class="app-content">
    <div class="column is-align-items-center app-sidebar__menu">
      <AppNavBar/>
      <AppMenuAside/>
    </div>
    <div class="column is-full app-main-content__area">
      <router-view/>
    </div>
  </div>
  <AppFooter/>
</template>

<script setup>
import AppNavBar from "@/components/AppNavbar.vue";
import AppMenuAside from "@/components/AppMenuAside.vue";
import AppFooter from "@/components/AppFooter.vue";
</script>

<style>
html,
body,
.app-main-content__area,
.app-sidebar__menu {
  width: 100%;
}

.app-main-content__area,
.column.app-sidebar__menu {
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
  padding: 0 calc(50% - 640px);
  background-color: var(--brown);
}

body {
  background-color: #ffffff;
}

@media (max-width: 1320px) {
  .column.app-sidebar__menu {
    padding: 0 20px;
  }
}

</style>
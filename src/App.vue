<template>
  <div class="columns">
    <!-- sidebar menu -->
    <div class="column is-2 sidebar__menu">
      <app-menu-aside />
    </div>
    <!-- main content area -->
    <div class="column is-full main__content__area">
      <router-view/>
    </div>
  </div>
</template>

<script setup>
import AppMenuAside from "@/components/MenuAside.vue";
</script>

<style>
html,
body,
.main__content__area,
.sidebar__menu {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100%;
  width: 100%;
  font: 16px/24px Georgia, "Bitstream Vera Serif", Times, serif;
}

body {
  background-color: #ffffff;
}

</style>
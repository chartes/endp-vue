<template>

  <!-- main content -->
  <div class="columns">
    <!-- sidebar menu -->
    <div class="column is-2">
      <app-menu-aside class="sidebar__menu"/>
    </div>
    <!-- main content area -->
    <div class="column is-full">
      <router-view/>
    </div>
  </div>
</template>

<style>
html,
body,
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100%;
  width: 100%;
}

body {
  background-color: #ffffff;
}

</style>
<script setup>
import AppMenuAside from "@/components/MenuAside.vue";
</script>
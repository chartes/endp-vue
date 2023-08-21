<template>
  <app-nav-bar/>
  <div class="columns">
    <div class="column is-2">
      <app-menu-aside/>
    </div>
    <div class="column">
      <div class="container">
        <div class="section">
          <router-view/>
        </div>
      </div>
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
}

#app {
  min-height: 100%;
}

body {
  background-color: #ffffff;
}


</style>
<script setup>
import AppNavBar from "@/components/Navbar.vue";
import AppMenuAside from "@/components/MenuAside.vue";
</script>
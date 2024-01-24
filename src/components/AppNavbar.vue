<template>
  <nav class="navbar has-shadow is-fixed-top app-navbar" role="navigation" aria-label="main navigation">
    <div class="navbar-brand">
      <a class="navbar-item app-navbar__item">
        <router-link to="/"><img src="@/assets/logo_endp.png" class="app-navbar__logo"></router-link>
      </a>
    </div>
  </nav>
</template>

<script>
export default {
  name: "AppNavBar",
}
</script>

<style scoped>
.app-navbar {
  background-color: #fff;
  border-bottom: 1px solid #dbdbdb;
  box-shadow: 0 2px 4px rgba(0, 0, 0, .1);
  z-index: 50;
  position: relative;
  min-height: 50px;
  border-radius: 0px 0px 10px 0px;
}

.app-navbar__item img {
  max-height: 100%; /* Assurer que le logo ne dépasse pas la hauteur de la navbar */
  max-width: 100%; /* Pour conserver les proportions du logo */
}

.app-navbar__logo {
  width: 80px;
  height: 100px;
  margin-right: 1em;
}
</style>
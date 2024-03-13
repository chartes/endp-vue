<template>
  <nav class="navbar is-fixed-top app-navbar" role="navigation" aria-label="main navigation">
    <div class="navbar-brand">
      <div class="navbar-item app-navbar__item">
        <router-link to="/">
          <img src="@/assets/images/head_logo.svg" class="app-navbar__logo">
        </router-link>
      </div>
      <div class="navbar-item app-navbar__item">
        <router-link to="/">
          <span class="e-endp-logo">e</span><span class="endp-logo">NDP</span>
        </router-link>
      </div>
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
  display: inline-block;
  position: relative;
  background: none;
}

.app-navbar__item {
  background: none !important;
  padding: 0;

  font-family: var(--font-endp);
  font-size: 38px;
  font-weight: 400;
  line-height: 1;
}

.app-navbar__item a {
  color: #FFFFFF;
}

.app-navbar__item:not(:last-child) {
  margin-right: 65px;
}

.app-navbar__item img {
  max-height: 100%; /* Assurer que le logo ne dépasse pas la hauteur de la navbar */
  max-width: 100%; /* Pour conserver les proportions du logo */
}

.app-navbar__logo {
  height: 40px;
  width: auto;
  margin: 5px auto 0;
}

</style>
<template>
  <nav class="navbar has-shadow is-fixed-top" role="navigation" aria-label="main navigation">
    <div class="navbar-brand">
      <a class="navbar-item">
        <router-link to="/"><img src="@/assets/logo_endp.png" class="logo__endp"></router-link>
      </a>
    </div>
  </nav>
</template>

<script>

export default {
  name: "AppNavBar",
  props() {
    return {
      isMenuOpen: false
    }
  },
  methods: {
    toggleMenu() {
      this.$emit("toggle-menu");
    }
  }
}
</script>

<style scoped>
.navbar {
  background-color: #fff;
  border-bottom: 1px solid #dbdbdb;
  box-shadow: 0 2px 4px rgba(0,0,0,.1);
  z-index: 50;
  position: relative;
  min-height: 50px;
  border-radius: 0px 0px 10px 0px;
}

.navbar-item img {
  max-height: 100%; /* Assurer que le logo ne dépasse pas la hauteur de la navbar */
  max-width: 100%; /* Pour conserver les proportions du logo */
}

.logo__endp {
  width: 80px;
  height: 100px;
  margin-right: 1em;
}
</style>
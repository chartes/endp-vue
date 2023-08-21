<template>
  <nav class="navbar has-shadow is-fixed-top" role="navigation" aria-label="main navigation">
    <div class="navbar-brand">
      <a class="navbar-item">
        <router-link to="/"><span class="icon"><i class="fa fa-home"></i></span> e-NDP</router-link>
      </a>
    </div>
  </nav>
</template>

<script>

export default {
  name: "AppNavBar",
  data() {
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
</style>
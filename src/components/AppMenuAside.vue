<template>
  <aside class="menu">
    <ul class="menu-list has-text-left">
      <li>
        <router-link class="nav-link active" to="/registres"><span class="icon"><i class="fa fa-book"></i></span>
          Registres
        </router-link>
        <ul class="">
          <li>
            <a @click="navigateToFacSimile">
              <span class="icon is-small"><i class="fa fa-list"></i></span> Fac-similés
            </a>
            <a href="#">
              <span class="icon is-small"><i class="fa fa-list"></i></span> Éditions
            </a>
            <a href="https://nosketch-engine.lamop.fr/#dashboard?corpname=endp" target="_blank">
              <span class="icon is-small"><i class="fa fa-list"></i></span> No Sketch
            </a>
          </li>
        </ul>
      </li>
      <li>
        <router-link class="nav-link active" to="/persons"><span class="icon"><i class="fa fa-user"></i></span>
          Personnes
        </router-link>
      </li>
      <li>
        <router-link class="nav-link active" to="/ressources"><span class="icon"><i class="fa fa-link"></i></span>
          Ressources
        </router-link>
      </li>
      <li>
        <router-link class="nav-link active" to="/contact"><span class="icon"><i class="fa fa-envelope"></i></span>
          Contact
        </router-link>
      </li>
    </ul>
  </aside>
</template>

<script>
export default {
  name: "AppMenuAside",
  data() {
    return {
      dbAdminPath: process.env.VUE_APP_DB_ADMIN
    };
  },
  methods: {
    /**
     * Navigate to fac-simile and set the default canvas id to the first canvas id of the volume
     */
    navigateToFacSimile() {
      this.$store.commit('setEndpVolume', "collection");
      this.$store.commit('setCanvasId', "top");
      this.$router.push('/facsimile/collection/top');
    },
  },
}
</script>

<style scoped>
.menu {
  margin-bottom: 1rem;
  padding: 0.2rem;
  background-color: #f5f5f5;
  border-radius: 5px;
}

.menu-list {
  padding: 0.2rem;
}

.menu-list li {
  padding: 0.2rem;
  cursor: pointer;
}
</style>
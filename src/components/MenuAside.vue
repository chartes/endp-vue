<template>
  <aside class="section is-fullheight">
    <br>
    <p class="menu-label is-hidden-touch">Navigation</p>
    <ul class="menu-list has-text-left">
      <li>

        <router-link class="nav-link active" to="/prototype-range"><span class="icon"><i class="fa fa-book"></i></span> Registres</router-link>
        <ul class="">
          <li>
            <router-link :to="`/facsimile/0/0`">
              <span class="icon is-small"><i class="fa fa-list"></i></span> fac-similés
            </router-link>
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
        <router-link class="nav-link active" to="/persons"><span class="icon"><i class="fa fa-user"></i></span> Personnes</router-link>
      </li>
      <li>
        <router-link class="nav-link active" to="/ressources"><span class="icon"><i class="fa fa-link"></i></span> ressources</router-link>
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
}

</script>

<style scoped>
aside {
  position: fixed;
  height: 100vh;
}
</style>
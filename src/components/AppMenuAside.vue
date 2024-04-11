<template>
  <aside class="menu is-flex is-align-items-center is-justify-content-center m-0">
    <ul class="menu-list is-flex has-text-left">
      <li>
        <router-link class="nav-link active" to="/registres"><span class="icon"><i class="fa fa-book"></i></span>
          Registres
        </router-link>
        <ul class="submenu">
          <li>
            <a @click="navigateToFacSimile">
              <span class="icon is-small"><i class="fa fa-list"></i></span> Fac-similés
            </a>
          </li>
          <!--<li>
            <a href="#">
              <span class="icon is-small"><i class="fa fa-list"></i></span> Éditions
            </a>
          </li>-->
          <li>
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
      <!--
      <li>
        <router-link class="nav-link active" to="/contact"><span class="icon"><i class="fa fa-envelope"></i></span>
          Contact
        </router-link>
      </li>-->
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
  width: 100%;
  margin-bottom: 1rem;
  padding: 0.2rem;
}

.menu-list {
  padding: 0.2rem;
}

.menu-list li {
  position: relative;
  cursor: pointer;
}

.menu-list > li > ul.submenu a:hover {
  text-decoration: underline;
}

.menu-list > li > ul.submenu {
  position: absolute;
  left: 38px;
  top: 50px;
  z-index: 10;
  transform: translateX(-50%);

  width: 220px;
  margin: 0;
  padding: 0;
  border: none;
  background-color: #5F070CD9;

  visibility: hidden;
  opacity: 0;
  transition: opacity ease-in-out 0.25s;
}

.menu-list > li:hover > ul.submenu {
  visibility: visible;
  opacity: 1;
}

.menu-list li > ul > li:not(:last-child) {
  border-bottom: solid 1px #A53605;
}

.menu-list li > ul > li > a {
  display: block;
  padding: 20px 65px;
  font-size: 18px;
  color: #FFFFFF;
  text-align: center;
  text-transform: none;
  white-space: nowrap;
}

.menu-list a {
  position: relative;

  display: inline-block;
  padding: 0;

  font-family: var(--font-secondary);
  font-size: 18px;
  font-weight: 400;
  line-height: 50px;
  color: #FFFFFF;

  text-align: center;
  vertical-align: top;
  text-transform: uppercase;
  letter-spacing: 0;
}

.menu-list a.is-active {
  background: transparent;
  font-weight: 600;
}

.menu-list > li > a:hover::after,
.menu-list a.is-active::after {
  content: "";

  position: absolute;
  bottom: -2px;
  left: 0;
  z-index: 3;

  display: inline-block;
  width: 100%;
  border-bottom: 4px solid #D74A52;
  pointer-events: none;
}

ul.menu-list > li:not(:last-child)::after {
  content: "";
  display: inline-block;
  width: 1px;
  height: 27px;
  border-right: solid #ffffff 1px;
  margin: 12px 20px 0;
  box-sizing: border-box;
}

.menu-list a span.icon {
  display: none;
}

.menu-list a:hover {
  background: transparent;
}

@media screen and (max-width: 1024px) {

  .menu {
    position: absolute;
    z-index: 2;
    top: 100px;
    left: 5%;
    width: 90%;
    margin: 0 auto;
    background-color: #4B080BF2;
  }

  .menu.is-home {
    top: 50px;
  }


  .menu.is-flex {
    display: none !important;
  }

  .menu.is-flex.is-opened {
    display: flex !important;
  }

  .menu > ul {
    flex-direction: column;
    align-items: center;
    width: 100%;
  }

  .menu-list > li > ul.submenu {
    position: unset;
    width: 100%;
    padding: 15px 0 25px;
    transform: none;
    visibility: visible;
    background: none;
    opacity: 1;
    transition: none;
  }

  .menu-list > li {
    padding: 10px 0;
  }

  .menu-list > li,
  .menu-list > li > a,
  .menu-list > li > ul.submenu > li {
    width: 100%;
  }

  .menu-list li > ul > li > a,
  .menu-list > li > a {
    font-size: 22px;
  }

  .menu-list li > ul > li > a {
    padding: 0;
  }

  ul.menu-list > li:not(:last-child)::after {
    display: none;
  }

  .menu-list > li:not(:last-child) {
    border-bottom: solid 1px #A53605;
  }


  .menu-list li > ul > li:not(:last-child) {
    border-bottom: none;
  }

  .menu-list > li > a:hover::after,
  .menu-list a.is-active::after {
    border: none;
  }

}


</style>
<template>
  <nav class="fac-simile__toc">
    <h1 class="main__title__toc">Table des registres capitulaires</h1>
    <ul>
      <li v-for="(years, register) in this.navByVolumesJSON" :key="register" class="register">
        <b @click="toggleRegister(register)">
          <span class="register_name">{{ register }}</span>
          <span class="chevron" :class="{ 'open': openRegisters[register]?.isOpen }">&#9660;</span>
        </b>
        <template v-if="openRegisters[register]?.isOpen">
          <ul v-for="(months, year) in years" :key="year" class="year">
            <li @click="toggleYear(register, year)">
              <span class="year_name">{{ formatYearNav(year) }}</span>
              <span class="chevron" :class="{ 'open': openRegisters[register]?.[year] }">&#9660;</span>
            </li>
            <ul v-if="openRegisters[register]?.[year]" class="month">
              <li v-for="month in months" :key="month">
                <a @click="updateMirador(register, month.canvasID)">
                  <span class="month_name">{{ month.month }}</span>
                </a>
              </li>
            </ul>
          </ul>
        </template>
      </li>
    </ul>
  </nav>
</template>

<script>
import {mapState} from "vuex";

export default {
  name: "FacSimileNav",
  data() {
    return {
      openRegisters: {},
    };
  },
  computed: {
    ...mapState(["navByVolumesJSON"]),
  },
  methods: {
    /**
     * Formats the year to display in the navigation
     * @param year
     * @returns {string}
     */
    formatYearNav: function (year) {
      return year.split('_')[0];
    },

    /**
     * Triggers the opening/closing of a register
     * @param register
     * @returns {boolean}
     */
    toggleRegister: function (register) {
      this.openRegisters[register] = this.openRegisters[register]
          ? {isOpen: !this.openRegisters[register].isOpen}
          : {isOpen: true};
    },

    /**
     * Triggers the opening/closing of a year
     * @param register
     * @param year
     * @returns {boolean}
     */
    toggleYear: function (register, year) {
      if (!this.openRegisters[register]) {
        this.openRegisters[register] = {isOpen: true, [year]: true};
      } else {
        this.openRegisters[register][year] = this.openRegisters[register][year] ? !this.openRegisters[register][year] : true;
      }
    },

    /**
     * Emits an event to update image in Mirador instance
     * when a month is clicked
     * @param register
     * @param canvasID
     */
    updateMirador: function (register, canvasID) {
      this.$emit('updateMirador', canvasID, register);
    },
  },
};
</script>

<style scoped>
.fac-simile__toc {
  max-height: 100vh;
  overflow-y: scroll;
  padding: 0.5em;
  border: 2px solid #8d1919;
  border-radius: 4px;
  background-color: #f5f5f5;
}

.main__title__toc {
  font-size: 1.4em;
  font-weight: bold;
  margin-bottom: 1em;
  display: block;
  text-align: center;
}

.register:hover {
  cursor: pointer;
}

.register_name, .year_name, .month_name {
  display: inline-block;
  padding: 0.2em 0.5em;
  margin: 0.2em 0;
  font-size: 1.1em;
}

.register_name:hover, .year_name:hover, .month_name:hover {
  background-color: #d4d3d1;
  border-radius: 4px;
}

.chevron {
  display: inline-block;
  transition: transform 0.3s;
  transform: rotate(-90deg);
}

.chevron.open {
  transform: rotate(0deg);
}

.month_name {
  text-transform: capitalize;
}

nav li {
  text-align: left;
}

nav header {
  display: block;
  padding: 1px 1ex;
  margin-bottom: 1ex;
  margin-top: 1ex;
  font-weight: bold;
  font-size: 120%;
  border: 1px #FFF solid;
  border-right: none;
  line-height: 110%;
}

nav menu, nav ul {
  margin-left: 1em;
  padding-left: 0;
}
</style>
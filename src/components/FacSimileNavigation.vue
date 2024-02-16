<template>
  <nav class="fac-simile__toc">
    <h1 class="main__title__toc">Table des registres capitulaires</h1>
    <ul>
      <li v-for="(years, register) in this.navByVolumesJSON" :key="register" class="register">
        <b @click="toggleRegister(register)" :class="{ 'is-highlighted': openRegisters[register]?.isOpen }">
          <span class="register_name" :class="{ 'span-is-highlighted': openRegisters[register]?.isOpen }">{{
              register
            }}</span>
          <!--<span class="chevron" :class="{ 'open': openRegisters[register]?.isOpen }">&#9660;</span>-->
        </b>
        <template v-if="openRegisters[register]?.isOpen">
          <ul v-for="(months, year) in years" :key="year" class="year">
            <li @click="toggleYear(register, year)" :class="{ 'is-highlighted': openRegisters[register]?.[year] }">
              <span class="year_name"
                    :class="{ 'span-is-highlighted': openRegisters[register]?.[year] }">{{ formatYearNav(year) }}</span>
              <!--<span class="chevron" :class="{ 'open': openRegisters[register]?.[year] }">&#9660;</span>-->
            </li>
            <ul v-if="openRegisters[register]?.[year]" class="month">
              <li v-for="month in months" :key="month">
                <a @click="updateMirador(register, year, month.canvasID)"
                   :class="{ 'is-highlighted': isHighlighted(register, month.canvasID) }">
                  <span class="month_name" :class="{ 'span-is-highlighted': isHighlighted(register, month.canvasID) }">{{
                      month.month
                    }}</span>
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
  props: {
    selectedNav: {
      type: Object,
      default: () => ({
        register: null,
        year: null,
        canvasID: null,
      }),
    },
  },
  data() {
    return {
      openRegisters: {},
      navItemsSelected: {},
      highlighted: null, // Ajout pour suivre l'élément mis en surbrillance
    };
  },
  computed: {
    ...mapState(["navByVolumesJSON"]),
  },
  watch: {
    selectedNav(newVal) {
      if (newVal) {
        //console.log('selectedNav.canvasID changed', newVal);
        this.highlightAndUnfoldSelectedNav();
      }
    },
  },
  methods: {

    highlightAndUnfoldSelectedNav() {
      const {register, canvas, year} = this.selectedNav;
      if (!register || !canvas || !year) return;

      // close all years except the one clicked
      for (let key in this.openRegisters[register]) {
        if (key !== year) {
          this.openRegisters[register][key] = false;
        }
      }

      // Assurer que le registre et l'année sont ouverts
      this.ensureOpenRegisterAndYear(register, year.split(' ')[1]);

      // Trouver le mois correspondant au canvasID et l'ouvrir
      this.findAndHighlightMonth(register, canvas);
    },

    ensureOpenRegisterAndYear(register, year) {

      // rewrite without $set
      this.openRegisters[register] = {...this.openRegisters[register], isOpen: true};
      this.openRegisters[register][year] = true;
    },

    findAndHighlightMonth(register, canvasID) {
      let found = false;

      for (const [regKey, years] of Object.entries(this.navByVolumesJSON)) {
        if (regKey === register) {
          for (const [yearKey, months] of Object.entries(years)) {
            for (const month of months) {
              if (month.canvasID === canvasID) {
                this.highlightItem(register, canvasID);
                this.openRegisters[register][yearKey] = true;
                found = true;
                break;
              }
            }
            if (found) break;
          }
        }
        if (found) break;
      }

      if (!found) {
        // Si on ne trouve pas exactement, on cherche le canvas le plus proche inférieur
        this.findClosestMonth(register, canvasID);
      }
    },

    findClosestMonth(register, canvasID) {
      let closest = null;
      let closestDiff = Infinity;

      for (const years of Object.values(this.navByVolumesJSON[register])) {
        for (const month of years) {
          let diff = canvasID - month.canvasID;
          if (diff >= 0 && diff < closestDiff) {
            closest = month;
            closestDiff = diff;
          }
        }
      }

      if (closest) {
        this.highlightItem(register, closest.canvasID);
        // Assurez-vous que le bon mois et année sont ouverts
        for (const [yearKey, months] of Object.entries(this.navByVolumesJSON[register])) {
          if (months.includes(closest)) {
            this.openRegisters[register][yearKey] = true;
            break;
          }
        }
      }
    },

    highlightItem(register, canvasID) {
      this.highlighted = {register, canvasID};
    },


    isHighlighted(register, canvasID) {
      return this.highlighted && this.highlighted.register === register && this.highlighted.canvasID === canvasID;
    },

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
      // close all registers except the one clicked
      for (let key in this.openRegisters) {
        if (key !== register) {
          this.openRegisters[key].isOpen = false;
        }
      }
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
     * @param year
     * @param canvasID
     */
    updateMirador: function (register, year, canvasID) {
      this.$emit('updateMirador', canvasID, register);
    },
  },
};
</script>

<style scoped>

.register {
  display: flex;
  flex-direction: column;
  margin-bottom: 0.5em;
}

.is-highlighted {
  background-color: #cccccc; /* ou toute autre couleur de mise en surbrillance */
  /* prendre  toute la largeur */
  width: 100%;
  /* prendre toute la hauteur */
  height: 100%;
  border-radius: 4px;
  flex-grow: 1;
  position: relative;
  font-weight: bold;
}

.is-highlighted:before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  background-color: #8d1919;
  border-radius: 4px;
}

.month li {
  display: flex;
  width: 100%;
}

.month li a {
  flex-grow: 1;
  padding: 0.2em;
  border-radius: 4px;
  margin: 0.2em;
  text-decoration: none;
  color: #000000;
}

.year li {
  display: flex;
  width: 100%;
  margin: 0.5em 0;
}


.span-is-highlighted {
  color: #8d1919 !important;
}


.fac-simile__toc {
  max-height: 100vh;
  overflow-y: scroll;
  padding: 0.5em;
  border: 2px solid #8d1919;
  border-radius: 4px;
  background-color: #ffffff;
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
  margin: 0.2em 0.1em;
  font-size: 1.1em;
  border-radius: 4px;
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
  color: #000f0d;
}

nav li {
  text-align: left;
  list-style: none;
  margin: 0;
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
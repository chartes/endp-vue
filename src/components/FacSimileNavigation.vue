<template>
  <nav class="fac-simile__toc" :class="{ 'is-opened': metadataCardState }">
    <h1 class="main__title__toc" @click="toggleCard()">
      Table des registres capitulaires
      <button class="card-header-toggle" />
    </h1>
    <ul>
      <li v-for="(years, register) in this.navByVolumesJSON" :key="register" class="register">
        <b @click="toggleRegister(register);updateMirador(register,0,0)" :class="{ 'is-highlighted': openRegisters[register]?.isOpen }">
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
      metadataCardState: false,
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

    /**
     * Toggle the metadata cards state
     * @returns {boolean}
     */
    toggleCard() {
      this.metadataCardState = !this.metadataCardState;
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
  /* background-color: #cccccc; */ /* ou toute autre couleur de mise en surbrillance */
  /* prendre  toute la largeur */
  width: 100%;
  /* prendre toute la hauteur */
  height: 100%;
  flex-grow: 1;
  position: relative;
  font-weight: bold;
}

.month li {
  display: flex;
  width: 100%;
}

.month li a {
  flex-grow: 1;
  text-decoration: none;
  color: #000000;
}

.year li {
  display: flex;
  width: 100%;
  margin: 0;
}

li.register .is-highlighted,
.month li,
.year li {
  margin-bottom: 4px;
}


.span-is-highlighted {
  display: block;
  width: 100%;
  color: var(--light-brown-alt) !important;
  background-color: #EDEDED;
}

.span-is-highlighted:before {
  display: none;
}


.fac-simile__toc ul {
  display: block;
  padding: 0;
  background-color: var(--panel-bg-color);
}

.fac-simile__toc.is-opened ul {
  display: block;
}

.fac-simile__toc > ul {
  min-height: 100vh;
  max-height: 100vh;
  overflow-y: scroll;
  margin: 0;
  padding: 30px 0;
}

.main__title__toc {
  display: block;
  margin: 28px 0 10px;

  font-size: 24px;
  font-weight: 400;
  font-style: italic;
  color: #272727;
}

.card-header-toggle {
  display: none;
}

.register {
}

.register:hover {
  cursor: pointer;
}

.register_name, .year_name, .month_name {
  display: inline-block;
  padding: 0.1em 25px;
  margin: 0;

  font-family: var(--font-secondary);
  font-size: 18px;
}

.year_name {
  padding-left: 52px;
}

.month_name {
  padding-left: 75px;
}

.register_name:hover, .year_name:hover, .month_name:hover {
  color: var(--light-brown-alt);
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
  margin-left: 0;
  padding-left: 1em;
}


@media screen and (max-width: 1024px) {

  .main__title__toc {
    margin: 0;
    padding: 20px;
    border-top: solid 1px #D0D0D0;
    background: #646464;
    color: #ffffff;

    display: flex;
    justify-content: space-between;
  }

  .is-opened .main__title__toc {
    background: #A53605;
  }

  .fac-simile__toc ul {
    display: none;
  }

  .fac-simile__toc > ul {
    min-height: 200px;
    max-height: unset;
    overflow-y: unset;
  }

  .fac-simile__toc.is-opened ul {
    display: block;
  }

  .card-header-toggle {
    display: inline-block;
    width: 29px;
    height: 29px;
    background: transparent url('~@/assets/images/b_Open_liste.svg') center / cover no-repeat;
    filter: invert();
    border: none;
    margin-right: 12px;
    cursor: pointer;
  }

  .is-opened .card-header-toggle {
    background-size: 21px 21px;
    background-image: url('~@/assets/images/b_Close_liste.svg');
    filter: brightness(100);
  }

}

</style>
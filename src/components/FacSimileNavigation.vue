<template>
  <nav class="fac-simile__toc">
    <h1 class="main__title__toc">Table des registres capitulaires</h1>
    <ul>
      <li v-for="(years, registre) in jsonData" :key="registre" class="registre">
        <b @click="toggleRegistre(registre)">
          <span class="registre_name">{{ registre }}</span>
          <span class="chevron" :class="{ 'open': openRegistres[registre]?.isOpen }">&#9660;</span>
        </b>
        <template v-if="openRegistres[registre]?.isOpen">
          <ul v-for="(months, year) in years" :key="year" class="year">
            <li @click="toggleYear(registre, year)">
              <span class="year_name">{{ formatYearNav(year) }}</span>
              <span class="chevron" :class="{ 'open': openRegistres[registre]?.[year] }">&#9660;</span>
            </li>
            <ul v-if="openRegistres[registre]?.[year]" class="month">
              <li v-for="month in months" :key="month">
                <a @click="updateMirador(registre, month.canvasID)">
                <span class="month_name">{{ capitalizeFirstLetter(month.month) }}</span>
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
import indexFSNavJson from "../data/nav_endp_new.json";
import capitalizeFirstLetter from "@/utils/_string_formater";
export default {
  name: "FacSimileNav",
  data() {
    return {
      jsonData: indexFSNavJson,
      openRegistres: {}, // Suivi des états dépliés/repliés
    };
  },
  methods: {
    capitalizeFirstLetter,
    toggleRegistre: function(registre) {
      if (!this.openRegistres[registre]) {
        this.openRegistres[registre] = { isOpen: true };
      } else {
        this.openRegistres[registre].isOpen = !this.openRegistres[registre].isOpen;
      }
    },
    formatYearNav: function(year) {
      return year.split('_')[0];
    },
    toggleYear: function(registre, year) {
      if (!this.openRegistres[registre]) {
        this.openRegistres[registre] = { isOpen: true, [year]: true };
      } else if (!this.openRegistres[registre][year]) {
        this.openRegistres[registre][year] = true;
      } else {
        this.openRegistres[registre][year] = !this.openRegistres[registre][year];
      }
    },
    updateMirador: function(registre, canvasID) {
      event.preventDefault();
      this.$emit('updateMirador', canvasID, registre);
    },
  },
};


</script>

<style scoped>

.fac-simile__toc {
  max-height: 650px;
  overflow-y: scroll;
  padding: 0.5em;
  border: 1px solid #d4d3d1;
  border-radius: 4px;
}

.main__title__toc {
  font-size: 1.4em;
  font-weight: bold;
  margin-bottom: 1em;
  display: block;
  text-align: center;
}

.registre:hover {
  cursor: pointer;
}

.registre_name, .year_name, .month_name {
  display: inline-block;
  padding: 0.2em 0.5em;
  margin: 0.2em 0;
  font-size: 1.1em;
}

.registre_name:hover, .year_name:hover, .month_name:hover {
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
</style>
<template>
  <nav>
    <h1>Registres capitulaires médiévaux de Notre-Dame de Paris</h1>
    <ul>
      <li v-for="(years, registre) in jsonData" :key="registre" class="registre">
        <b>{{ registre }}</b>
        <ul v-for="(months, year) in years" :key="year" class="year">
          <li>{{ year }}
            <ul class="month">
              <li v-for="month in months" :key="month"><a @click="updateMirador(registre, month.canvasID)">{{ month.month }}</a></li>

            </ul>
          </li>
        </ul>
      </li>
    </ul>
  </nav>
</template>

<script>
import indexFSNavJson from "../data/nav_endp.json";
export default {
  name: "FacSimileNav",
  data() {
    return {
      jsonData: indexFSNavJson
    }
  },
  methods: {
  updateMirador: function (registre, canvasID) {
    event.preventDefault();
    this.$emit('updateMirador', canvasID, registre);
  }
  },
};
</script>

<style scoped>
nav {
  overflow-y: scroll;
  height: 70vh;
  width: 20vw;

}
</style>
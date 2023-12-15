<template>
  <div class="flex-container date-selector input-date-description-container">
    <br>
    <p>ENTRE</p>
    <div class="control has-icons-left">
      <div class="select">
        <select v-model="internalStartMonthCode" @change="updateStartMonth" class="uppercase" id="StartMonthSelect">
          <option v-for="month in months" :key="month.iso_code" :value="month.iso_code">
            {{ month.name }}
          </option>
        </select>
        <span class="icon is-left"><i class="fas fa-calendar-alt"></i></span>
      </div>
    </div>
    <input class="input" type="text" :value="startYear" disabled>
    <p>ET</p>
    <div class="control has-icons-left">
      <div class="select">
        <select v-model="internalEndMonthCode" @change="updateEndMonth" class="uppercase" id="EndMonthSelect">
          <option v-for="month in months" :key="month.iso_code" :value="month.iso_code" :disabled="shouldDisableEndMonthOption(month.iso_code)">
            {{ month.name }}
          </option>
        </select>
        <span class="icon is-left"><i class="fas fa-calendar-alt"></i></span>
      </div>
    </div>
    <input class="input" type="text" :value="endYear" disabled>
  </div>
</template>

<script>
export default {
  name: 'DateSelector',
  props: {
    startMonthCode: {
      type: String,
      required: true
    },
    endMonthCode: {
      type: String,
      required: true
    },
    months: {
      type: Array,
      required: true
    },
    yearRange: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      internalStartMonthCode: this.startMonthCode,
      internalEndMonthCode: this.endMonthCode
    };
  },
  computed: {
    startYear() {
      return this.yearRange[0];
    },
    endYear() {
      return this.yearRange[1];
    }
  },
  methods: {
    updateStartMonth() {
      this.$emit('update:start-month-code', this.internalStartMonthCode);
    },
    updateEndMonth() {
      this.$emit('update:end-month-code', this.internalEndMonthCode);
    },
    shouldDisableEndMonthOption(monthCode) {
      return this.yearRange[0] === this.yearRange[1] && monthCode < this.startMonthCode;
    },
  }
};
</script>

<style scoped>


</style>
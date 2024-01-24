<template>
  <div class="control has-icons-left">
    <div class="select select-month">
      <select
          v-model="selected_month"
          @change="onInputChange">
        class="uppercase">
        <option
            v-for="month in months"
            :key="month.iso_code"
            :value="month.iso_code">
          {{ month.name }}
        </option>
      </select>
      <span class="icon is-left"><i class="fas fa-calendar-alt"></i></span>
    </div>
  </div>
  <div class="control control-input-date">
    <input
        v-model="input_year"
        @change="onInputChange"
        class="input" type="text">
  </div>
</template>

<script>
export default {
  name: "BaseDateSelector",
  props: {
    selectedMonth: {
      type: String,
      required: false,
    },
    inputYear: {
      type: String,
      required: false,
    },
    modeDate: {
      type: String,
      required: false,
      default: 'start',
    }
  },
  watch: {
    selected_month: {
      handler(newVal){
        this.selected_month = newVal;
      },
      immediate: true,
    },
    input_year: {
      handler(newVal){
        this.input_year = newVal;
      },
      immediate: true,
    },
  },
  data() {
    return {
      selected_month: this.$props.selectedMonth,
      input_year: this.$props.inputYear,
      months: this.$store.state.months,
      mode_date: this.$props.modeDate,
    };
  },
  methods: {
    onInputChange() {
      this.$emit('change-input', {month: this.selected_month, year: this.input_year, mode_date: this.mode_date});
    }
  }
};
</script>

<style scoped>


.control-input-date {
  width: 15%;
}
</style>

<template>
  <div class="control has-icons-left">
    <div class="select select-month">
      <select v-model="monthCodeSelected" class="uppercase" @change="onDateInputChange">
        <option v-for="month in months" :key="month.iso_code" :value="month.iso_code"
                :disabled="shouldDisableOption(month.iso_code)">
          {{ month.name }}
        </option>
      </select>
      <span class="icon is-left"><i class="fas fa-calendar-alt"></i></span>
    </div>
  </div>
  <div class="control control-input-date">
    <input class="input" type="text" @change="onDateInputChange" v-model="yearSelected">
  </div>
</template>

<script>
import {mapState} from "vuex";

export default {
  name: "RegisterBaseDateSelector",
  props: {
    monthCode: {
      type: String,
      required: true
    },
    year: {
      type: String,
      required: true
    },
    shouldDisableOption: {
      type: Function,
      default: () => false,
      required: false
    },
    modeRange: {
      type:String,
      default: 'start',
      required: false,
    }
  },
  data() {
    return {
      monthCodeSelected: this.$props.monthCode,
      yearSelected: this.$props.year,
      mode_range: this.$props.modeRange,
    };
  },
  computed: {
    ...mapState(['months'])
  },
  watch: {
    monthCode: function (newVal, oldVal) {
      if (newVal !== oldVal) {
        this.monthCodeSelected = newVal;
      }
    },
    year: function (newVal, oldVal) {
      if (newVal !== oldVal) {
        this.yearSelected = newVal;
      }
    }
  },
  methods: {
    /**
     * Triggers when the user changes the date
     * @emits date-change-selector
     * @event date-change-selector
     * @return void
     */
    onDateInputChange() {
      this.$emit('date-change-selector', {
        monthCode: this.monthCodeSelected,
        year: this.yearSelected,
        modeRange: this.mode_range,
      });
    }
  }
};
</script>

<style scoped>
.control {
  margin: 0;
}
.select-month {
  width: 100%;
}
.control-input-date {
  width: 4rem;
}
</style>
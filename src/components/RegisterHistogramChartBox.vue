<template>
  <div class="box box-histogram">
    <div id="histogram"></div>
  </div>
</template>

<script>
import Plotly from 'plotly.js-dist';
import {mapState} from "vuex";

export default {
  name: 'RegisterHistogramChartBox',
  props: {
    startYearProp: {
      type: Number,
      default: 1326,
      required: true
    },
    endYearProp: {
      type: Number,
      default: 1504,
      required: true
    }
  },
  data() {
    return {
      startYear: 1326,
      endYear: 1504,
      minYear: 1326,
      maxYear: 1504,
      pagesByYear: {}
    };
  },
  computed: {
    ...mapState(['endpData'])
  },
  mounted() {
    this.calculatePagesByYear();
    this.plotHistogram();
  },
  watch: {
    startYearProp() {
      this.startYear = this.startYearProp;
      this.updateChartColors();
    },
    endYearProp() {
      this.endYear = this.endYearProp;
      this.updateChartColors();
    }
  },
  methods: {
    /**
     * Calculate the total number of pages for each year
     * @returns {void}
     */
    calculatePagesByYear() {
      Object.keys(this.endpData).forEach(key => {
        const year = key.split('-')[0]; // Split the key and get the year
        const pages = this.endpData[key].reduce((total, record) => {
          return total + (record.lastPageCanvasIdx - record.firstPageCanvasIdx + 1);
        }, 0);

        if (!this.pagesByYear[year]) {
          this.pagesByYear[year] = pages;
        } else {
          this.pagesByYear[year] += pages;
        }
      });
    },

    /**
     * Plot the histogram
     * @returns {void}
     */
    plotHistogram() {
      const trace = {
        x: Object.keys(this.pagesByYear),
        y: Object.values(this.pagesByYear),
        type: 'bar',
        marker: {color: '#8d1919'}
      };

      const layout = {
        title: '',
        xaxis: {
          title: '',
          tickmode: 'linear',
          dtick: 10,
          showline: false
        },
        yaxis: {
          title: 'Pages'
        },
        uirevision: false,
        displayModeBar: false
      };

      const graph = document.getElementById('histogram');
      Plotly.newPlot(graph, [trace], layout, {responsive: true, displayModeBar: true});
      graph.on('plotly_relayout', () => {
        const xaxis = graph.layout.xaxis;
        if (xaxis.range) {
          this.startYear = Math.max(this.minYear, Math.min(this.maxYear, Math.floor(xaxis.range[0])));
          this.endYear = Math.max(this.minYear, Math.min(this.maxYear, Math.floor(xaxis.range[1])));
        }
      });

    },

    /**
     * Update the colors of the histogram bars based on the start and end year
     * @returns {void}
     */
    updateChartColors() {
      const years = Object.keys(this.pagesByYear);
      const graph = document.getElementById('histogram');
      const colors = years.map(year => {
        return (year >= this.startYear && year <= this.endYear) ? '#8d1919' : 'lightgrey';
      });
      if (graph) {
        Plotly.restyle(graph, 'marker.color', [colors], [0], {duration: 500, easing: "linear"});
      }
    }
  }
};
</script>

<style scoped>
.box-histogram {
  border: 0.5px solid #0a0a0a;
  border-radius: 5px;
  width: 100%;
}
</style>

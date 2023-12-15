<template>
    <div id="histogram"></div>
</template>

<script>
import Plotly from 'plotly.js-dist';
import endpDataRange from '@/data/endp_data_range.json';
export default {
  name: 'RegisterHistChart',
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
      data: endpDataRange,
      pagesByYear: {}
    };
  },
  mounted() {
    this.calculatePagesByYear();
    this.getTotalPagesForRange();
    this.plotHistogram();
  },
  watch: {
  startYearProp() {
    this.startYear = this.startYearProp;
    this.getTotalPagesForRange();
    this.updateChartColors();
  },
  endYearProp() {
    this.endYear = this.endYearProp;
    this.getTotalPagesForRange();
    this.updateChartColors();
  }
},
  methods: {
    getTotalPagesForRange() {
    let totalPagesInRange = 0;
    for (let year = this.startYear; year <= this.endYear; year++) {
      if (this.pagesByYear[year]) {
        totalPagesInRange += this.pagesByYear[year];
      }
    }
    this.$emit('total-pages-range', totalPagesInRange);
      return totalPagesInRange;
  },
      calculatePagesByYear() {
      Object.keys(this.data).forEach(key => {
        const year = key.split('-')[0];
        const pages = this.data[key].lastPageCanvasIdx - this.data[key].firstPageCanvasIdx + 1;

        if (!this.pagesByYear[year]) {
          this.pagesByYear[year] = pages;
        } else {
          this.pagesByYear[year] += pages;
        }
      });
    },
    plotHistogram() {
      const trace = {
        x: Object.keys(this.pagesByYear),
        y: Object.values(this.pagesByYear),
        type: 'bar',
        marker: { color: '#8d1919' }
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
      Plotly.newPlot(graph, [trace], layout);
      graph.on('plotly_relayout', () => {
        const xaxis = graph.layout.xaxis;
        if (xaxis.range) {
          this.startYear = Math.max(this.minYear, Math.min(this.maxYear, Math.floor(xaxis.range[0])));
          this.endYear = Math.max(this.minYear, Math.min(this.maxYear, Math.floor(xaxis.range[1])));
        }
      });

    },
    updateChartColors() {
  const years = Object.keys(this.pagesByYear);
  const colors = years.map(year => {
    return (year >= this.startYear && year <= this.endYear) ? '#8d1919' : 'lightgrey';
  });

  console.log('Updating chart colors...');
  console.log('Start Year:', this.startYear);
  console.log('End Year:', this.endYear);

  const graph = document.getElementById('histogram');
 if (graph) {
    Plotly.restyle(graph, 'marker.color', [colors], [0], { duration: 500, easing:"linear"}); // La durée de transition est définie à 500 millisecondes (modifiable)
  } else {
    console.error('Graph element not found');
  }
}
  }
};
</script>

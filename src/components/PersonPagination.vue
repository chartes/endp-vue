<template>
  <div class="pagination-box box">
    <nav class="pagination">
      <a class="pagination-previous" :class="{ 'disabled': currentPage === 1 }"
         @click="handleChangePage(currentPage - 1)">
        <span class="icon is-primary">
          <i class="fas fa-chevron-left"></i>
        </span>
      </a>
      <ul class="pagination-list">
        <!-- Bouton pour aller à la première page -->
        <li v-if="currentPage > 2">
          <a class="pagination-link" aria-label="Aller à la page 1" @click="handleChangePage(1)">1</a>
        </li>
        <!-- Ellipse de début -->
        <li v-if="currentPage > 3">
          <span class="pagination-ellipsis">&hellip;</span>
        </li>
        <!-- Page précédente -->
        <li v-if="currentPage > 1">
          <a class="pagination-link" aria-label="Page précédente" @click="handleChangePage(currentPage - 1)">
            {{ currentPage - 1 }}
          </a>
        </li>
        <!-- Page actuelle -->
        <li>
          <a class="pagination-link is-current" aria-label="Page actuelle" aria-current="page">
            {{ currentPage }}
          </a>
        </li>
        <!-- Page suivante -->
        <li v-if="currentPage < totalPages">
          <a class="pagination-link" aria-label="Page suivante" @click="handleChangePage(currentPage + 1)">
            {{ currentPage + 1 }}
          </a>
        </li>
        <!-- Ellipse de fin -->
        <li v-if="currentPage < totalPages - 2">
          <span class="pagination-ellipsis">&hellip;</span>
        </li>
        <!-- Bouton pour aller à la dernière page -->
        <li v-if="currentPage < totalPages - 1">
          <a class="pagination-link" aria-label="Aller à la dernière page" @click="handleChangePage(totalPages)">
            {{ totalPages }}
          </a>
        </li>
      </ul>
      <a class="pagination-next" :class="{ 'disabled': currentPage === totalPages }"
         @click="handleChangePage(currentPage + 1)">
        <span class="icon is-primary">
          <i class="fas fa-chevron-right"></i>
        </span>
      </a>
    </nav>
    <div class="pagination-panel">
      <input id="limit-results" class="input items-by-page-input" type="number" placeholder="50"
             :min="itemsByPageMinDisplay" :max="itemsByPageMaxDisplay" step="10"
             v-model="itemsByPageDisplay" @change="handleItemsPerPageChange">
      <label class="label" for="limit-results">Résultats par page</label>
    </div>
  </div>
</template>


<script>
export default {
  name: 'PaginationComponent',
  props: {
    currentPage: Number,
    totalPages: Number,
    itemsByPageDefault: Number,
    itemsByPageMax: Number,
    itemsByPageMin: Number,
  },
  data() {
    return {
      itemsByPageMinDisplay: this.$props.itemsByPageMin,
      itemsByPageMaxDisplay: this.$props.itemsByPageMax,
      itemsByPageDisplay: this.$props.itemsByPageDefault,
    };
  },
  computed: {
    pages() {
      let pages = [];
      for (let i = 1; i <= this.totalPages; i++) {
        pages.push(i);
      }
      return pages;
    },
  },
  watch: {
    itemsByPageDisplay(newVal) {
      if (newVal < this.itemsByPageMinDisplay) {
        this.itemsByPageDisplay = this.itemsByPageMinDisplay;
      } else if (newVal > this.itemsByPageMaxDisplay) {
        this.itemsByPageDisplay = this.itemsByPageMaxDisplay;
      }
    },
  },
  methods: {
    /**
     * Triggered when the user clicks on a page number
     *
     * @param<Number> page
     */
    handleChangePage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.$emit('update:change-page', page);
      }
    },
    /**
     * Triggered when the user changes the number of items display per page
     */
    handleItemsPerPageChange() {
      this.$emit('change:items-by-page-display', this.itemsByPageDisplay);
    },
  },
};
</script>


<style scoped>

nav .pagination {
  background-color: #f5f5f5 !important; ;
  padding: 1rem 1.5rem 1.5rem 1.5rem;
  border-radius: 5px;
  top: 0;
  position: sticky;
}

nav.pagination {
  margin-bottom: 0;
}

.pagination-box {
  display: flex;
  flex-direction: column-reverse;
  padding: 0;
  margin-top: -45px;
}

.pagination-panel {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  border-bottom: #000000 solid 6px;
  margin-bottom: 10px;
}

.pagination-panel .label {
  margin-left: 10px;
  margin-bottom: 12px;

  font-family: var(--font-secondary);
  font-size: 20px;
  color: #6E6E6E;
  font-weight: 400;
}

.items-by-page-input {
  width: 80px;
  height: auto;
  padding: 2px 8px 2px 2px;
  margin-left: 10px;
  margin-bottom: 5px;
  transform: translateY(-4px);
  border: none;
  border-bottom: solid 1px var(--light-brown);
  border-radius: 0;

  font-family: var(--font-secondary);
  font-size: 20px;
  font-weight: 400;
  color: #303030;
  text-align: center;
}

.pagination-box .pagination-input .label {
  margin-left: 10px;
  padding: 5px;
}


.disabled {
  pointer-events: none;
  opacity: 0.5;
}

.pagination-list {
  margin-left: 40px;
  justify-content: center;
}

.pagination-link {
  min-width: 35px;
  height: auto;
  background-color: #E0E0E0;
  border: none;
  border-radius: 3px;
  padding: 7px 0;
  font-family: var(--font-secondary);
  font-size: 18px;
  font-weight: 500;
  color: #4D4D4D;
}

.pagination-link.is-current {
  background-color: #a53605;
  color: #fff;
}

.pagination-previous, .pagination-next {
  position: relative;
  margin: 0;
  border: none;
}

.pagination-ellipsis {
  margin: 0;
}

.pagination-previous .icon,
.pagination-next .icon {
  display: none;
}

.pagination-previous:before,
.pagination-next:before {
  content: "";
  position: absolute;
  display: inline-block;
  width: 28px;
  height: 23px;
  background: url("@/assets/images/b_fleche.svg") center / cover no-repeat;
}

.pagination-previous:before {
  transform: scaleX(-1);
}



@media screen and (max-width: 1024px) {

  .pagination-link {
    min-width: 40px;
    height: 58px;
    font-size: 26px;
  }

  nav.pagination {
    margin-top: 1px;
  }

  .pagination-previous,
  .pagination-next {
    position: absolute;
    top: 45px;
    right: 0;
    width: 53px;
    height: 45px;
    padding: 0;
  }

  .pagination-previous {
    transform: translateX(-82px);
  }

  .pagination-previous:before,
  .pagination-next:before {
    display: inline-block;
    width: 53px;
    height: 45px;
  }

  .pagination-panel .label,
  .pagination-panel .items-by-page-input {
    display: none;
  }

  .pagination-box {
    margin-top: 0;
  }

  .pagination-list {
    margin-left: 0;
  }

  .pagination-ellipsis {
    font-size: 2em;
    padding-left: 0.2em;
    padding-right: 0.2em;
  }
}

</style>

<template>
  <div class="container">
    <div class="section">
      <h1 class="title">Personnes</h1>
      <hr>
    </div>
    <div class="columns">

      <div class="column">
        <!-- Pagination control panel -->
        <div class="pagination is-rounded">
          <ul class="pagination-list">
            <li>
              <a class="pagination-link" v-if="currentPage > 2" aria-label="Goto page 1" @click="changePage(1)">1</a>
            </li>
            <li>
              <span class="pagination-ellipsis" v-if="currentPage > 3">&hellip;</span>
            </li>
            <li>
              <a class="pagination-link" v-if="currentPage > 1" aria-label="Goto previous page"
                 @click="changePage(currentPage - 1)">
                {{ currentPage - 1 }}
              </a>
            </li>
            <li>
              <a class="pagination-link is-current" aria-label="Page {{ currentPage }}" aria-current="page">{{
                  currentPage
                }}</a>
            </li>
            <li>
              <a class="pagination-link" v-if="currentPage < totalPages" aria-label="Goto next page"
                 @click="changePage(currentPage + 1)">
                {{ currentPage + 1 }}
              </a>
            </li>
            <li>
              <span class="pagination-ellipsis" v-if="currentPage < totalPages - 2">&hellip;</span>
            </li>
            <li>
              <a class="pagination-link" v-if="currentPage < totalPages - 1" aria-label="Goto page {{ totalPages }}"
                 @click="changePage(totalPages)">
                {{ totalPages }}
              </a>
            </li>
          </ul>
        </div>
        <div class="pagination-panel">
          <div class="pagination-buttons pagination is-rounded">

            <a class="pagination-previous" :class="{ 'disabled': currentPage === 1 }"
               @click="changePage(currentPage - 1)">
               <span class="icon is-primary">
                 <i class="fas fa-chevron-left"></i>
               </span>

            </a>
            <a class="pagination-next" :class="{ 'disabled': currentPage === totalPages }"
               @click="changePage(currentPage + 1)">
                <span class="icon is-primary">
                 <i class="fas fa-chevron-right"></i>
               </span>
            </a>
          </div>

          <div class="pagination-input">
            <label class="label">Résultats par page</label>
            <input class="input small-input" type="number" placeholder="50" min="50" max="100" step="10"
                   v-model="limit"
                   @change="handleItemsPerPageChange">
          </div>
        </div>
        <div>
          <ul>
            <li v-for="person in persons" :key="person.id">
              <div class="card">
                <header class="card-header" @click="toggleContent(person, $event)">
                  <p class="card-header-title">
                    {{ person.id }} - {{ person.pref_label }}
                  </p>
                  <a href="#" class="toggle-btn" :class="{ 'is-opened': person.isOpened }"></a>
                </header>
                <div class="card-content" v-if="person.isOpened">
                  <div class="content">
                    <div class="columns is-multiline">
                      <div class="column is-7 block has-text-left">
                        <p><b>Prénom(s) - <i>Nomen</i></b> : {{ person.forename_alt_labels }}</p>
                        <p><b>Nom(s) - <i>Cognomen</i></b> : {{ person.surname_alt_labels }}</p>
                        <p><b>Dates extrêmes d'apparition dans les registres</b> :
                          {{ person.first_mention_date ? person.first_mention_date : "Inconnu" }} -
                          {{ person.last_mention_date ? person.last_mention_date : "Inconnu" }}</p>
                        <p>Apparait dans les registres [non implémenté] : ... (images des pages ou lien vers le registre
                          ou lien vers la mention dans le registre ou lien facsimile ???)</p>
                      </div>
                      <div class="column is-2">
                      </div>
                      <div class="column is-3"  v-if="person.kb_links.length > 0 ">
                        <p class="metadata-header-title"><b>LIENS EXTERNES</b></p>
                        <ul>
                          <li v-for="kb_link in person.kb_links" :key="kb_link.id">
                            <figure class="image is-48x48 level-left" v-if='kb_link.type_kb !== "Collecta"'>
                              <a v-bind:href="kb_link.url">
                                <img title="Studium Parisiense" :src="require('@/assets/paris1-studium-favicon.png')"
                                     alt="studium parisiense logo" v-if="kb_link.type_kb === 'Studium Parisiense'"/>
                              </a>
                              <!--https://www.collecta.fr/_files/uploads/thumbs/900/COL-IMG-12392-1.jpg-->
                            </figure>
                          </li>
                        </ul>
                      </div>
                      <section class="section">
			<div class="container"  v-if="person.kb_links.some(link => link.type_kb === 'Collecta')">
        <p class="metadata-header-title"><b>MEDIA(S)</b></p>
				<div id="carousel-media">
					<div class="item-1">
						<img title="Studium Parisiense" src="https://www.collecta.fr/_files/uploads/thumbs/900/COL-IMG-12392-1.jpg"
                                     alt="studium parisiense logo">
					</div>
					<div class="item-2">
						<img title="Studium Parisiense" :src="require('@/assets/paris1-studium-favicon.png')"
                                     alt="studium parisiense logo"/>
					</div>
					<div class="item-3">
						<img title="Studium Parisiense" :src="require('@/assets/paris1-studium-favicon.png')"
                                     alt="studium parisiense logo"/>
					</div>
				</div>
				<!-- End Carousel -->
			</div>
		</section>
                    </div>

                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <!--
      <div class="column">
        <a :href="dbAdminPath" class="button is-primary" target="_blank">
          <span class="icon"><i class="fa fa-database"></i></span>
          <span>Administration de la base de données</span>
            </a>
      </div>
      -->
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "PersonView",
  data() {
    return {
      persons: [],
      dbAdminPath: process.env.VUE_APP_DB_ADMIN,
      currentPage: 1,
      limit: 50,
      total: 0,
    };
  },
  computed: {
    totalPages() {
      return Math.ceil(this.total / this.limit);
    },
  },
  methods: {
    async getPersons() {
      axios.get(process.env.VUE_APP_DB_API + "/persons/?size=" + this.limit + "&page=" + this.currentPage, {
        withCredentials: false, headers: {
          Accept: "application/json",
        }
      }).then(response => {
        this.persons = response.data.items.map(person => ({
          ...person,
          isOpened: false,
        }));
        this.total = response.data.total;
        if (this.currentPage > this.totalPages) {
          this.currentPage = 1;
        }
      });
    },
    toggleContent(person, event) {
      event.preventDefault();
      person.isOpened = !person.isOpened;
    },
    async handleItemsPerPageChange(event) {
      this.limit = event.target.value;
      this.currentPage = 1;
      this.getPersons();
    },
    isFirstPage(page) {
      return page === 1;
    },
    isLastPage(page) {
      return page === this.totalPages;
    },
    isPageInRange(page) {
      const pagesToShow = 5; // Adjust as needed
      const lowerBound = Math.max(2, this.currentPage - Math.floor(pagesToShow / 2));
      const upperBound = Math.min(this.totalPages - 1, this.currentPage + Math.floor(pagesToShow / 2));
      return page >= lowerBound && page <= upperBound;
    },
    changePage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
        this.getPersons();
      }
    }
  },
  mounted() {
    this.getPersons();
  }
}

</script>


<style scoped>
.toggle-btn {
  width: 27px;
  height: 27px;
  background: url('~@/assets/chevron_rouge.svg') center / cover no-repeat;
  transition: transform 0.6s;
}

.toggle-btn.is-opened {
  width: 27px;
  background: url('~@/assets/croix.svg') center / cover no-repeat;
}

.disabled {
  pointer-events: none;
  color: gray; /* or any other color to indicate disabled state */
}

.pagination-panel {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.pagination-buttons {
  display: flex;
  align-items: center;
}

.pagination-previous,
.pagination-next {
  margin-right: 10px;
}

.pagination-input {
  display: flex;
  align-items: center;
}

.pagination-input label {
  margin-right: 10px;
  display: inline;
}

.small-input {
  width: 35%; /* Ajustez la largeur selon vos besoins */
}

/* Dans les cards */
.document-metadata-header:hover {
  background-color: #d8d8d8;
}

.carousel {
    display: flex;
    overflow: hidden;
  }

  .carousel-item {
    flex: 0 0 100%;
    transition: transform 0.5s ease-in-out;
  }
</style>
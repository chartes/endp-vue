<template>
  <div class="card" :class="{ 'is-opened': person.isOpened }">
    <header class="card-header" @click="toggleContent(person, $event)">
      <div class="card-header-title">
        <span class="canon-icon" v-if="person.is_canon"></span>
        <span class="secular-people-icon" v-else></span>
        <span class="card-header-person-pref-label">{{ person.pref_label }}</span>
      </div>
      <a class="toggle-btn" :class="{ 'is-opened': person.isOpened }"></a>
    </header>
    <div class="card-content" v-if="person.isOpened">
      <div class="content">
        <div class="columns is-multiline">
          <div class="column is-7 block has-text-left">
            <div class="columns is-multiline">
              <div class="column">
                <p>
                  <b>Prénom(s) - Nomen :</b>
                  {{ person.forename_alt_labels }}
                </p>
              </div>
              <div class="column">
                <p><b>Nom(s) - Cognomen :</b>
                  {{ person.surname_alt_labels }}
                </p>
              </div>
            </div>
            <div class="columns is-multiline">
              <div class="column">
                <p class="dates"><b>Date de décès :</b>
                  {{ person.death_date ? formatDate(person.death_date) : "Non renseigné" }}
                </p>
              </div>
              <div class="column">
                <p class="dates"><b>Dates extrêmes d'apparition dans les registres</b>
                  {{ person.first_mention_date ? formatDate(person.first_mention_date) : "Non renseigné" }} -
                  {{ person.last_mention_date ? formatDate(person.last_mention_date) : "Non renseigné" }}</p>
              </div>
            </div>
            <p>
              <router-link class="button  btn-person-data-link" :to="`/persons/${person._id_endp}`">
                <span>Accéder à la fiche</span>
              </router-link>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {formatDate} from "@/modules/string_format";

export default {
  name: "PersonResultCard",
  props: {
    person: {
      type: Object,
      required: true
    }
  },
  methods: {
    formatDate,
    toggleContent(person, event) {
      person.isOpened = !person.isOpened;
      event.preventDefault();
    },
  }
}
</script>

<style scoped>

.card-content {
  padding: 25px 0;

  font-family: var(--font-secondary);
  font-size: 20px;
}

.card-content .column {
  width: 100%;
  padding: 0;
}

.card-content .column p {
  margin-bottom: 5px;
  position: relative;
  color: #6E6E6E;
}

.card-content .column p.dates {
  margin-top: 25px;
}


.card-content .column p > b {
  display: block;
  font-weight: 400;
  color: var(--light-brown-alt);
}

.canon-icon {
  background: url(@/assets/images/picto_chanoine_liste.svg) center left / auto 59px no-repeat;
  height: 60px;
  width: 55px;
}

.secular-people-icon {
  background: url(@/assets/images/picto_perso_titre.svg) center left / auto 59px no-repeat;
  height: 59px;
  width: 55px;
}

header {
  min-height: 130px;
  border-bottom: solid 6px #D74A52;
  align-items: flex-end;
}

.card.is-opened {
  border-bottom: solid 6px #000000;
  padding-bottom: 32px;
}

.card.is-opened header {
  border-bottom: solid 1px #A5A5A5;
  min-height: 125px;
}

.card-header {
  border-radius: 0;
}

.card-header-title {
  padding: 0;
  font-size: 22px;
  color: #000000;
  font-weight: 400;
  font-style: italic;
}

.btn-person-data-link {
  padding: 0 45px 0 0;
  border: none;
  font-size: 20px;
  line-height: 35px;
  color: #6E6E6E;
  background: transparent url(@/assets/images/b_access_fiche.svg) center right / auto 35px no-repeat;

  position: absolute;
  right: 0;
  top: 0;
}

.btn-person-data-link:hover {
  color: var(--light-brown-alt);
}

.toggle-btn {
  background: transparent url('~@/assets/images/b_Open_liste.svg') center / cover no-repeat;
  cursor: pointer;
  width: 27px;
  height: 27px;
  margin-bottom: 12px;
  margin-right: 10px;
}

.toggle-btn.is-opened {
  background-image: url('~@/assets/images/b_Close_liste.svg');
}

.card-header-person-pref-label {
  text-align: center;
  flex-grow: 1;
  display: flex;
}

@media screen and (max-width: 1024px) {

  header,
  .li--person:first-child header.card-header {
    min-height: 90px;
  }

}
</style>
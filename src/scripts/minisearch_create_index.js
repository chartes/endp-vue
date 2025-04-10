// create-fuse-index.js
const fs = require('fs');
const MiniSearch = require("minisearch");

const filePath = '/Users/lucaterre/Documents/pro/Travail_courant/DEV/PROJETS/ANR-ENDP/on_github/endp-vue/src/data/stable/structured_terms_with_variants.json';

const jsonTerms = JSON.parse(fs.readFileSync(filePath, 'utf8'));

let miniSearch = new MiniSearch({
          fields: ['text'],
          storeFields: ['text'],
        });
miniSearch.addAll(jsonTerms)

const json = JSON.stringify(miniSearch)

fs.writeFileSync('/Users/lucaterre/Documents/pro/Travail_courant/DEV/PROJETS/ANR-ENDP/on_github/endp-vue/src/data/stable/minisearch-endp-index.json', json)
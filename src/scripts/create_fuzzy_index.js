// create-fuse-index.js
const fs = require('fs');
const Fuse = require('fuse.js');

// Lire le fichier texte
const filePath = '/Users/lucaterre/Documents/pro/Travail_courant/DEV/PROJETS/ANR-ENDP/on_github/endp-vue/src/data/ext/processed_endp_forms.txt';
const fileContent = fs.readFileSync(filePath, 'utf8');

// Diviser le contenu du fichier en une liste de termes (par exemple, par ligne)
const terms = fileContent.split('\n').map(term => ({ title: term.trim() }));

// Créer l’index
const myIndex = Fuse.createIndex(['title'], terms);

// Sauvegarder l’index dans un fichier JSON
fs.writeFileSync('/Users/lucaterre/Documents/pro/Travail_courant/DEV/PROJETS/ANR-ENDP/on_github/endp-vue/src/data/stable/fuse-index.json', JSON.stringify(myIndex.toJSON()));
fs.writeFileSync('/Users/lucaterre/Documents/pro/Travail_courant/DEV/PROJETS/ANR-ENDP/on_github/endp-vue/src/data/stable/terms.json', JSON.stringify(terms));
module.exports = {
    // indique a jest de traiter les fichiers .vue
     "moduleDirectories": [
    "node_modules",
    "src"
],
    testEnvironment: "jsdom",
     testEnvironmentOptions: {
       customExportConditions: ["node", "node-addons"],
    },
    moduleFileExtensions: ['js', 'json', 'ts', 'vue'],
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1'
    },
    transform: {
        '^.+\\.vue$': '@vue/vue3-jest',
        '^.+\\.js$': 'babel-jest'
    },
    testMatch: [
        // indique à Jest où trouver les tests
        '**/tests/unit/**/*.spec.js'
    ],
    testPathIgnorePatterns: ['/node_modules/'],
};
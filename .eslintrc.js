// eslint-disable-next-line no-undef
module.exports = {
    "env": {
        "browser": true,
        "es2020": true
    },
    "extends": [
        "eslint:recommended",
        "plugin:react/recommended",
        "plugin:@typescript-eslint/recommended",
    ],
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
        "ecmaFeatures": {
            "jsx": true
        },
        "ecmaVersion": 11,
        "sourceType": "module"
    },
    "plugins": [
        "eslint-plugin-fsd",
        "react",
        "@typescript-eslint",
    ],
    "rules": {
        "fsd/hof-name-prefix": "error",
        "fsd/no-heavy-constructor": "error",
        "fsd/jq-cache-dom-elements": "error",
        "fsd/jq-use-js-prefix-in-selector": "error",
        "fsd/no-function-declaration-in-event-listener": "error",
        "fsd/split-conditionals": "error"
    }
};

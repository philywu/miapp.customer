module.exports = {
    "env": {
        "browser": true,
        "es6": true,
        "node": true
    },
    "extends": "eslint:recommended",
    "parser": "babel-eslint",
    "parserOptions": {
        "ecmaVersion": 2017,
        "sourceType": "module",
        "sourceType": "module",
        "allowImportExportEverywhere": true,
        "codeFrame": false
    },
    "rules": {
        "linebreak-style": [
            "error",
            "windows"
        ],
        "quotes": [
            "error",
            "single",
            {
                avoidEscape: true,
                allowTemplateLiterals: true
            }

        ],
        "semi": [
            "error", "always", { "omitLastInOneLineBlock": true }
        ],
        "no-unused-vars": ["warn", {
            "vars": "all",
            "args": "after-used",
            "ignoreRestSiblings": false
        }],
        "no-cond-assign": [ "error", "except-parens" ],
        "no-console":0

    }
};
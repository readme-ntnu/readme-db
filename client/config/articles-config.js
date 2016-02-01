// Global settings or preferences for handling articles
ArticleConfig = {

    // Properties of an article that must be defined in order to save an article.
    mandatoryProperties: ['edition', 'pages', 'title'],

    // Spalter. Types and their associated page numbers.
    types: {
        2: "Leder",
        3: "Side 3",
        8: "Gløsløken",
        14: "Flørt",
        16: "Siving",
        17: "Ikke-siving",
        24: "Utgavens algoritme",
        26: "Utgavens konkurranse",
        27: "Tegneserie"
    },

    // Article properties with values known to be arrays
    arrayProperties: ['pages', 'tags']

};

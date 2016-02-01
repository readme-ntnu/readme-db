// Various default values
Defaults = {

    // Standard removal confirmation popup configuration.
    removalConfirmation: function (article) {
        return {
            message: 'Er du sikker på at du vil slette "' + article.title + '"?',
            title: "Slett artikkel",
            cancelText: "Nei, avbryt",
            okText: "Ja, slett",
            success: false // true: green button, false: red button
        };
    },

    errorMessageFromServer: 'Noe gikk galt!'

};

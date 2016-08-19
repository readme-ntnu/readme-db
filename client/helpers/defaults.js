// Various default values
const Defaults = {

    // Standard removal confirmation popup configuration.
  removalConfirmation(article) {
    return {
      message: `Er du sikker på at du vil slette ${article.title}?`,
      title: 'Slett artikkel',
      cancelText: 'Nei, avbryt',
      okText: 'Ja, slett',
      success: false, // true: green button, false: red button
      focus: 'cancel',
    };
  },

  errorMessageFromServer: 'Noe gikk galt!',

};

export default Defaults;

import { Restivus } from 'meteor/nimble:restivus';
import search from './search';

// Global API configuration
const Api = new Restivus({
  useDefaultAuth: true,
  prettyJson: true,
});

// Maps to: /api/search
Api.addRoute('search', { authRequired: false }, search);

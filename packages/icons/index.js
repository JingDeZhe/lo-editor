import Vue from 'vue';
import Icon from '../components/Icon.vue';

Vue.component('icon', Icon);
const requireAll = requireContext => requireContext.keys().map(requireContext);
const req = require.context('./svg', true, /\.svg$/);
requireAll(req);
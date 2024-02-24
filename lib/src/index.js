import { f11y } from './main/f11y';

import { initSettings } from './global/settings';
import { initFocusableElements } from './global/focusable';
import { initStore } from './global/store';

initFocusableElements();
initSettings();
initStore();

import './components/accordion';
import './components/dropdown';
import './components/layer';
import './components/table';
import './components/tablist';
//import './components/toast';
import './components/tooltip';

export default f11y

if (typeof window !== 'undefined') {
    window.f11y = f11y
}
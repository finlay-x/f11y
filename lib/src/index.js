import { f11y } from './main/init';

import { initSettings } from './global/settings';
import { initFocusableElements } from './global/focusable';
import { initStore } from './global/store';

import Accordion from './components/accordion';
import Dropdown from './components/dropdown';
import Layer from './components/layer';
import Table from './components/table';
import TabList from './components/tablist';
import Tooltip from './components/tooltip';

initFocusableElements();
initSettings();
initStore();

if (typeof f11y !== 'undefined') {
    f11y.Accordion = Accordion
    f11y.Dropdown = Dropdown
    f11y.Layer = Layer
    f11y.Table = Table
    f11y.TabList = TabList
    f11y.Tooltip = Tooltip
}

export default f11y

if (typeof window !== 'undefined') {
    window.f11y = f11y
}

import DomHelper from './dom-component.js';
import defaults from './defaults.js';

const d = document;

export default class MultiSelect extends DomHelper {
    constructor(element, options = {}) {
        super(element, options, defaults);

        if (this.options.sort) {
            this.options.items = this._sortItems(options.items);
        }

        options.current = this._convertItems(options.current || []);
        this.options.items = this._convertItems(options.items, options.current);

        this._renderInit();

        this._setResultMessage();

        this._bindEvents();
    }

    /**
     * Bind the delegated dom events
     * @private
     */
    _bindEvents() {
        this.on('keyup', e => {
            if (e.key === 'Escape' || e.keyCode === 27) this.toggle(false);
        }, d);

        this.on('click', e => {
            if (e.target.classList.contains('si-item')) return this._setCurrent(e)._setResultMessage();
            if (!this.dom.el.contains(e.target)) return this.toggle(false);
            this.toggle();
        }, d);
    }

    /**
     * Get all items in the list
     * @return {Object[]}
     */
    getItems() {
        return Array.from(this.options.items.values());
    }

    /**
     * Return the current field value object
     * @return {[]|null}
     */
    getCurrent() {
        return this.getItems().filter(item => item.selected);
    }

    /**
     * Find an item in the list
     * @param {HTMLElement|String|Number} item
     * @return {{}}
     */
    findItem(item) {
        let display = this.options.display;
        item = item.nodeName ? item.dataset.value : item;
        return this.options.items.find(i => i[display] === item);
    }

    /**
     *
     * @param e
     * @private
     */
    _setCurrent(e) {
        let el = e.target,
            key = parseInt(el.dataset.key, 10),
            item = this.options.items.get(key);

        item.selected = el.classList.toggle('si-selected');
        this.options.items.set(key, item);
        this._trigger('change', item);
        return this;
    }

    /**
     *
     * @private
     */
    _setResultMessage() {
        let selection = this.getCurrent(),
            display = this.options.display,
            count = selection.length,
            result = '';

        switch (count) {
            case 1:
                result = selection[0][display];
                break;
            case 0:
                result = this.options.placeholder;
                break;
            default:
                result = `${selection[0][display]} ${this.options.more.replace('{X}', count - 1)}`;
        }

        this.dom.result.classList[count ? 'add' : 'remove']('si-selection');
        this.dom.result.innerHTML = result;
    }

    /**
     * Make an array of object if needed
     * @todo better 'selected' checking: what if `current` is array of objects
     * @param {Array} items
     * @param {*} current
     * @return {Map<Object>}
     * @private
     */
    _convertItems(items = [], current = null) {
        let display = this.options.display,
            map = new Map(),
            key = 0;

        items.forEach(item => {
            if (typeof item !== 'object') {
                item = {[display]: item};
            }
            item.selected = item[display] === current || current.indexOf(item[display]) > -1;
            map.set(key++, item);
        });

        return map;
    }

    /**
     * Create the HTML upon instantiation
     * @return {Node}
     * @private
     */
    _renderInit() {
        let wrap = d.createElement('div');
        wrap.className = 'si-wrap';

        this.dom.el.classList.add('si-off');
        this.dom.result = wrap.appendChild(this._renderResultDiv());

        wrap.appendChild(this._renderList());
        return this.dom.el.appendChild(wrap);
    }

    /**
     * Create the selection result element
     * @return {HTMLElement}
     * @private
     */
    _renderResultDiv() {
        let el = d.createElement('div');
        el.className = 'si-result';
        return el;
    }

    /**
     * Create the list element
     * @return {HTMLElement}
     * @private
     */
    _renderList() {
        let wrap = d.createElement('div'),
            el = d.createElement('ul'),
            maxHeight = this.options.maxHeight;

        wrap.className = 'si-list';

        if (maxHeight) wrap.style.maxHeight = maxHeight + 'px';

        el.innerHTML = this._renderListItems();

        wrap.appendChild(el);

        return wrap;
    }

    /**
     * Create the list items
     * @return {String}
     * @private
     */
    _renderListItems() {
        let items = this.options.items,
            display = this.options.display,
            list = '',
            selected;

        items.forEach((item, key) => {
            selected = item.selected ? ' si-selected' : '';
            list += `<li class="si-item${selected}" data-key="${key}">${item[display]}</li>`;
        });

        return list;
    }

    /**
     * Rearrange the list
     * @private
     */
    _sortItems() {
        let order = this.options.order === 'desc' ? 1 : -1,
            display = this.options.display;
        this.options.items.sort((a, b) => {
            if (a[display] < b[display]) return -order;
            if (a[display] > b[display]) return order;
            return 0;
        });
    }
}

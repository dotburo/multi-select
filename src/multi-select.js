import DomHelper from './dom-component.js';
import defaults from './defaults.js';

const d = document;

export default class MultiSelect extends DomHelper {
    constructor(element, options = {}) {
        super(element, options, defaults);

        if (this.options.sort) {
            this.options.items = this._sortItems(options.items);
        }

        this.options.items = options.items && options.items.length
            ? this._convertItems(options.items)
            : [];

        if (options.current && options.current.length) {
            options.current = this._convertItems(options.current);
            this._setSelected(options.current);
        }

        this._renderInit();

        this._setResultMessage();

        this._bindEvents();
    }

    /**
     * Bind the delegated dom events
     * @private
     */
    _bindEvents() {
        // Select or just unfold the options
        this.on('click', e => {
            if (e.target.classList.contains('si-item')) return this._setCurrent(e)._setResultMessage();
            this.toggle();
        }, this.el);

        // Close the dropdown if the user click outside of it
        this.on('click', e => {
            if (!this.dom.el.contains(e.target)) return this.toggle(false);
        }, d);

        // Fold up the dropdown if the user presses the Escape key
        this.on('keyup', e => {
            if (e.key === 'Escape' || e.keyCode === 27) this.toggle(false);
        }, d);
    }

    /**
     * Get all items in the list
     * @return {Object[]}
     * @public
     */
    getItems() {
        return Array.from(this.options.items.values());
    }

    /**
     * Return the current field value object
     * @param {string} key Only return a specific value from each current item
     * @return {[]|null}
     * @public
     */
    getCurrent(key = '') {
        let items = this.getItems().filter(i => i.selected);
        return !key ? items : items.map(i => i[key]);
    }

    /**
     * @todo do better: setCurrent, _setCurrent & _setSelected ...
     * @param {*|!object} currents
     * @public
     */
    setCurrent(currents) {
        const isArray = Array.isArray(currents);

        if (!currents || (isArray && !currents.length)) {
            return;
        }

        let items = this.options.items,
            display = this.options.display;

        currents = isArray ? currents : [currents];
        currents = this._convertItems(currents);

        currents.forEach(current => {
            items.forEach((item, key) => {
                if (item[display] === current[display]) {
                    this.dom.el.querySelector(`.si-item[data-key="${key}"]`).classList.add('si-selected');
                    item.selected = true;
                }
            });
        });

        this._setResultMessage();
    }

    /**
     * Find an item in the list
     * @param {HTMLElement|String|Number} item
     * @return {{}}
     * @public
     */
    findItem(item) {
        let display = this.options.display;
        item = item.nodeName ? item.dataset.value : item;
        return this.options.items.find(i => i[display] === item);
    }

    /**
     *
     * @param {Event} e
     * @param {boolean} trigger
     * @private
     */
    _setCurrent(e, trigger = true) {
        let el = e.target,
            key = parseInt(el.dataset.key, 10),
            item = this.options.items.get(key);

        item.selected = el.classList.toggle('si-selected');
        this.options.items.set(key, item);
        if (trigger) this._trigger('change', item);
        return this;
    }

    /**
     * Loop over the passed array to set selected items
     * @param {array} currents
     * @private
     */
    _setSelected(currents) {
        let items = this.options.items,
            display = this.options.display;

        currents.forEach(current => {
            items.forEach(item => {
                if (item[display] === current[display]) {
                    item.selected = true;
                }
            });
        });
    }

    /**
     * Display selection result message
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
                result = /({X})/.test(this.options.more)
                    ? `${selection[0][display]} ${this.options.more.replace('{X}', count - 1)}`
                    : this.options.more;
        }

        this.dom.result.classList[count ? 'add' : 'remove']('si-selection');
        this.dom.result.innerHTML = result;
    }

    /**
     * Make an array of object if needed
     * @todo better 'selected' checking: what if `current` is array of objects
     * @param {Array} items
     * @return {Map<Object>}
     * @private
     */
    _convertItems(items = []) {
        let display = this.options.display,
            map = new Map(),
            key = 0;

        items.forEach(item => {
            if (typeof item !== 'object') item = {[display]: item};
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
        let frag = d.createDocumentFragment();

        this.dom.el.classList.add('si-off', 'si-wrap');
        this.dom.result = frag.appendChild(this._renderResultDiv());

        frag.appendChild(this._renderList());
        return this.dom.el.appendChild(frag);
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

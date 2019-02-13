const d = document;

export default class DomComponent {
    constructor(element, options = {}, defaults = {}) {
        this.options = Object.assign({}, defaults, options);

        this._events = [];

        this.dom = {
            el: this._setElement(element)
        };
    }

    /**
     * Add/remove the toggling className
     * @param {Boolean|undefined} show
     * @return DomComponent
     */
    toggle(show = undefined) {
        let classList = this.dom.el.classList;
        if (show !== undefined) {
            classList[show ? 'remove' : 'add']('si-off');
            return this;
        }
        classList.toggle('si-off');
        return this;
    }

    /**
     * Bind a (delegated) event
     * @param {String} event
     * @param {Function} fn
     * @param {HTMLElement|Document} el
     * @return DomComponent
     */
    on(event, fn, el = null) {

        (el || this.dom.el).addEventListener(event, fn = fn.bind(this), true);

        this._events.push({
            name: event,
            fn: fn,
            el: el
        });

        return this;
    }

    /**
     * Return the main wrapping element
     * @return {Element}
     */
    getElement() {
        return this.dom.el;
    }

    /**
     * Unbind all events and nullify references
     * @return void
     */
    remove() {
        this._events = this._events.filter(event => {
            return (event.el || this.dom.el).removeEventListener(event.name, event.fn, true);
        });
        this.dom.el.parentNode.removeChild(this.dom.el);
        this.dom = this.options = null;
    }

    /**
     * Query the element in the DOM if its a string
     * @param {Element|String} el
     * @return {Element|null}
     * @protected
     */
    _setElement(el) {
        if (!el && !el.nodeType && typeof el !== 'string') {
            throw new Error('Wrong element type provided!');
        }
        if (el.nodeType) return el;
        return (this.options.parent || d).querySelector(el);
    }

    /**
     * Communicate changes
     * @param {String} name
     * @param {Object|null} detail
     * @protected
     */
    _trigger(name, detail = null) {
        let event;

        if (typeof CustomEvent === 'function') {
            event = new CustomEvent(name, {
                detail: detail
            });
        } else {
            event = d.createEvent('Event');
            event.initEvent(name, true, true);
        }

        this.dom.el.dispatchEvent(event);
    }
}

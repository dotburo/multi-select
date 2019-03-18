# MultiSelect ![](https://img.shields.io/github/tag/pecuchet/multi-select.svg?label=version&style=flat) [![Maintainability](https://api.codeclimate.com/v1/badges/5cd3d1910b240b72005c/maintainability)](https://codeclimate.com/github/pecuchet/multi-select/maintainability)

Simple multiple &lt;select&gt; box (dropdown) in vanilla Javascript  
<br>
[>_demo](https://pecuchet.github.io/multi-select/)

## Install with [npm](https://www.npmjs.com/package/@dotburo/multi-select)
```
npm i -D @dotburo/multi-select
```


## Usage
```
import MultiSelect from 'multi-select';

// Minimal parameters
let multiSelect = new MultiSelect('.multi-select', {
    items: ['A', 'B', 'C', 'D']
});

// Listen to changes 
multiSelect.on('change', e => console.log(multiSelect.getCurrent()));
```

## Available options (and their defaults)
```
items: []                           # Array of strings, numbers or objects
display: 'value'                    # If an array of objects was passed, the property to use for display in the list
current: null                       # Items to select upon instantiation
parent: null                        # Parent element, to 
maxHeight: 0                        # Maximum height of the dropdown, `0` means no constraint
sort: true                          # Whether to sort the list
order: 'desc'                       # Sort order
placeHolder: 'Select items'         # Place holder text for when nothing is selected
more: '(+{X} more)'                 # Place holder multiple selections; `{X}` will be replaced with current count;
                                    # if `{X}` is not present, `more` will replace the whole placeholder
```

## Event listening

MultiSelect triggers one event: `change`.  
Event handlers can be bound with `instance.on()` or `instance.getElement().addEventListener()`. In browsers which
support `CustomEvent`, the `detail` property of the event object contains the selected or deselected item. 
To get all currently selected items use `instance.getCurrent()`.

## Public methods

### instance.on(event, fn, el = null): instance
Listen to events, pass in and event name (`String`), a subscriber (`Function`) and optionally and event target (`Element`). 
If the latter is omitted, events are delegated to `instance.getElement()`.

### instance.toggle(show = false): instance
Show or hide the list

### instance.getElement(): HTMLElement
Return MultiSelect's outermost element 

### instance.getItems(): array
Get all the items in the list as an array of objects

### instance.getCurrent(string key): array
Return the currently selected items; if a `key` is passed, it will be used to return only the matching value of each
item object.

### instance.setCurrent(): void
Programmatically set the currently selected items
 
### instance.findItem(value): object
Find an item in the list by its value (`String|Number`)

### instance.remove(): void
Unbind all events and clean up the DOM

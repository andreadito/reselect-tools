# Reselect Tools

Tools for working with the [reselect](https://github.com/reactjs/reselect) library:
*Check selector dependencies, inputs, outputs, and recomputations at any time!*

## Getting Started

1. Install the Package

        npm install -s reselect-tools
        
2. (Optional) - Create an index of Selectors. 

2. Configure the library in your project.

3. Install the Chrome Extension.

4. Collaborate


## API

### getStateWith(func)

`getStateWith` accepts a function which returns the current state. This state is then passed into ```checkSelector```. In most cases, this will be ```store.getState()```


### registerSelectors(keySelectorObj)

Add a named selector to the graph. Set selector names as keys and selectors as values.


### Without The Extension

If you're using an unsupported browser, or aren't happy with the extension, you can still get at the data.

The dev tools bind to your app via this global:
```
  window.__RESELECT_TOOLS__
```


## License

MIT
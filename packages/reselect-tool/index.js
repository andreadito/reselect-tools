import "core-js/stable";
import "regenerator-runtime/runtime";

let _getState = null;
let _allSelectors = new Set();
let _allSelectorsTableData = [];

const _isFunction = (func) => typeof func === 'function';

const _isSelector = (selector) => (selector && selector.resultFunc) || _isFunction(selector);

const _addSelector = (selector) => {
  _allSelectors.add(selector);
};

const _getSelectorName = (selector) => {
  if (selector.selectorName) {
    return selector.selectorName
  }

  if (selector.name) { // if it's a vanilla function, it will have a name.
    return selector.name
  }

  return (selector.dependencies || []).reduce((base, dep) => {
    return base
  }, (selector.resultFunc ? selector.resultFunc : selector).toString())
};

const _getAllGoodSelectors = () => {
  let listOfSelectorsWithProps = new Set();

  // TODO: use args
  _allSelectors.forEach((selector) => {
    if(selector && selector.toString().search('props') > 0) {
      listOfSelectorsWithProps.add(selector);
    }
  });

  const difference = (setA, setB) => {
    let _difference = new Set(setA);
    for (let elem of setB) {
      _difference.delete(elem)
    }
    return _difference
  };
  return difference(_allSelectors, listOfSelectorsWithProps);
};

export function registerSelectors(selectors) {
  Object.keys(selectors).forEach((name) => {
    const selector = selectors[name];
    if (_isSelector(selector)) {
      selector.selectorName = name;
      _addSelector(selector)
    }
  });
}

export function reset() {
  _getState = null;
  _allSelectors = new Set()
}

export function checkSelector(selector) {
  if (typeof selector === 'string') {
    for (const possibleSelector of _allSelectors) {
      if (possibleSelector.selectorName === selector) {
        selector = possibleSelector;
        break
      }
    }
  }

  if (!_isFunction(selector)) {
    throw new Error(`Selector ${selector} is not a function...has it been registered?`)
  }

  const { dependencies = [] } = selector;

  const isNamed = typeof selectorName === 'string';
  const recomputations = selector.recomputations ? selector.recomputations() : 0;

  const ret = { dependencies, recomputations, isNamed, selectorName: _getSelectorName(selector) };
  const extra = {};

  Object.assign(ret, extra);

  return ret;
}

export function getAllGoodSelectorsTableData() {
  const tableData = [];
  const onlyGoodSelector = _getAllGoodSelectors();

  const mapSelectorToCell = (selectors = []) => {
    return Array.from(selectors).map((selector, index) => {

      const selectorData = checkSelector(selector);

      const {selectorName = 'noNameProvided', dependencies = [], recomputations = 0, output } = selectorData;

      const result = {
        key: `SelectorKey_${index}_${selectorName}`,
        name: selectorName,
        dependencies: mapSelectorToCell(dependencies),
        recomputations:  recomputations,
        output: output,
        selector: selector
      };

      return result;
    }
    )
  };

  tableData.push(...mapSelectorToCell(onlyGoodSelector));

  _allSelectorsTableData = tableData;

  return tableData;
}

export async function evaluateSelector(selectorName, chromeRuntimeId) {

  if (!_allSelectorsTableData) {
    getAllGoodSelectorsTableData();
  }

  const results = _allSelectorsTableData
    .filter(selector => selector.name === selectorName);

  const selector = results && results[0] && results[0].selector;

  let result = null;

  try {
    const selectorOutput = await selector(getState());
    result = { "output": selectorOutput }
  } catch(e) {
    result = { "output": e }
  }

  console.log(`RESELECT:TOOLS - Sending Data to RE-SELECT Extension: ${chromeRuntimeId}`, result);

  chrome.runtime.sendMessage(chromeRuntimeId, { data: result });
}

export function getState() {
  if(_getState) {
    return _getState();
  }
}

export function getStateWith(stateGetter) {
  _getState = stateGetter
}

if (typeof window !== 'undefined') {
  window.__RESELECT_TOOLS__ = {
    checkSelector,
    getAllGoodSelectorsTableData,
    getState,
    getStateWith,
    evaluateSelector
  }
}

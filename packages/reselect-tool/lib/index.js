"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerSelectors = registerSelectors;
exports.reset = reset;
exports.checkSelector = checkSelector;
exports.getAllGoodSelectorsTableData = getAllGoodSelectorsTableData;
exports.evaluateSelector = evaluateSelector;
exports.getState = getState;
exports.getStateWith = getStateWith;

require("core-js/stable");

require("regenerator-runtime/runtime");

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

var _getState = null;

var _allSelectors = new Set();

var _allSelectorsTableData = [];

var _isFunction = function _isFunction(func) {
  return typeof func === 'function';
};

var _isSelector = function _isSelector(selector) {
  return selector && selector.resultFunc || _isFunction(selector);
};

var _addSelector = function _addSelector(selector) {
  _allSelectors.add(selector);
};

var _getSelectorName = function _getSelectorName(selector) {
  if (selector.selectorName) {
    return selector.selectorName;
  }

  if (selector.name) {
    // if it's a vanilla function, it will have a name.
    return selector.name;
  }

  return (selector.dependencies || []).reduce(function (base, dep) {
    return base;
  }, (selector.resultFunc ? selector.resultFunc : selector).toString());
};

var _getAllGoodSelectors = function _getAllGoodSelectors() {
  var listOfSelectorsWithProps = new Set(); // TODO: use args

  _allSelectors.forEach(function (selector) {
    if (selector && selector.toString().search('props') > 0) {
      listOfSelectorsWithProps.add(selector);
    }
  });

  var difference = function difference(setA, setB) {
    var _difference = new Set(setA);

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = setB[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var elem = _step.value;

        _difference["delete"](elem);
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator["return"] != null) {
          _iterator["return"]();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }

    return _difference;
  };

  return difference(_allSelectors, listOfSelectorsWithProps);
};

function registerSelectors(selectors) {
  Object.keys(selectors).forEach(function (name) {
    var selector = selectors[name];

    if (_isSelector(selector)) {
      selector.selectorName = name;

      _addSelector(selector);
    }
  });
}

function reset() {
  _getState = null;
  _allSelectors = new Set();
}

function checkSelector(selector) {
  if (typeof selector === 'string') {
    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
      for (var _iterator2 = _allSelectors[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
        var possibleSelector = _step2.value;

        if (possibleSelector.selectorName === selector) {
          selector = possibleSelector;
          break;
        }
      }
    } catch (err) {
      _didIteratorError2 = true;
      _iteratorError2 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion2 && _iterator2["return"] != null) {
          _iterator2["return"]();
        }
      } finally {
        if (_didIteratorError2) {
          throw _iteratorError2;
        }
      }
    }
  }

  if (!_isFunction(selector)) {
    throw new Error("Selector ".concat(selector, " is not a function...has it been registered?"));
  }

  var _selector = selector,
      _selector$dependencie = _selector.dependencies,
      dependencies = _selector$dependencie === void 0 ? [] : _selector$dependencie;
  var isNamed = typeof selectorName === 'string';
  var recomputations = selector.recomputations ? selector.recomputations() : 0;
  var ret = {
    dependencies: dependencies,
    recomputations: recomputations,
    isNamed: isNamed,
    selectorName: _getSelectorName(selector)
  };
  var extra = {};
  Object.assign(ret, extra);
  return ret;
}

function getAllGoodSelectorsTableData() {
  var tableData = [];

  var onlyGoodSelector = _getAllGoodSelectors();

  var mapSelectorToCell = function mapSelectorToCell() {
    var selectors = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    return Array.from(selectors).map(function (selector, index) {
      var selectorData = checkSelector(selector);
      var _selectorData$selecto = selectorData.selectorName,
          selectorName = _selectorData$selecto === void 0 ? 'noNameProvided' : _selectorData$selecto,
          _selectorData$depende = selectorData.dependencies,
          dependencies = _selectorData$depende === void 0 ? [] : _selectorData$depende,
          _selectorData$recompu = selectorData.recomputations,
          recomputations = _selectorData$recompu === void 0 ? 0 : _selectorData$recompu,
          output = selectorData.output;
      var result = {
        key: "SelectorKey_".concat(index, "_").concat(selectorName),
        name: selectorName,
        dependencies: mapSelectorToCell(dependencies),
        recomputations: recomputations,
        output: output,
        selector: selector
      };
      return result;
    });
  };

  tableData.push.apply(tableData, _toConsumableArray(mapSelectorToCell(onlyGoodSelector)));
  _allSelectorsTableData = tableData;
  return tableData;
}

function evaluateSelector(_x, _x2) {
  return _evaluateSelector.apply(this, arguments);
}

function _evaluateSelector() {
  _evaluateSelector = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee(selectorName, chromeRuntimeId) {
    var results, selector, result, selectorOutput;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            if (!_allSelectorsTableData) {
              getAllGoodSelectorsTableData();
            }

            results = _allSelectorsTableData.filter(function (selector) {
              return selector.name === selectorName;
            });
            selector = results && results[0] && results[0].selector;
            result = null;
            _context.prev = 4;
            _context.next = 7;
            return selector(getState());

          case 7:
            selectorOutput = _context.sent;
            result = {
              "output": selectorOutput
            };
            _context.next = 14;
            break;

          case 11:
            _context.prev = 11;
            _context.t0 = _context["catch"](4);
            result = {
              "output": _context.t0
            };

          case 14:
            console.log("RESELECT:TOOLS - Sending Data to RE-SELECT Extension: ".concat(chromeRuntimeId), result);
            chrome.runtime.sendMessage(chromeRuntimeId, {
              data: result
            });

          case 16:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[4, 11]]);
  }));
  return _evaluateSelector.apply(this, arguments);
}

function getState() {
  if (_getState) {
    return _getState();
  }
}

function getStateWith(stateGetter) {
  _getState = stateGetter;
}

if (typeof window !== 'undefined') {
  window.__RESELECT_TOOLS__ = {
    checkSelector: checkSelector,
    getAllGoodSelectorsTableData: getAllGoodSelectorsTableData,
    getState: getState,
    getStateWith: getStateWith,
    evaluateSelector: evaluateSelector
  };
}
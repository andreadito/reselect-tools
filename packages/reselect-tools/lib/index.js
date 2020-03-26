"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getState = getState;
exports.getChromeRuntimeId = getChromeRuntimeId;
exports.registerSelectors = registerSelectors;
exports.reset = reset;
exports.checkSelector = checkSelector;
exports.getAllGoodSelectorsTableData = getAllGoodSelectorsTableData;
exports.setChromeRuntimeId = setChromeRuntimeId;
exports.evaluateSelector = evaluateSelector;
exports.getStateWith = getStateWith;

require("core-js/stable");

require("regenerator-runtime/runtime");

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _createForOfIteratorHelper(o) { if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (o = _unsupportedIterableToArray(o))) { var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var it, normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var _getState = null;

var _allSelectors = new Set();

var _allSelectorsTableData = [];
var _chromeRuntimeId = null;

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

    var _iterator = _createForOfIteratorHelper(setB),
        _step;

    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var elem = _step.value;

        _difference["delete"](elem);
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }

    return _difference;
  };

  return difference(_allSelectors, listOfSelectorsWithProps);
};

function createProxy() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var path = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  var cb = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : function () {};
  cb({
    state: state,
    path: path,
    action: 'read'
  });

  if (_typeof(state) !== 'object') {
    cb({
      state: state,
      path: path,
      action: 'return'
    });
    return state;
  }

  return new Proxy({}, {
    get: function get(_, key) {
      if (key === '__path__') {
        return path;
      }

      if (key === '__state__') {
        return state;
      }

      return createProxy(state[key], path.concat(key), cb);
    },
    enumerate: function enumerate() {
      cb({
        state: state,
        path: path,
        action: 'enumerate'
      });
      return Object.keys(state);
    },
    ownKeys: function ownKeys(_) {
      cb({
        state: state,
        path: path,
        action: 'enumerate'
      });
      return Object.keys(state);
    },
    has: function has(_, key) {
      cb({
        state: state,
        path: path,
        action: 'hasKey'
      });

      if (!state) {
        return undefined;
      }

      return state[key] !== 'undefined';
    },
    getOwnPropertyDescriptor: function getOwnPropertyDescriptor(target, key) {
      if (key === 'length') {
        return Object.getOwnPropertyDescriptor(target, key);
      }

      return {
        value: target[key],
        enumerable: true,
        writable: true,
        configurable: true
      };
    }
  });
}

;

function getState() {
  if (_getState) {
    return _getState;
  }
}

function getChromeRuntimeId() {
  if (_chromeRuntimeId) {
    return _chromeRuntimeId;
  }
}

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
    var _iterator2 = _createForOfIteratorHelper(_allSelectors),
        _step2;

    try {
      for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
        var possibleSelector = _step2.value;

        if (possibleSelector.selectorName === selector) {
          selector = possibleSelector;
          break;
        }
      }
    } catch (err) {
      _iterator2.e(err);
    } finally {
      _iterator2.f();
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

function setChromeRuntimeId(chromeRuntimeId) {
  _chromeRuntimeId = chromeRuntimeId;
}

function evaluateSelector(_x) {
  return _evaluateSelector.apply(this, arguments);
}

function _evaluateSelector() {
  _evaluateSelector = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(selectorName) {
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
              "output": 'no output available'
            };

          case 14:
            // console.log(`RESELECT:TOOLS - Sending Data to RE-SELECT Extension: ${chromeRuntimeId}`, result);
            chrome.runtime.sendMessage(getChromeRuntimeId(), {
              data: result
            });

          case 15:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[4, 11]]);
  }));
  return _evaluateSelector.apply(this, arguments);
}

function notifyStateOperations(operation) {
  if (typeof window !== 'undefined' && getChromeRuntimeId()) {
    window.chrome.runtime.sendMessage(getChromeRuntimeId(), {
      data: {
        slices: operation.path,
        action: operation.action
      }
    });
  }
}

function getStateWith(stateGetter) {
  _getState = createProxy(stateGetter(), [], notifyStateOperations);
}

if (typeof window !== 'undefined') {
  window.__RESELECT_TOOLS__ = {
    setChromeRuntimeId: setChromeRuntimeId,
    checkSelector: checkSelector,
    getAllGoodSelectorsTableData: getAllGoodSelectorsTableData,
    getState: getState,
    getStateWith: getStateWith,
    evaluateSelector: evaluateSelector
  };
}
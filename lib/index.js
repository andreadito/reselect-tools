'use strict';

exports.__esModule = true;
exports.evaluateSelector = undefined;

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _from = require('babel-runtime/core-js/array/from');

var _from2 = _interopRequireDefault(_from);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _set = require('babel-runtime/core-js/set');

var _set2 = _interopRequireDefault(_set);

var evaluateSelector = exports.evaluateSelector = function () {
  var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(selectorName) {
    var selector, result;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:

            console.log('evaluating...', selectorName);
            if (!_allSelectorsTableData) {
              getAllGoodSelectorsTableData();
            }

            selector = _allSelectorsTableData.filter(function (selector) {
              return selector.name === selectorName;
            })[0].selector;
            result = null;

            try {
              // const selectorOutput = await selector(getState());
              result = (0, _stringify2.default)({ "name": "John", "age": 30, "car": null });
            } catch (e) {
              result = (0, _stringify2.default)({ "name": "John", "age": 30, "car": null });
            }
            console.log(result);

            return _context.abrupt('return', result);

          case 7:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function evaluateSelector(_x2) {
    return _ref.apply(this, arguments);
  };
}();

exports.registerSelectors = registerSelectors;
exports.reset = reset;
exports.checkSelector = checkSelector;
exports.getAllGoodSelectorsTableData = getAllGoodSelectorsTableData;
exports.getState = getState;
exports.getStateWith = getStateWith;

var _serializr = require('serializr');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _getState = null;
var _allSelectors = new _set2.default();
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
  var listOfSelectorsWithProps = new _set2.default();

  _allSelectors.forEach(function (selector) {
    if (selector.prototype.constructor.toString().search('props') > 0) {
      listOfSelectorsWithProps.add(selector);
    }
  });

  var difference = function difference(setA, setB) {
    var _difference = new _set2.default(setA);
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = (0, _getIterator3.default)(setB), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var elem = _step.value;

        _difference.delete(elem);
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }

    return _difference;
  };
  var _allSelectorsWithoutProps = difference(_allSelectors, listOfSelectorsWithProps);

  return _allSelectorsWithoutProps;
};

function registerSelectors(selectors) {
  (0, _keys2.default)(selectors).forEach(function (name) {
    var selector = selectors[name];
    if (_isSelector(selector)) {
      selector.selectorName = name;
      _addSelector(selector);
    }
  });
}

function reset() {
  _getState = null;
  _allSelectors = new _set2.default();
}

function checkSelector(selector) {
  if (typeof selector === 'string') {
    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
      for (var _iterator2 = (0, _getIterator3.default)(_allSelectors), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
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
        if (!_iteratorNormalCompletion2 && _iterator2.return) {
          _iterator2.return();
        }
      } finally {
        if (_didIteratorError2) {
          throw _iteratorError2;
        }
      }
    }
  }

  if (!_isFunction(selector)) {
    throw new Error('Selector ' + selector + ' is not a function...has it been registered?');
  }

  var _selector = selector,
      _selector$dependencie = _selector.dependencies,
      dependencies = _selector$dependencie === undefined ? [] : _selector$dependencie;


  var isNamed = typeof selectorName === 'string';
  var recomputations = selector.recomputations ? selector.recomputations() : 0;

  var ret = { dependencies: dependencies, recomputations: recomputations, isNamed: isNamed, selectorName: _getSelectorName(selector) };
  var extra = {};

  (0, _assign2.default)(ret, extra);

  return ret;
}

function getAllGoodSelectorsTableData() {
  var tableData = [];
  var onlyGoodSelector = _getAllGoodSelectors();

  var mapSelectorToCell = function mapSelectorToCell() {
    var selectors = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

    return (0, _from2.default)(selectors).map(function (selector) {

      var selectorData = checkSelector(selector);

      var _selectorData$selecto = selectorData.selectorName,
          selectorName = _selectorData$selecto === undefined ? 'noNameProvided' : _selectorData$selecto,
          _selectorData$depende = selectorData.dependencies,
          dependencies = _selectorData$depende === undefined ? [] : _selectorData$depende,
          _selectorData$recompu = selectorData.recomputations,
          recomputations = _selectorData$recompu === undefined ? 0 : _selectorData$recompu,
          output = selectorData.output;


      return {
        name: selectorName,
        dependencies: mapSelectorToCell(dependencies),
        recomputations: recomputations,
        output: output,
        selector: selector
      };
    });
  };

  tableData.push.apply(tableData, (0, _toConsumableArray3.default)(mapSelectorToCell(onlyGoodSelector)));

  _allSelectorsTableData = tableData;

  return tableData;
}

function getState() {
  if (_getState) {
    return _getState();
  }
}

function getStateWith(stateGetter) {
  _getState = stateGetter;
}

// hack for devtools
/* istanbul ignore if */
if (typeof window !== 'undefined') {
  window.__RESELECT_TOOLS__ = {
    checkSelector: checkSelector,
    getAllGoodSelectorsTableData: getAllGoodSelectorsTableData,
    getState: getState,
    getStateWith: getStateWith,
    evaluateSelector: evaluateSelector
  };
}
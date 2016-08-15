var _nativeTypesConfig;

function _defineEnumerableProperties(obj, descs) { for (var key in descs) { var desc = descs[key]; desc.configurable = desc.enumerable = true; if ("value" in desc) desc.writable = true; Object.defineProperty(obj, key, desc); } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

import * as NativeTypes from './NativeTypes';

function getDataFromDataTransfer(dataTransfer, typesToTry, defaultValue) {
  var result = typesToTry.reduce(function (resultSoFar, typeToTry) {
    return resultSoFar || dataTransfer.getData(typeToTry);
  }, null);

  return result != null ? // eslint-disable-line eqeqeq
  result : defaultValue;
}

var nativeTypesConfig = (_nativeTypesConfig = {}, _nativeTypesConfig[NativeTypes.FILE] = {
  exposeProperty: 'files',
  matchesTypes: ['Files'],
  getData: function getData(dataTransfer) {
    return Array.prototype.slice.call(dataTransfer.files);
  }
}, _nativeTypesConfig[NativeTypes.URL] = {
  exposeProperty: 'urls',
  matchesTypes: ['Url', 'text/uri-list'],
  getData: function getData(dataTransfer, matchesTypes) {
    return getDataFromDataTransfer(dataTransfer, matchesTypes, '').split('\n');
  }
}, _nativeTypesConfig[NativeTypes.TEXT] = {
  exposeProperty: 'text',
  matchesTypes: ['Text', 'text/plain'],
  getData: function getData(dataTransfer, matchesTypes) {
    return getDataFromDataTransfer(dataTransfer, matchesTypes, '');
  }
}, _nativeTypesConfig);

export function createNativeDragSource(type) {
  var _nativeTypesConfig$ty = nativeTypesConfig[type];
  var exposeProperty = _nativeTypesConfig$ty.exposeProperty;
  var matchesTypes = _nativeTypesConfig$ty.matchesTypes;
  var getData = _nativeTypesConfig$ty.getData;


  return function () {
    function NativeDragSource() {
      var _item, _mutatorMap;

      _classCallCheck(this, NativeDragSource);

      this.item = (_item = {}, _mutatorMap = {}, _mutatorMap[exposeProperty] = _mutatorMap[exposeProperty] || {}, _mutatorMap[exposeProperty].get = function () {
        console.warn( // eslint-disable-line no-console
        'Browser doesn\'t allow reading "' + exposeProperty + '" until the drop event.');
        return null;
      }, _defineEnumerableProperties(_item, _mutatorMap), _item);
    }

    NativeDragSource.prototype.mutateItemByReadingDataTransfer = function mutateItemByReadingDataTransfer(dataTransfer) {
      delete this.item[exposeProperty];
      this.item[exposeProperty] = getData(dataTransfer, matchesTypes);
    };

    NativeDragSource.prototype.canDrag = function canDrag() {
      return true;
    };

    NativeDragSource.prototype.beginDrag = function beginDrag() {
      return this.item;
    };

    NativeDragSource.prototype.isDragging = function isDragging(monitor, handle) {
      return handle === monitor.getSourceId();
    };

    NativeDragSource.prototype.endDrag = function endDrag() {};

    return NativeDragSource;
  }();
}

export function matchNativeItemType(dataTransfer) {
  var dataTransferTypes = Array.prototype.slice.call(dataTransfer.types || []);

  return Object.keys(nativeTypesConfig).filter(function (nativeItemType) {
    var matchesTypes = nativeTypesConfig[nativeItemType].matchesTypes;

    return matchesTypes.some(function (t) {
      return dataTransferTypes.indexOf(t) > -1;
    });
  })[0] || null;
}
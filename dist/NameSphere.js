import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { TrackballControls, Text } from '@react-three/drei';
import * as THREE from 'three';

function _extends() {
  _extends = Object.assign ? Object.assign.bind() : function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
  return _extends.apply(this, arguments);
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

function _iterableToArrayLimit(r, l) {
  var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
  if (null != t) {
    var e,
      n,
      i,
      u,
      a = [],
      f = !0,
      o = !1;
    try {
      if (i = (t = t.call(r)).next, 0 === l) {
        if (Object(t) !== t) return;
        f = !1;
      } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0);
    } catch (r) {
      o = !0, n = r;
    } finally {
      try {
        if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return;
      } finally {
        if (o) throw n;
      }
    }
    return a;
  }
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
  return arr2;
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
}

function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;
  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }
  return target;
}

function _objectWithoutProperties(source, excluded) {
  if (source == null) return {};
  var target = _objectWithoutPropertiesLoose(source, excluded);
  var key, i;
  if (Object.getOwnPropertySymbols) {
    var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
    for (i = 0; i < sourceSymbolKeys.length; i++) {
      key = sourceSymbolKeys[i];
      if (excluded.indexOf(key) >= 0) continue;
      if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
      target[key] = source[key];
    }
  }
  return target;
}

var _excluded = ["children", "color", "hoveredColor"];

/**
 * Word component represents a single word in the sphere.
 * It handles hovering effects and renders the word using Three.js text rendering.
 */
function Word(_ref) {
  var children = _ref.children,
    color = _ref.color,
    hoveredColor = _ref.hoveredColor,
    props = _objectWithoutProperties(_ref, _excluded);
  // Reference for the word component
  var ref = useRef();

  // State to manage hover effect
  var _useState = useState(false),
    _useState2 = _slicedToArray(_useState, 2),
    hovered = _useState2[0],
    setHovered = _useState2[1];

  // Handler for mouse over
  var over = function over(e) {
    e.stopPropagation();
    setHovered(true);
  };

  // Handler for mouse out
  var out = function out() {
    return setHovered(false);
  };

  // Set cursor style based on hover state
  useEffect(function () {
    if (hovered) document.body.style.cursor = "pointer";
    return function () {
      return document.body.style.cursor = "auto";
    };
  }, [hovered]);

  // Rotate the word based on camera's quaternion and apply color based on hover state
  useFrame(function (_ref2) {
    var camera = _ref2.camera;
    ref.current.quaternion.copy(camera.quaternion);
    ref.current.material.color.set(hovered ? hoveredColor : color);
  });

  // Render the word
  return /*#__PURE__*/React.createElement(Text, _extends({
    ref: ref,
    onPointerOver: over,
    onPointerOut: out,
    onClick: function onClick() {
      return console.log("clicked");
    }
  }, props), children);
}

/**
 * Cloud component generates the sphere of words.
 * It distributes the words evenly on a sphere.
 */
function Cloud(_ref3) {
  var count = _ref3.count,
    radius = _ref3.radius,
    words = _ref3.words,
    color = _ref3.color,
    hoveredColor = _ref3.hoveredColor;
  // Logic to generate word components without useMemo
  var wordComponents = [];
  var spherical = new THREE.Spherical();
  var phiSpan = Math.PI / (count + 1);
  var thetaSpan = Math.PI * 2 / count;
  var k = 0;
  for (var i = 1; i < count + 1; i++) for (var j = 0; j < count; j++) {
    wordComponents.push({
      position: new THREE.Vector3().setFromSpherical(spherical.set(radius, phiSpan * i, thetaSpan * j)),
      word: words[k % words.length]
    });
    k++;
  }

  // Render the word components
  return /*#__PURE__*/React.createElement(React.Fragment, null, wordComponents.map(function (_ref4, index) {
    var position = _ref4.position,
      word = _ref4.word;
    return /*#__PURE__*/React.createElement(Word, {
      key: index,
      position: position,
      color: color,
      hoveredColor: hoveredColor
    }, word);
  }));
}

/**
 * NameSphere component represents the main component for the sphere of words.
 * It takes various properties to customize the sphere.
 */
var NameSphere = function NameSphere(_ref5) {
  var _ref5$count = _ref5.count,
    count = _ref5$count === void 0 ? 5 : _ref5$count,
    _ref5$radius = _ref5.radius,
    radius = _ref5$radius === void 0 ? 15 : _ref5$radius,
    _ref5$words = _ref5.words,
    words = _ref5$words === void 0 ? [] : _ref5$words,
    _ref5$color = _ref5.color,
    color = _ref5$color === void 0 ? "black" : _ref5$color,
    _ref5$hoveredColor = _ref5.hoveredColor,
    hoveredColor = _ref5$hoveredColor === void 0 ? "#e1af16" : _ref5$hoveredColor,
    _ref5$width = _ref5.width,
    width = _ref5$width === void 0 ? "100%" : _ref5$width,
    _ref5$height = _ref5.height,
    height = _ref5$height === void 0 ? "100vh" : _ref5$height;
  return /*#__PURE__*/React.createElement("div", {
    className: "cloud"
  }, /*#__PURE__*/React.createElement(Canvas, {
    style: {
      width: width,
      height: height
    }
  }, /*#__PURE__*/React.createElement("fog", {
    attach: "fog",
    args: ["#202025", 0, 80]
  }), /*#__PURE__*/React.createElement(Cloud, {
    count: count,
    radius: radius,
    words: words,
    color: color,
    hoveredColor: hoveredColor
  }), /*#__PURE__*/React.createElement(TrackballControls, null)));
};

export { NameSphere as default };
//# sourceMappingURL=NameSphere.js.map

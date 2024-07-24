---
title: Babel 编译的 loose 模式简述
published: 2021-01-20
description: "babel loose mode"
image: ""
tags: ["Babel"]
category: "Tech"
draft: false
---

## Contents

## 前言

我们都知道，`babel` 可以将 `es6` 的代码转换为 `es5` 的代码。其中`presets` 有两种模式可以选择。

将代码转换为最接近 `es6` 规范的正常模式 `loose: false`，他能保证转换前后的语义是一直的
将代码转换为更简单的 `es5` 模式 `loose: true`

我们项目用的是 `loose: true`

我们举一个具体的例子

下面 `es6` 的 `class` 语法，

```
class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    toString() {
        return `(${this.x}, ${this.y})`;
    }
}
const point = new Point(1,2);

//es6规范规定，class上面的方法是不可枚举的
for( let i in point ) { console.log(i) } //x,y
```
如果宽松模式 `loose:true` 模式转换的代码，是这样

```
var Point = /*#__PURE__*/function () {
  "use strict";

  function Point(x, y) {
    this.x = x;
    this.y = y;
  }

  var _proto = Point.prototype;

  _proto.toString = function toString() {
    return "(" + this.x + ", " + this.y + ")";
  };

  return Point;
}();
for( var i in point ) { console.log(i) } //x,y,toString
```

如果是严格模式 `loose:false`
```
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
require("core-js/modules/es.symbol.js");
require("core-js/modules/es.symbol.description.js");
require("core-js/modules/es.symbol.iterator.js");
require("core-js/modules/es.symbol.to-primitive.js");
require("core-js/modules/es.error.cause.js");
require("core-js/modules/es.array.concat.js");
require("core-js/modules/es.array.iterator.js");
require("core-js/modules/es.date.to-primitive.js");
require("core-js/modules/es.number.constructor.js");
require("core-js/modules/es.object.to-string.js");
require("core-js/modules/es.string.iterator.js");
require("core-js/modules/web.dom-collections.iterator.js");
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var Point = /*#__PURE__*/function () {
  "use strict";

  function Point(x, y) {
    _classCallCheck(this, Point);
    this.x = x;
    this.y = y;
  }
  return _createClass(Point, [{
    key: "toString",
    value: function toString() {
      return "(".concat(this.x, ", ").concat(this.y, ")");
    }
  }]);
}();
var point = new Point(1, 2);
```

[repl-link](https://babeljs.io/repl#?browsers=ie%2011&build=&builtIns=usage&corejs=3.21&spec=false&loose=false&code_lz=MYGwhgzhAEAKD2BLAdgF2gbwFDV9Y8yEqATgK7CrwkAUAHgDTQCeAlJjnl6gBaIQA6OtAC80OgG5OXXL34DmollK4BfadCoBlUigDmNdthl4SAU1RkSyaAAMaAEgxzBdVUycuFq1rZV51dQIidAAHJDQlZDMAdzgI1BoARgYAJlYJIA&debug=false&forceAllTransforms=false&modules=false&shippedProposals=false&evaluate=false&fileSize=false&timeTravel=false&sourceType=script&lineWrap=false&presets=env%2Cstage-3&prettier=false&targets=&version=7.24.10&externalPlugins=%40babel%2Fplugin-transform-parameters%407.23.3&assumptions=%7B%7D)

我们可以观察到，宽松模式产生了比较简单的 `es5` 代码，但是和规范定义有些差别。正常模式则会将这些方法定义翻译为 `Object.defineProperty` ，并设置成不可枚举，和直接运行 `es6` 代码得到相同的结果。

## 总结

- `loose` 模式可以产生更简单的代码，类似手写 `es6` ，运行效率更高。如果后续使用 `es6` 原生模式运行项目，可能会有意想不到的**bug**
- 正常模式使用复杂的 `es5` 代码去模拟 `es6` 的规范，运行效率稍稍下降，但如果后续使用 `es6` 原生模式运行项目，行为基本上是一致的。
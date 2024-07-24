---
title: javascript 反调试
published: 2022-03-10
description: ""
image: ""
tags: ["debugger"]
category: "Tech"
draft: false
---

## Contents

## 背景

`js` 代码在客户端运行，`chrome dev tools`提供了完善的调试能力。

假如要做一个考试系统或者学习系统，客户端代码必然掺杂许多内部实现逻辑，如题目下发，做题，提交答案等等。开发者肯定是不想让第三方了解内部实现原理。

这里介绍几种 `js` 反调试技术。如检测调试到就上报系统、检测调试到页面就清空不运行等等，增大破解难度。

:::tip 
当破解成本大于自身信息价值的时候，那么就满足了计算安全，破解者就少。
:::

## Time Diff

```
var startTime = performance.now();
startMaliciousCode();
var stopTime = performance.now();
if ((stopTime - startTime) > 1000) {
    alert("Debugger detected!")
}
```

## Chrome Getter 

```
let div = document.createElement('div');
console.log(div);
Object.defineProperty(div, "id", {get: () => { alert("Dev Tools detected!"); }});
```

## Code Integrity

```
function hashCode (s) {
    var hash = 0;
    if (s.length == 0) {
        return hash;
    }
    for (var i = 0; i < s.length; i++) {
        var char = s.charCodeAt(i);
        hash = ((hash<<5)-hash)+char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
}

function start() {
    alert('steal cookies!');
}

function main() {
    if (hashCode(start.toString()) !== -1968638942) return;
    start();
}

main()
```
---
title: 在 JavaScript 模块中导入非 JavaScript 资源
published: 2023-11-28
description: "Import Assertions Syntax"
image: ""
tags: ["ECMA"]
category: "Tech"
draft: false
---

## Contents

## 导入断言（Import Assertions）

最初的 `Import Assertions` 导入断言提案规定 `JavaScript` 模块能够通过显式的类型断言来导入非 `JavaScript` 资源。这对于处理各种类型的模块（尤其是 `JSON` 模块）非常重要。

其语法如下：

```
import json from "./foo.json" assert { type: "json" };
```

:::note
`Import Assertions`语法提案在`v8引擎 v12.3`实装，计划于`v12.6`版本取消对应的支持。

2020 年 9 月，`Import Assertions`提案更新由`Stage 2`阶段进入`Stage 3`阶段

2023 年 2 月，`Import Assertions`提案更新为导入属性`Import Attributes`，并从`Stage 3`阶段撤回至`Stage 2`，极为少见的撤回了多个浏览器引擎已经支持的特性语法提案

2023 年 3 月，`Import Assertions`提案更新为`Import Attributes`，并进入`Stage 3`阶段
:::


### 导入断言（Import Assertions）提案的初衷

然而，有人担心在导入 `JSON` 模块和无法执行代码的类似模块类型时可能会发生权限提升。当脚本导入它打算作为 `JSON` 模块的内容时，如果响应服务器意外提供了不同的 `MIME` 类型，则可能会导致代码意外执行。解决方案是在 `MIME` 类型之外的某个地方以某种方式指示模块是 `JSON`，或者一般来说，不执行。导入断言提供了这样做的方法。除了 `JSON` 模块之外，受此安全问题阻止的拟议 `ES` 模块类型还包括 `CSS` 模块和可能的 `HTML` 模块。

### 导入断言（Import Assertions）存在的问题

但是，仅断言语义有一个致命缺陷。在 Web 上，`HTTP` 请求的形状因所请求资源的类型而异。例如，标头`Accept`会影响响应的 `MIME` 类型，而`Sec-Fetch-Dest`元数据标头会影响 Web 服务器是接受还是拒绝请求。由于导入断言无法影响如何加载模块，因此它无法更改 HTTP 请求的形状。所请求资源的类型还会影响使用哪些内容安全策略：导入断言无法与 Web 的安全模型正确配合使用。

## 更新后的提案：导入属性（Import Attributes）

### 新语法

将关键字从`assert`更改为`with`

```
import json from "./foo.json" with { type: "json" };
```

动态导入

```
import("foo.json", { with: { type: "json" } })
```

:::CAUTION
`Eslint`不支持解析改语法，因为其仅支持 `State 4`阶段的提案

`Typesctipt`支持该语法

`Chrome 123`以及`Node v20.10.0`后原生支持该语法
:::

### 差异与改进

- 允许`Import Assertions`导入属性影响模块加载
  
这是 TC39 根据 HTML 反馈制定的主要目标。属性现在可以成为缓存键的一部分（以前可以，但不鼓励这样做），并且它们可用于影响模块的获取/解释方式。

- 尽早规定不支持属性导入的异常抛出
  
为了最大限度地提高可移植性，导入断言提案的先前版本忽略了主机不支持的任何断言。这是最好的选择，因为除非有人明确期望断言抛出，否则可以继续跨环境工作。现在导入属性可以改变导入模块的结果，忽略它们可能会完全改变模块的运行时行为（例如想想`type: "css-inject-global"`vs `type: "css-module"`），最好尽早抛出出错。

## 参考资料

- https://v8.dev/features/import-attributes
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import
- https://github.com/tc39/proposal-import-attributes

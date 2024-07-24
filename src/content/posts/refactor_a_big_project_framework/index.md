---
title: 巨型项目重构记录（框架）
published: 2022-03-21
description: "Ext 迁移 Vue"
image: ""
tags: ["Ext", "Vue"]
category: "Tech"
draft: false
---

## Contents

## 概要

项目使用的 Ext 框架已经有10年以上历史。目前前端界知道使用过该框架的人非常少，而且难度大，导致上手成本非常高。一个从来没有做到 Ext 的新手至少要熟悉一个月以上，也只能处理纯粹的表单表格这种页面，对于稍微炫一点的页面无能为力，这时效率就非常低了。此前由于这些原因也导致人员培养困难、招不到人接手、公司内部只有少数前端熟悉该框架、新人较排斥。业务组之间协调人力由于框架上的差异也造成较大风险。

## 行动

重构不得不进行，有两种重构方式

首先，由 `Framework` 提供的基础功能有

- 路由
- 全局数据
- 页面导航框架
- 全局告警
- 页面多开
- 10 more

### Ext 嵌入 Vue

Ext作为框架内嵌 vue 

用简单代码来描述的话，仅需改造`LazyPageLoader`，使得它可以创建一个空白节点，装载`vue示例`上去，并在全局数据变化的时候强制让`VuePage`去`reload`
```
<ExtFramework>
  <LazyPageLoader>
    <ExtPage1 />
    <ExtPage2 />
    <ExtPage3 />
    <VuePage1 />
  </LazyPageLoader>
</ExtFramework>;
```

1. 前期风险较小，不需要改原始的项目框架，只针对新的模块创建一个 Ext 容器将 Vue 挂载进去
2. 最终并不能将 Ext 框架舍弃，首先你还是得会用 Ext 去创建一个页面
3. 项目里面很多复杂的业务组件，换vue不现实；不换最终将变成Ext里面插入vue，vue里面又插入Ext
4. 后面如果像去掉 Ext 外壳将对整个项目产生较大风险，测试量大。


### Vue 嵌入 Ext

Ext作为框架内嵌 vue 

则需要改造全部由`Framework`提供的能力，但是改造的也会更彻底

```
<VueFramework>
  <LazyPageLoader>
    <VuePage1 />
    <ExtLoader>
      <ExtPage1 />
    </ExtLoader>
    <ExtLoader>
      <ExtPage2 />
    </ExtLoader>
  </LazyPageLoader>
</VueFramework>;

```

1. 可将复杂的Ext业务组件直接用Vue包裹起来，不需要特意去维护。
2. 风险前移，只要前期预研方案产出充分，后期将基本不会对项目产生不可预知的风险，最终可实现逐步全部替换成新框架。
3. 需要将原项目中所有以前的Ext载入流程全换成vue
4. 原渲染形式将受较大影响

方案一属于风险前移型，前期做好充分的工作，后期将随心所欲；方案二属于风险后置型，要不就一直依附在Ext框架上，要不就后期处理原framework的逻辑




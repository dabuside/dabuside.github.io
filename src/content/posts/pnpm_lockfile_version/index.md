---
title: pnpm lockfile 的不兼容性
published: 2023-10-22
description: ""
image: ""
tags: ["pnpm"]
category: "Tech"
draft: false
---

## Contents

## 问题
由于 `npm` 包管理工具较为低效，前端圈出现了很多热门的第三方包管理工具。

如`pnpm`，`yarn`。这些依赖包管理工具为了高效安装、解析依赖包，均会生成独特的`lock`锁文件。用来指定一个项目中成千上万直接依赖包、间接依赖包的版本信息。

然而，这些独特的`lock`锁文件不仅无法跨工具兼容，还经常无法同工具跨版本兼容。即导致安装后依赖的版本与锁文件的版本不一致，导致项目无法启动。


如
- `pnpm` 生成的 `pnpm-lock.yaml` 文件，无法被`yarn`，`npm`等工具 1:1兼容，需要使用 `pnpm` 才能安装
- `pnpm v6.35.1` 生成的 `pnpm-lock.yaml` 文件 `lockfileVersion: 5.3`，无法被高版本 `pnpm v7` 读取，也无法被低版本 `pnpm v5` 读取，甚至跨中版本仍有可能读取失败。

:::caution
`pnpm` 锁因为不兼容而读取解析失败的时候，会无视锁文件信息，重新解析依赖关系，并再次生成`lockfile`。因此，很多项目换包管理器版本重装依赖后，会导致项目无法启动
:::


公司内部项目众多，有的工程需要使用`pnpm@6.35.1`，有的要使用`pnpm@8.5.1`，有的要使用`yarn@classic`。

A项目需要 *pnpm@6.35.1*

B项目需要 *pnpm@8.5.1*

C项目要需要 *yarn@classic*

由于包管理工具是全局安装的，如果出现两个项目，需要同一个包管理工具的不同版本时，就需要重新安装对应版本的依赖工具，再进行依赖安装、更新。十分麻烦，而且经常会忘记。若使用了错误的包管理工具进行安装依赖，会导致整个依赖树被重新创建，还得删除整个`node_modules`后切换正确的包管理工具再进行安装依赖。


## 解决方案

对此，`node` 官方开发了 [corepack](https://github.com/nodejs/corepack) 包管理工具。在安装、更新依赖之前，可以自动下载（激活）指定的包管理工具，再进行安装。即可实现同时使用一个包管理工具的不同版本。

我们仅需 `node > 14.19.0` 并启用 *corepack*  `corepack enable`。
随后在`package.json`文件写入
```
{
  "packageManager": "<package manager name>@<version>"
} 
```
如`"packageManager": "pnpm@8.5.1"`

## 内网使用

当`corepack`遇到指定的包管理版本工具，本地不存在的时候，`corepack`便会尝试从官方源`https://registry.npmjs.org/`获取。`corepack`支持更换源，但是我们内网源的网络协议是`http`的。`corepack`并没有提供支持 [issue](https://github.com/nodejs/corepack/issues/293)。

:::note 
内网开发真是艰难，很多问题根本不是问题，但是在内网就是个大坑
:::

对于离线安装，`corepack`提供了`hydrate`的安装形式

1. 在能联网的电脑，执行`corepack prepare <package manager name>@<version> -o `并将生成的文件`corepack.tgz`拷贝至内网

2. 在内网，执行`corepack hydrate <path/to/corepack.tgz>`，即可离线安装对应版本的包管理工具。

至此，在指定了`packageManager`的项目内安装依赖，`corepack`会自动切换到所需的版本，从而保证安装出正确的依赖。
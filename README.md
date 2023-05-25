# Calendar-heatmap
思源笔记-日历热力图

针对[思源笔记](https://b3log.org/siyuan/) 做的一个日历热力图插件，对当年内容块进行统计

> **重要**：该插件统计的是当日创建的所有内容块，而不是统计的当日创建的文件多少，如需了解内容块的概念，可去思源笔记帮助文档中了解内容块

## 功能

1. 热力图可统计当年所创建的所有内容块(基础功能)

2. 可只统计当年日记(指daily note)中所创建的内容快(热力图设置中启用此选项)

3. 可忽略文件统计(热力图设置中启用此选项)

> **当不想统计某些文件中的内容时，可使用此配置，此配置使用后会将只统计日记选项关闭，当向再次启用日记选项时，需将此区域内容清空**

案例一：

如果现在有这样几个文件

```
今日笔记
摘抄文件
数学相关
英语相关
```

如果现在不想要热力图统计“今日笔记”和"数学相关",需要像下面这样做

```
今日笔记,数学相关
```

文件名与文件名之间需要用英文逗号隔开,这样热力图就会忽略它们以及下面的子文件

案例二：

如果有以下文件：

```
test01
test02
test03
```

如果同时有这样几个文件，如果你想同时忽略上面三个文件，那么你可以这样做

```text
test
```

这样做就会同时忽略上面三个文件，同时三个文件下的子文件也会被忽略，当然如果只想忽略test01,那么只能写全文件名称




## 怎么安装？

`设置`-`集市`-`插件`

## 怎么启用？

> 思源笔记2.8.8及以前，下载后默认为非启用状态，所以需要手动启用

`设置`-`集市`-`已下载`-`插件`

## 如果使用过程中出现问题怎么办？

如果使用过程中出现与本插件相关的错误，请到 `https://github.com/svtardust/Calendar-heatmap/issues` 页面下点击New issue 提交问题及问题信息

## 通知
Calendar-heatmap 版本v0.0.3（包含）以前为挂件版本，如果想用使用可以去https://github.com/svtardust/Calendar-heatmap/releases/tag/v0.0.3
下载。

## 变更日志

[CHANGELOG](CHANGELOG.md)

# Calendar-heatmap
思源笔记-日历热力图插件

针对[思源笔记](https://b3log.org/siyuan/) 做的一个日历热力图插件，可统计最近12个月每日所创建的内容块

> **重要**：该插件统计的是当日创建的所有内容块，而不是统计的当日创建的文件多少，如需了解内容块的概念，可去思源笔记帮助文档中了解内容块

## 功能

1. **基础**：热力图可统计最近12个月每日所创建的内容块，可查看今日创建多少内容块，可查看今日修改多少内容块

2. **日记模式**：可只统计最近12个月日记(指daily note)中所创建的内容快(热力图设置中启用此选项 **仅支持使用默认格式创建的日记** )

3. **忽略文件模式** ： 可忽略文件统计(热力图设置中启用此选项)

> **当只想统计日记时，可启用日记模式，该模式启用后，忽略文件模式区域会被清空，热力图需要手动刷新方可正常显示，当想忽略文件时，可使用忽略文件模式，可按照案例一和案例二操作，同时会关闭日记模式，同样热力图刷新后会正常显示**

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

## 如果卸载或关闭热力图插件后，图标仍存在怎么办？

0.1.7版本修复了这个问题，关闭热力图后图标也会消失，如果仍存在问题请手动重启思源笔记，如果可以请提下issuse

## 如果使用过程中出现问题怎么办？

如果使用过程中出现与本插件相关的错误，请到 [https://github.com/svtardust/Calendar-heatmap/issues](https://github.com/svtardust/Calendar-heatmap/issues) 页面下点击New issue 提交问题及问题信息

## 通知
Calendar-heatmap 版本v0.0.3（包含）以前为挂件版本，如果想用使用可以去https://github.com/svtardust/Calendar-heatmap/releases/tag/v0.0.3
下载。

## 变更日志

**本次内容主要更新**

1. 移除刷新按钮，目前来说刷新按钮没有用
2. 调整显示日期，将显示当年每日内容块，调整为显示最近12个月每日内容块
3. 修复日期所显示内容计数与热力图显示内容块不同步问题
4. 新增可查看今日修改多少内容块

具体可看[变更日志](CHANGELOG.md)

## 开源协议

[GNU General Public License v3.0](LICENSE)


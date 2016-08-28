---
title: \\[译\\]什么是构建工具
---

**stackoverflow上 [What is a build tool?] 的一个回答**

# 什么是构建工具

构建工具是一个把源代码生成可执行应用程序的过程自动化的程序（例如Android app生成apk）。构建包括编译、连接跟把代码打包成可用的或可执行的形式。

基本上构建的自动化是编写或使一大部分任务自动执行的一个动作，而这些任务则是软件开发者的日常，像是：

1. 下载依赖
2. 将源代码编译成二进制代码
3. 打包生成的二进制代码
4. 进行单元测试
5. 部署到生产系统

# 为什么要使用构建工具或构建自动化

在小型项目中，开发者往往手动调用构建过程，这样在大型的项目中很不实用，在构建过程中难以跟踪什么需要被构建、按照什么顺序构建以及项目中存在哪些依赖。使用自动化工具会使构建过程更为连续。

# 各种现有构建工具（只列举了部分）

1. For java - Ant,Maven,Gradle.
2. For .NET framework - NAnt
3. c# - MsBuild.

# 深入阅读

1. [Build automation][] （有中文版，但是不详细）
2. [List of build automation software][]


就做了一点微小的工作，谢谢大家。


# 原文地址

http://stackoverflow.com/questions/7249871/what-is-a-build-tool




[What is a build tool?]: http://stackoverflow.com/questions/7249871/what-is-a-build-tool
[Build automation]: https://en.wikipedia.org/wiki/Build_automation
[List of build automation software]: https://en.wikipedia.org/wiki/List_of_build_automation_software

---
title: ECMAScript中关于如何获取this的定义
categories: 前端 JavaScript
tags: ECMAScript JavaScript this
---

**文章中一些名词的翻译存疑，没有查过正式的中文名称**

**前面都是具体过程的解释，懒得看可以直接看[获取思路][]**

**有关this的取值请移步[JavaScript笔记——this的取值][]**

# 获取this的过程

## Runtime Semantics: Evaluation

1. Return ResolveThisBinding();

## ResolveThisBinding()

> The abstract operation ResolveThisBinding determines the binding of the keyword this using the LexicalEnvironment of the running execution context. ResolveThisBinding performs the following steps:

抽象操作ResolveThisBinding通过[running execution context][]中的LexicalEnvironment（词法环境？）来决定关键字this的绑定,执行以下两个步骤：

1. Let envRec be [GetThisEnvironment()][];  //获取当前环境
2. Return envRec.[GetThisBinding()][];  //返回当前环境记录中this的绑定

## GetThisEnvironment()

> The abstract operation GetThisEnvironment finds the Environment Record that currently supplies the binding of the keyword this. GetThisEnvironment performs the following steps:

抽象操作GetThisEnvironment寻找当前提供关键字this绑定的[Environment Record][]（环境记录？）,执行以下步骤：

1. Let lex be the running execution context’s LexicalEnvironment.
2. Repeat
	a. Let envRec be lex’s EnvironmentRecord.  //获取当前环境记录
	b. Let exists be envRec.[HasThisBinding()][].  //判断当前环境记录中是否建立了this绑定
	c. If exists is true, return envRec.  //是，则返回当前环境记录
	d. Let outer be the value of lex’s outer environment reference.  //否，则定义outer为outer Lexical Environment
	e. Let lex be outer.  //lex = outer，继续循环

*步骤2的循环总是会终止，因为在environments列表中总是以拥有this的绑定的[the global environment][]结尾*

# 一些方法及Environment、Context的解释

## GetThisBinding()

> 	Return the value of this Environment Record’s this binding. Throws a ReferenceError if the this binding has not been initialized.

返回Environment Record的this的绑定，如果未初始化绑定则抛出ReferenceError异常

## HasThisBinding()

> 	Determine if an Environment Record establishes a this binding. Return true if it does and false if it does not.

决定一个Environment Record是否建立了this绑定，是返回true，否则返回false

## Lexical Environments

> A Lexical Environment is a specification type used to define the association of Identifiers to specific variables and functions based upon the lexical nesting structure of ECMAScript code. A Lexical Environment consists of an Environment Record and a possibly null reference to an outer Lexical Environment.

词法环境([Lexical Environment][])是用于定义具体变量和函数标识符的关联，基于ECMAScript代码的词法嵌套结构的规范类型。
词法环境包括词法记录(Environment Record)和对外层词法环境(outer Lexical Environment)的引用，其引用可能为空。

Lexical Environment包括几种类型：

* global environment
* module environment
* function environment

Lexical Environments和Environment Record的值仅仅是规范机制，无需对任何具体ECMAScript实现的人工程序作出响应，因此不能直接访问或操作这些值。

## Environment Records

规范中有两种基本的Environment Record值，declarative Environment Records和object Environment Records

出于规范目的，可以将Environment Record看做一个抽象类，有三个具体的子类declarative Environment Record, object Environment Record, 和global Environment Record；
Function Environment Records和module Environment Records是declarative Environment Record的子类

![Environment](http://img.blog.csdn.net/20160808170715510)

## running execution context

> An execution context is a specification device that is used to track the runtime evaluation of code by an ECMAScript implementation. At any point in time, there is at most one execution context that is actually executing code. This is known as the running execution context.

执行上下文(execution context)是一种用于跟踪ECMAScript实施代码运行时评估的规范设备。
在任意时刻，至多有一个执行上下文在实际执行代码，这就是running execution context。

# 获取思路

```flow
st=>start: 开始
e=>end: 结束
op1=>operation: ResolveThisBinding()
op2=>operation: envRec = GetThisEnvironment()
op3=>operation: return envRec.GetThisBinding()

st->op1->op2->op3->e
```

GetThisEnvironment()的流程：

```flow
st=>start: 开始
e=>end: 结束
op1=>operation: lex = running execution context’s LexicalEnvironment
op2=>operation: envRec = lex's EnvironmentRecord
op3=>operation: exists = envRec.HasThisBinding()
cond=>condition: exists == true?
opret=>operation: return envRec
op4=>operation: outer = outer Lexical Environment
op5=>operation: lex = outer

st->op1->op2->op3->cond
cond(yes)->opret->e
cond(no)->op4->op5->op2
```

# 参考

* [ECMAScript® 2015 Language Specification][reference]




[running execution context]: http://www.ecma-international.org/ecma-262/6.0/#sec-execution-contexts
[GetThisEnvironment()]: http://www.ecma-international.org/ecma-262/6.0/#sec-getthisenvironment
[Lexical Environment]: http://www.ecma-international.org/ecma-262/6.0/#sec-lexical-environments
[Environment Record]: http://www.ecma-international.org/ecma-262/6.0/#sec-environment-records
[the global environment]: http://www.ecma-international.org/ecma-262/6.0/#sec-global-environment-records
[GetThisBinding()]: #getthisbinding
[HasThisBinding()]: #hasthisbinding
[获取思路]: #获取思路
[JavaScript笔记——this的取值]: http://blog.csdn.net/azureternite/article/details/52160452

[reference]: http://www.ecma-international.org/ecma-262/6.0/
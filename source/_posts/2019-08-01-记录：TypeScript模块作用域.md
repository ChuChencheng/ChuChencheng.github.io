---
title: 记录：TypeScript模块作用域
date: 2019-08-01 16:35:05
tags:
- typescript
categories: 前端
---

# 背景

在使用 TypeScript 时，有些场景可能需要定义一些全局变量，或者是在 `window` 对象底下挂一些全局变量（这两种全局变量在 TypeScript 中略有不同），这时候我们可能会在项目 src 中自己手写一些 `.d.ts` 文件。

但是这个全局变量要怎么写？

TypeScript [官方文档](https://www.typescriptlang.org/docs/handbook/modules.html) 里有这么一段话：

> In TypeScript, just as in ECMAScript 2015, any file containing a top-level import or export is considered a module. Conversely, a file without any top-level import or export declarations is treated as a script whose contents are available in the global scope (and therefore to modules as well).

一个有着顶级 `import` 或 `export` 语句的文件被认为是一个**模块**，相反，则被当成一个全局作用域的脚本。

# 全局作用域文件

有了这句话，就很清楚了，只要避免一个文件顶级有 `import` 或 `export` 语句，这个文件的作用域就是全局的，即无需引入就可以使用里面的类型。

例如：

```typescript
// src/global.d.ts
declare var add: (a: number, b: number) => number
```

```typescript
// src/index.ts
// 无需引入，可直接调用 add
add(1, 2)
```

如果在顶级添加一个 `import` 或 `export` ：

```typescript
// src/global.d.ts
declare var add: (a: number, b: number) => number

export {}
```

则在 index.ts 中会提示 找不到名称“add”

这时候要用到里面的变量，只能把变量都 export 出来，然后在 index.ts 中引入：

```typescript
// src/global.d.ts
export declare var add: (a: number, b: number) => number

// src/index.ts
import { add } from './global'

add(1, 2)
```

# 带有 import 的全局作用域脚本

那如果需要 `import` 怎么办？例如我们需要定义一个 axios 的实例，并把它定义为全局变量 `$http` 。

## 不在顶级 import

文档里有说明

> top-level import or export

那么只要避开 top-level 就行。通过定义一个 namespace ，可以把 `import ` 跟 `export` 都放到里面：

```typescript
// src/global.d.ts
declare namespace Glb {
  declare var $http: import('axios').AxiosInstance
}
```

这样，可以直接用 `Glb.$http({})` 来调用。

## 使用 declare global

如果非要直接 `$http({})` 调用，还可以这么写：

```typescript
import { AxiosInstance } from "axios"

declare global {
  declare var $http: AxiosInstance
}
```

虽然在顶级有 `import` ，但直接在 global namespace 定义了 `$http`

# 拓展 window 对象

## 不带 import

```typescript
// src/global.d.ts
interface Window {
  add: (a: number, b: number) => number
}
```

## 带 import

```typescript
// src/global.d.ts
import { AxiosInstance } from 'axios'

declare global {
  // declare var $http: AxiosInstance
  interface Window {
    $http: AxiosInstance
  }
}
```

# 参考

* [Stack Overflow 采纳的回答](https://stackoverflow.com/questions/39040108/import-class-in-definition-file-d-ts)
* [TypeScript Module](https://www.typescriptlang.org/docs/handbook/modules.html)
* [TypeScript global.d.ts 文件模板](https://www.typescriptlang.org/docs/handbook/declaration-files/templates/global-d-ts.html)
* [TypeScript global-modifying-module.d.ts 文件模板](https://www.typescriptlang.org/docs/handbook/declaration-files/templates/global-modifying-module-d-ts.html)

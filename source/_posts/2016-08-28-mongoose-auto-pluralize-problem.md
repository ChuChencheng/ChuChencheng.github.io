---
title: mongoose连接collection后自动加s的问题
categories: MongoDB
tags:
- mongoose
- MongoDB
---

这两天折腾mongoose，发现数据成功写入集合了，但是在Terminal查询的时候却查不到
于是show collections后发现在原来的集合底下，又生成了一个加了s的集合，shenmegui

查了一下，发现是mongoose.model()的问题

Mongoose#model(name, [schema], [collection], [skipInit])

在官方的api文档里面有解释（我不听）

> When no collection argument is passed, Mongoose produces a collection name by passing the model name to the utils.toCollectionName method. This method pluralizes the name. If you don't like this behavior, either pass a collection name or set your schemas collection name option.

当没有传入collection参数时，Mongoose会通过model name（就是第一个参数），调用utils.toCollectionName方法产生一个collection name，而这个方法会使name变成复数形式。如果你不想要这个过程，只要传入collection name参数或设置Schema中的collection name选项。

就像这样：

```javascript
var schema = new Schema({ name: String }, { collection: 'actor' });

// or

schema.set('collection', 'actor');

// or

var collectionName = 'actor'
var M = mongoose.model('Actor', schema, collectionName);
```

什么坑爹设定...

# 参考

* [Mongoose API v4.5.9][]


[Mongoose API v4.5.9]: http://mongoosejs.com/docs/api.html#index_Mongoose-model


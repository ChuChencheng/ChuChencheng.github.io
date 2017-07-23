---
title: git中多个人在同一个分支进行开发push时可能遇到的情况
tags: git
categories: git
---

# 情景

有的时候会遇到这种问题，比如说有两个人，在同一个分支进行开发，假设是我自己，跟我的同伴；现在，我写了一部分代码，准备push到远程了，于是我执行git add、git commit，一切ok，没问题，然后git push，这下问题来了，git告诉我说我的push被rejected了，原来，我的同伴在我执行push之前，已经push了若干个commit到远程，因此我不能直接push，而是需要先把他的commits拉到我本地的repo才行。git的提示如下图。



# 按照git的提示做

好，git的提示已经很清楚了，rejected的原因通常是远程有了另外的push，询问了同伴，我们知道，就是ta先进行了push。那么，根据git的提示，我们可能想要先把远程的改变进行整合，再来push。那怎么整合呢，rejected那行告诉我们，要“fetch first”，而下面的e.g.说，我们可以用git pull来整合。也就是说，我们可以用git fetch，也可以用git pull来整合远程的改变到我们本地仓库中。

# 使用git pull

由于我本人对fetch不太了解，看着pull好像跟push是反义词比较亲切，那就用它吧。于是我执行了git pull，然后git push。emmmm，好像没什么问题，但是...在source tree里面看着分支的图谱怎么怪怪的？

图谱里面显示，我提交了两个commit，但实际上我改动的地方只进行了一次提交。我们看看多出来的commit的描述，写着“Merge branch 'master' of github.com:ChuChencheng/test”。

嗯？意思是这个提交做的改动是把远端的master分支进行合并。

# git pull动的手脚

Google了一番git pull，发现git pull做的事情其实相当于git fetch跟git merge，那，我之前一直没用到的git fetch做的事情是什么呢？

git fetch这个命令会把远程的commits拉取到本地的repo中，但是，它不是直接把commits接在分支的最后面，而是从你最后一次push的那个commit节点，再拉取一个新的分支出来，类似这样：

```
   * git fetch拉下来的节点，建立在一个新的分支上
* /  你还没push的节点
|/
* 你最后一次push的节点
|
*
```

那merge呢？git pull在拉取完之后，就会将新建的分支跟你原来的分支进行合并，所以图就变成了这样：

```
*  新建的分支merge进原本的分支，这个节点就是merge xxx那个多出来的节点
| \
|  * git fetch拉下来的节点，建立在一个新的分支上
* /  你还没push的节点
|/
* 你最后一次push的节点
|
*
```

# 那怎么办？

现在，我们知道了，这种情况下执行git pull，分支的图谱就会变得很难看，但又必须把远程的commits拉取下来，那有没有办法让分支图谱保持一条直线而不分叉呢？

这个时候，我们还需要一个以前也很少用（我真的很菜）的命令，git rebase。

git rebase的作用是，把一个分支的修改合并到另一个分支。听起来有点熟悉？没错，它跟merge的功能有点像。不同的是，merge的做法比较粗暴，直接把两个分支再各自拉出一条线，连在一起就完了；而rebase则比较细心，它会把当前分支跟你要合并的分支中不同的commits取消掉，临时保存起来，然后在要合并的分支中再把保存起来的commits贴上去，变成新的commits，当然，commitId也是新的，这样，最后的效果就是只剩合并后的分支，而且是一条直线，没有分叉，没有“Merge branch xxx of xxx”这种多余的提交。

# 具体做法

知道了是什么，为什么，最后就是怎么做了。

步骤如下：

1. git fetch
2. git rebase
3. 解决冲突
4. git add 冲突文件
5. git rebase --continue
6. git push

其中，3、4、5点，如果没遇到冲突就不用进行，直接push上去。



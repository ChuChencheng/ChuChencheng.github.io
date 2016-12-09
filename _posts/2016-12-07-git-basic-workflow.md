---
title: git的基本使用流程
tags: git
categories: git
---

# 关于git的基本理解

git：一种分布式版本控制系统

git保存的是每一次改动，而不是文件本身。

------

git有三个区：

**工作区(Working Directory)**

这个区就是你在电脑上创建项目的地方，文件的编辑修改都在这个区中进行。

**暂存区(Stage Area)**

暂存区存放的是待提交到repo的修改，当你使用git add命令时，就是把工作区的修改添加到暂存区。

**版本库/仓库(Git Directory/Repository)**

每次使用git commit命令，就是把暂存区中的内容全部提交到repo中。

------

关于分支：

新建分支默认是master。

master分支应该是一个稳定的，可用的应用，平时不在这个分支上工作。

当要添加新功能时，可从master分支新建一个分支，如feature分支，当新功能完成时，再合并到master分支上，这样，master分支始终是稳定可用的。

多人合作时，可以每个人在各自的分支上工作，时不时合并到同一个分支上，当功能完善时，再合并到master分支。

分支之间大概是这种感觉(假设A、B两个人开发)：

![branches](http://img.blog.csdn.net/20161209172839993?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvYXp1cmV0ZXJuaXRl/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)

当master分支上的应用出现bug时，可以在master分支上新建一个bug分支，如issue-101，修复bug后再合并到master分支上，然后删除bug分支。

# 基本流程

假设你已经安装了git

以下考虑最基本的git使用流程，开发时遇到的情况很多，以下流程暂不列出删除、撤销、回退的步骤，后面再单独列出来。

暂不考虑多人合作与远程repo，后面再补充，因为了解了怎么自己玩git，也就明白怎么跟基友一起玩github了。

新建repo->修改文件->添加修改到暂存区->提交修改到repo->创建分支->修改文件->添加修改到暂存区->提交修改到repo->合并分支->解决冲突

创建bug分支->修复bug->合并分支

# 流程步骤

**新建repo**

在项目根目录下使用`git init`初始化git仓库

**修改文件**

我们在项目目录下新建一个hello.txt文件，里面输入内容`hello world`（注意不要用Windows自带的记事本创建、编辑）

然后输入`git status`，会看到输出了这些信息：

```
On branch master

Initial commit

Untracked files:
  (use "git add <file>..." to include in what will be committed)

        hello.txt

nothing added to commit but untracked files present (use "git add" to track)
```

这边git提示我们有一个Untracked file，可以用`git add <file>`来添加要提交的文件。

**添加修改到暂存区**

按照提示，我们输入`git add hello.txt`把文件添加到暂存区（使用`git add .`添加更改过的全部文件）

再次输入`git status`，这次看到输出信息：

```
On branch master

Initial commit

Changes to be committed:
  (use "git rm --cached <file>..." to unstage)

        new file:   hello.txt

```

hello.txt已经被存放到暂存区了

**提交修改到repo**

使用`git commit -m 'add hello.txt'`来提交这个文件的更改

输出信息：

```
[master (root-commit) 88aa3e8] add hello.txt
 1 file changed, 1 insertion(+)
 create mode 100644 hello.txt

```

这时候，文件的更改已经提交到repo中。

**创建分支**

在master分支下：

`git checkout -b feature`创建并切换到feature分支

创建分支是`git branch feature`，创建feature分支

切换分支是`git checkout feature`，切换到feature分支

**合并分支**

我们切换到feature分支，`git checkout feature`

打开刚才的hello.txt

把内容修改成`goodbye world`

然后用`git add`跟`git commit`命令提交到repo中

切换到master分支，在hello.txt文件结尾加上一行`hello world again`，然后提交

这时候，两个分支各有一个提交(commit)

我们切换到master分支`git checkout master`

然后把feature分支合并到master分支上，`git merge --no-ff -m 'merge feature' feature`

这时候会提示有冲突：

```
Auto-merging hello.txt
CONFLICT (content): Merge conflict in hello.txt
Automatic merge failed; fix conflicts and then commit the result.
```

git提示我们解决了冲突再把结果commit。

**解决冲突**

冲突在多人合作中应该是常有的事。

我们打开hello.txt，发现内容变成了这样

```
hello world
<<<<<<< HEAD
hello world again
=======
goodbye world
>>>>>>> feature

```

于是我们把hello.txt修改成：

```
hello world
goodbye world
```

然后提交

```bash
git add hello.txt
git commit -m 'fix conflict'
[master 40cd928] fix conflict
```

分支合并成功。

可以用`git log --graph --pretty=oneline --abbrev-commit`来查看合并的情况

```
*   40cd928 fix conflict
|\
| * 3cbd4df modified hello.txt
* | a40c0bc add "again"
|/
* 10fb7e4 add hello.txt

```

log的顺序是按时间顺序从下到上。

**bug分支**

假设现在master分支上发现了个bug，需要紧急修复，但你现在正在feature分支上工作

假设现在hello.txt的内容是：

```
hello world
goodbye world

feature branch unfinished work
```

现在feature分支上的功能还未完成，无法提交，但是需要修复bug。这时，就需要使用`git stash`保存工作现场。

于是，在feature分支上，输入`git stash`，看到输出信息：

```
Saved working directory and index state WIP on feature: 3cbd4df modified hello.txt
HEAD is now at 3cbd4df modified hello.txt
```

这时候，再输入`git status`，发现输出：

```
On branch feature
nothing to commit, working tree clean
```

现场已被保存，打开hello.txt，后面的那句`feature branch unfinished work`也不见了。

好，现在我们可以切换到master分支，并新建一个bug分支来修复这个bug了。

```
git checkout master
git checkout -b issue-101
```

在hello.txt中添加一行`issue-101 bug fixed`，提交到repo

然后切回master分支，把issue-101分支合并进来。

```
git add hello.txt
git commit -m 'bug fixed'

git checkout master
git merge --no-ff -m 'merge issue-101' issue-101
```

输出信息：

```
Merge made by the 'recursive' strategy.
 hello.txt | 4 +++-
 1 file changed, 3 insertions(+), 1 deletion(-)

```

合并完成，然后我们回到feature分支继续工作。

```
git checkout feature
```

但是现在hello.txt里面的内容还是

```
hello world
goodbye world
```

我们需要把之前未完成的工作现场恢复过来。

使用`git stash list`可以查看保存了哪些工作现场：

```
stash@{0}: WIP on feature: 3cbd4df modified hello.txt
```

可以看到，这边只有一条数据，我们可以使用`git stash pop`来恢复这个现场。

输出的信息：

```
On branch feature
Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git checkout -- <file>..." to discard changes in working directory)

        modified:   hello.txt

no changes added to commit (use "git add" and/or "git commit -a")
Dropped refs/stash@{0} (643bef60d9b9540f66675d2fe1e8d9ad9d35f4fd)

```

可以看到，hello.txt里面的`feature branch unfinished work`又回来了
并且在恢复现场后，`Dropped refs/stash@{0} (643bef60d9b9540f66675d2fe1e8d9ad9d35f4fd)`
删除了stash的内容。

如果有多条stash数据，可以用`git stash apply`来恢复，如

```
git stash apply stash@{0}
```

但是用这种方式，stash内容并不会被删除，如果要删除某条stash，用`git stash drop`

# 删除、撤销、回退

## 删除

**删除文件**

假设我们有个文件，已经commit到repo中了，需要删除。
为此，我们新建一个文本文件delete.txt来模拟这个文件，把它提交到repo中。

这时候我们可以用两种方法来删除delete.txt。

1、使用`git rm delete.txt`

执行这句之后，会输出一句`rm 'delete.txt'`，这时候到工作区查看，会发现delete.txt已经不在工作区了。

输入`git status`，发现输出如下信息：

```
On branch feature
Changes to be committed:
  (use "git reset HEAD <file>..." to unstage)

        deleted:    delete.txt

```

暂存区已经记录了删除delete.txt的操作，接下来只要`git commit`就可以把delete.txt从repo中删除了。

2、直接从工作区目录中删除delete.txt，然后`git add`，`git commit`提交修改。

**删除分支**

`git branch -d <name>`可以删除分支。

例如我们可以删除之前用来修bug的issue-101分支

```
git branch -d issue-101
```

执行后输出的信息：

```
Deleted branch issue-101 (was 5d97433).
```

用`git branch`查看分支，输出信息中表示只剩master分支跟feature分支了。

如果要删除一个未合并的分支，默认git会报错，例如我们创建一个delete分支，在hello.txt中添加一行内容`delete branch`，然后进行一个commit

```
git checkout -b delete
git add hello.txt
git commit -m 'update delete branch'
```

然后切回master分支，删除delete分支

```
git checkout master
git branch -d delete
```

输出了一个error：

```
error: The branch 'delete' is not fully merged.
If you are sure you want to delete it, run 'git branch -D delete'.
```

git告诉你这个分支没被合并，如果确定要删除，使用`git branch -D delete`。

执行`git branch -D delete`，成功删除。

这个操作通常用来删除做到一半后面计划不做了的功能分支。

## 撤销

场景：从工作区撤销

你在hello.txt中写下了新的一行：`I prefer svn`
这时候你还没执行`git add`
输入`git status`，会发现有个提示，`(use "git checkout -- <file>..." to discard changes in working directory)`

于是按照提示，执行`git checkout -- hello.txt`
再回去hello.txt看看，新增的那句话已经被撤销了。

实际上，`git checkout`所做的，就是把工作区的修改替换成暂存区的。

------

场景：从暂存区撤销到工作区

你在hello.txt中写下了新的一行：`I prefer svn`
执行了`git add hello.txt`，把修改添加到暂存区
这时候git会提示你，`(use "git reset HEAD <file>..." to unstage)`

说得很清楚了，于是我们执行`git reset HEAD hello.txt`

再执行`git status`查看，发现修改又回到了工作区。

------

场景：从repo中撤销

……，，，遇到这种情况，看接下来的 回退 吧

## 回退

概念：git中有个HEAD指针，指向当前分支的当前版本，当我们进行回退操作时，其实就是改变HEAD指针，使其指向不同的commit节点。

理解了这个概念，就知道，既然是移动HEAD指针，那我们就可以在任意commit节点间进行跳转，无论是之前的版本，还是回退到之前版本后，想要回到未来的版本，只要知道commit的id就可以跳转版本。

使用`git reset HEAD --hard <commit_id>`来回退。

类似`10fb7e42c63586db6948f7a9221bafb32f19409d`这样的就是一个commit id，也可以输入前面几位，只要跟其他id有区别就行，如`10fb7e4`

commit_id可以使用`git reflog`来查看。（使用`git log`不能看到回退后未来的commit id）

# 几个命令

`git init` 初始化repo

`git add <file>` 添加修改到暂存区

`git commit -m '<msg>'` 提交修改到repo，并附上说明

`git push` 推送commit到远程仓库

`git branch` 查看本地分支

`git branch -a` 查看远程分支

`git branch <branch_name>` 创建分支

`git checkout <branch_name>` 切换分支

`git checkout -b <branch_name>` 新建并切换分支

`git merge` 合并分支

`git stash` 保存工作区工作现场

`git stash list` 查看stash

`git stash pop` 恢复最后一个stash并删除stash数据

`git stash apply <stash>` 恢复指定stash

`git stash drop <stash>` 删除指定stash

`git rm <file>` 将文件从工作区删除

`git branch -d <branch_name>` 删除分支

`git branch -D <branch_name>` 强制删除未合并分支

`git checkout -- <file>` 把修改从工作区撤销

`git reset HEAD <file>` 把修改从暂存区撤销到工作区

`git reset HEAD --hard <commit_id>` repo版本回退到某个commit

`git log` 查看commit历史

`git reflog` 查看每个操作的log

# 参考

* [Git教程 - 廖雪峰的官方网站][]




[Git教程 - 廖雪峰的官方网站]: http://www.liaoxuefeng.com/wiki/0013739516305929606dd18361248578c67b8067c8c017b000
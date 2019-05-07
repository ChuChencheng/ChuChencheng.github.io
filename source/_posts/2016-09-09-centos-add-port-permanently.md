---
title: CentOS 7 防止端口自动关闭
categories: Linux
tags:
- CentOS
- port
- firewalld
---

# tl;dr

```bash
firewall-cmd --permanent --zone=public --add-port=2888/tcp
firewall-cmd --reload  #重新载入服务
```

永久配置firewalld开启端口。

# 之前的一些坑

之前的一篇文章[CentOS 7部署Node.js+MongoDB：在VPS上从安装到Hello world][]中，讲到了CentOS开启端口用这个命令

```bash
firewall-cmd --add-port=3000/tcp
```

这样是没错，开启了端口，但是后面发现这个端口会莫名其妙的被关闭

Google一番后了解到这样添加端口是运行时配置（Runtime configuration），在重载或重启firewalld后，这个配置就失效了。

# 自动关闭原因

CentOS 7 采用了firewalld作为防火墙服务，在[Red Hat][]官方文档的[Security Guide][]中有介绍firewalld

>The dynamic firewall daemon firewalld provides a dynamically managed firewall with support for network “zones” to assign a level of trust to a network and its associated connections and interfaces. It has support for IPv4 and IPv6 firewall settings. It supports Ethernet bridges and has a separation of runtime and permanent configuration options. It also has an interface for services or applications to add firewall rules directly.

动态防火墙守护进程firewalld提供一个动态管理的防火墙，支持网络“区域”（zones），以用来给一个网络以及其关联的链接和接口分配一个信任层级。firewalld支持IPv4跟IPv6的防火墙设置。它还支持以太网桥，并且有运行时配置选项跟永久配置选项**（runtime and permanent configuration options）**，二者相互分离。并且firewalld为服务或应用直接添加防火墙规则提供了接口。

有关Network Zones的概念这边不细讲，参照Security Guide。

firewalld有个图形化配置工具firewall-config，还有个命令行客户端，就是firewall-cmd了。

我们暂时还没用到图形化工具，所以这边就说一下firewall-cmd

Security Guide中关于firewall-cmd的介绍：

>A command line client, firewall-cmd, is provided. It can be used to make permanent and non-permanent runtime changes as explained in man firewall-cmd(1). Permanent changes need to be made as explained in the firewalld(1) man page. Note that the firewall-cmd command can be run by the root user and also by an administrative user, in other words, a member of the wheel group. In the latter case the command will be authorized via the polkit mechanism.

具体就不翻译了，大概是说
firewall-cmd可以永久或非永久地改变配置，永久配置需要如man page中解释的那样改变（日了狗了）。

于是又去翻了翻firewalld(1)的man page，里面有两段关于Runtime configuration跟Permanent configuration的解释。

>Runtime configuration
       Runtime configuration is the actual active configuration and is not permanent. After
       reload/restart of the service or a system reboot, runtime settings will be gone if they
       haven't been also in permanent configuration.

>Permanent configuration
   The permanent configuration is stored in config files and will be loaded and become new
   runtime configuration with every machine boot or service reload/restart.

运行时配置
        运行时配置是实际上启用了但不是永久的配置。在服务重载/重启或系统重启之后，运行时的设置如果不存在永久配置中，就会失效。

永久配置
        永久配置被保存在配置文件中，随着每次机器启动或服务重载/重启，永久配置都会被载入，变成新的运行时配置。

# 永久开启端口

好了，说了那么多，应该是理清楚端口被自动关闭的原委了，那怎么永久开启端口呢，万能的Security Guide中给出了答案

>The rules can be made permanent by adding the --permanent option using the firewall-cmd --permanent --direct command or by modifying /etc/firewalld/direct.xml. 

只要添加规则时加上--permanent参数或者修改/etc/firewalld/direct.xml就行了。

所以只需要两条命令

```bash
firewall-cmd --permanent --zone=public --add-port=2888/tcp
firewall-cmd --reload  #重新载入服务
```

# 参考

* [4.5. USING FIREWALLS][Security Guide]
* [CentOS 7.0 - man page for firewalld (centos section 1) - Unix & Linux Commands][]
* [centos 7 - open firewall port - Stack Overflow][]





[CentOS 7部署Node.js+MongoDB：在VPS上从安装到Hello world]: http://blog.csdn.net/azureternite/article/details/52349326
[Red Hat]: https://www.redhat.com/en
[Security Guide]: https://access.redhat.com/documentation/en-US/Red_Hat_Enterprise_Linux/7/html/Security_Guide/sec-Using_Firewalls.html
[CentOS 7.0 - man page for firewalld (centos section 1) - Unix & Linux Commands]: http://www.unix.com/man-page/centos/1/firewalld/
[centos 7 - open firewall port - Stack Overflow]: http://stackoverflow.com/questions/24729024/centos-7-open-firewall-port

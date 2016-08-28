---
title: UWP ComboBox下拉选项滚动循环问题
---

在UWP开发中遇到个小问题，ComboBox的Item太多的话，列表会重复，并且无限循环，Google了一下后发现这貌似是Metro应用的老问题了，由于ComboBox的Items使用的是CarouselPanel而导致的。


解决方法：改变`ComboBox`的`ItemsPanelTemplate`为`StackPanel`


```xaml
<ComboBox>  
    <ComboBox.ItemsPanel>  
        <ItemsPanelTemplate>  
            <StackPanel Orientation="Vertical"/>  
        </ItemsPanelTemplate>  
    </ComboBox.ItemsPanel>  
</ComboBox>
```


目前发现了这样做的一个问题，ComboBox选择非第一项的选项之后再选择第一项，会出现变成空白，或选不了的bug，暂时没有发现解决办法。



参考：http://netitude.bc3tech.net/2013/04/12/windows-8s-combobox-and-the-carouselpanel/
var PostEvents = function(){
  this.url = window.config.url;
  this.cors = 'http://api.c2ccc.space:3000';
  this.title = window.config.title;
  this.$window = $(window);
  this.$feedback = $('.feedback');
  this.$feedbackBtn = $('.feedback button');
  this.$addCommentForm = $('.add-comment form');
  this.$comments = $('.comments');
  this.init();
}

$.extend(PostEvents.prototype, {
  init: function(){
    this.attachEvents();
  },
  attachEvents: function(){
    this.$window.on('load', $.proxy(this.handleGetComments, this));
    this.$addCommentForm.on('submit', $.proxy(this.handleAddComment, this));
    this.$feedbackBtn.on('click', $.proxy(this.handleFeedback, this));
  },
  handleFeedback: function(e){
    var self = this;
    var feedback = $(e.target).attr('data-feedback');
    $.ajax({
      url: this.cors + this.url.feedback,
      type: 'post',
      data: {title:this.title,feedback: feedback},
      dataType: 'json'
    }).done(function(data){
      if(data.success){
        self.$feedback.children('p').text('感谢您的反馈');
        self.$feedbackBtn.remove();
      }else{
        console.log(data.msg);
      }
    });
  },
  handleGetComments: function(e){
    var self = this;
    this.fillCookies(this.$addCommentForm);
    $.ajax({
      url: this.cors + this.url.getComments,
      type: 'get',
      data: {title: this.title},
      dataType: 'json'
    }).done(function(data){
      if(data.success){
        $.each(data.data, function(key, value){
          self.$comments.prepend(self.generateCommentHtml(value));
        });
      }else{
        console.log(data.msg);
      }
    });
  },
  handleAddComment: function(e){
    e.preventDefault();
    var self = this;
    var url = this.$addCommentForm.attr('action');
    var type = this.$addCommentForm.attr('method');
    var data = this.$addCommentForm.serializeToObject();
    if(data.remember){
      Cookies.set('name', data.name);
      Cookies.set('email', data.email);
      Cookies.set('site', data.site);
    }
    $.ajax({
      url: this.cors + url,
      type: type,
      data: data,
      dataType: 'json'
    }).done(function(data){
      if(data.success){
        self.clearForm(self.$addCommentForm);
        self.fillCookies(self.$addCommentForm);
        self.$comments.prepend(self.generateCommentHtml($.extend({}, self.serializeToObject(self.$addCommentForm), data.data)));
      }else{
        alert(data.msg);
      }
    });
  },
  clearForm: function($form){
    $.each($form.children(), function(key, value){
      if(!$(value).hasClass('hidden')){
        $(value).val('');
      }
    });
  },
  fillCookies: function($form){
    $.each($form.children('.cookie'), function(key, value){
      $(value).val(Cookies.get($(value).attr('name')));
    });
  },
  generateCommentHtml: function(doc){
    var id = doc.id,
        date = doc.date,
        content = doc.content,
        name = doc.name,
        email = doc.email,
        site = doc.site;
    var html = '<div class="'+ (('' + id).length < 6 ? this.prefixZero(id, 6) : id) +'"><a href="'+ (site == null ? '' : site) +'"><span>'+ name +'</span></a><span>'+ date +'</span><pre><p>'+ content +'</p></pre></div>';
    return html;
  },
  serializeToObject: function($form){
    var o = {};
    $($form.serializeArray()).each(function(){
      o[this.name] = this.value;
    });
    return o;
  },
  prefixZero: function(num, n){
    return Array(n - ('' + num).length + 1).join(0) + num;
  }
});

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
    $.ajax({
      url: this.cors + this.url.getComments,
      type: 'get',
      data: {title: this.title},
      dataType: 'json'
    }).done(function(data){
      if(data.success){
        $.each(data.docs, function(key, value){
          $comments.prepend(self.generateCommentHtml(value));
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
    var data = this.$addCommentForm.serialize();
    $.ajax({
      url: this.cors + url,
      type: type,
      data: data,
      dataType: 'json'
    }).done(function(data){
      if(data.success){
        $comments.prepend(self.generateCommentHtml($.extend(self.serializeToObject(self.$addCommentForm), data.doc)));
      }else{
        alert(data.msg);
      }
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

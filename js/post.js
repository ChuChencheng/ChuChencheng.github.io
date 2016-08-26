var PostEvents = function(){
  this.url = window.config.url;
  this.title = window.config.title;
  this.$window = $(window);
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
    this.$window.on('load', handleGetComments);
    this.$addCommentForm.on('submit', handleAddComment);
    this.$feedbackBtn.on('click', handleFeedback);
  },
  handleFeedback: function(e){
    console.log(e.target);
  },
  handleGetComments: function(e){
    var self = this;
    $.ajax({
      url: this.url.getComments,
      type: 'get',
      data: this.title,
      dataType: 'json'
    }).done(function(data){
      if(data.success){
        $.each(data.docs, function(key, value){
          $comments.prepend(self.generateCommentHtml(value));
        });
      }else{
        alert(data.msg);
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
      url: url,
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

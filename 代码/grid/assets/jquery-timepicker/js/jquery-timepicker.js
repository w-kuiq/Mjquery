$.fn["timePicker"] = function(options){
	var __DEFAULTS__ = {
		name : "name",
		placeholder : "请选择时间"
	};
	var __PROTO__ = {
		getSystemTime : function(){
			return new Date().toTimeString().substr(0,8);
		},
		setSelection : function(input, startPos, endPos){
			window.setTimeout(function(){
	        	if (typeof input.selectionStart != "undefined") {
		            input.selectionStart = startPos;
		            input.selectionEnd = endPos;
		        } else if (document.selection && document.selection.createRange) {
		            input.select();
		            var range = document.selection.createRange();
		            range.collapse(true);
		            range.moveStart("character", startPos);
		            range.moveEnd("character", endPos);
		            range.select();
		        }
	        },50);
		},
		setFiledValue : function($filed,value){
			value = Number(value);
			value = Math.max(value,0);
			$filed.attr("value",value).css({
					transform: "translateY(-"+value*24+"px)"
				});
			var index = $filed.index();
			var start = index*2+index;
			var $content = $filed.parent().prevAll(".content");
			var times = $content.val().split(":");
			times[index] = value<10?"0"+value:value;
			$content.val(times.join(":"));
			this.setSelection($content[0],start,start+2);
		},
		_render : function(){
			this.html('<div class="time-picker">'+
				'<input name="'+this.options.name+'" class="content" placeholder="'+this.options.placeholder+'">'+
				'<i class="fa fa-clock-o"></i>'+
				'<i class="fa fa-times-circle"></i>'+
				'<div class="selector">'+
					'<ul class="hours">'+
					'</ul>'+
					'<ul class="minutes">'+
					'</ul>'+
					'<ul class="seconds">'+
					'</ul>'+
				'</div>'+
			'</div>');
			this.$selector = this.find(".time-picker .selector");
			this.$hours = this.$selector.find(".hours");
			this.$minutes = this.$selector.find(".minutes");
			this.$seconds = this.$selector.find(".seconds");
			var html = "";
			for(var i=0;i<60;i++){
				i==24&&this.$hours.html(html);
				html+="<li>"+(i<10?"0"+i:i)+"</li>";
			}
			this.$minutes.html(html);
			this.$seconds.html(html);
		},
		_handle : function(){
			var $this = this;
			this.find(".time-picker .content").on("focus",function(){
				if(!this.value){
					var $selector = $(this).nextAll(".selector");
					this.value = $this.getSystemTime();
					var time = this.value.split(":");
					var $first = $selector.children().first();
					$this.setFiledValue($first,time[0]);
					$this.setFiledValue($first = $first.next(),time[1]);
					$this.setFiledValue($first = $first.next(),time[2]);
				}
				$(this).addClass("selecting").nextAll(".selector").show(50);
				$this.setSelection(this,0,10);
			}).on("blur",function(){
				var $selector = $(this).nextAll(".selector");
				var selecting = $selector.attr("selecting");
				if(!selecting||selecting==="false"){
					$selector.hide(50);
					$(this).removeClass("selecting");
				}
			}).nextAll(".fa-times-circle").on('click',function(){
				$(this).prevAll("input").val("").trigger("blur");
			}).next().hover(function(){
				$(this).attr("selecting","true");
			},function(){
				$(this).attr("selecting","false");
			}).find("ul").on('mouseover',function(){
				var start = $(this).index()*2+$(this).index();
				$this.setSelection($(this).parent().prevAll("input")[0],start,start+2);
			}).on('wheel',function(event){
				var $field = $(event.currentTarget);
				var currValue = Number($field.attr("value"));
				if(event.originalEvent.wheelDelta<0){
					currValue++;
				}else{
					currValue--;
				}
				$this.setFiledValue($field,currValue);
			}).find("li").on('click',function(){
				var $this_ = $(this);
				$this.setFiledValue($this_.parent(),Number($this_.html()));
			});
		}
	};
	this.options = $.extend(__DEFAULTS__,options);
	$.extend(this,__PROTO__);
	this._render();//初始化dom信息
	this._handle();//绑定dom事件
}
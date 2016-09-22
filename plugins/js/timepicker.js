$.fn['timePicker'] = function(options) {
    var _DEFAULT_ = {
        placeholder: "请选择时间"
    };
    var _PROTO_ = {
        _init: function() {
            this.html([
                '<input class="content" placeholder="' + this.options.placeholder + '">',
                '<i class="fa fa-clock-o"></i>',
                '<i class="fa fa-times-circle"></i>',
                '<div class="selector " selecting="false">',
                '<ul class="hours ">',
                '</ul>',
                '<ul class="minutes">',
                '</ul>',
                '<ul class="seconds">',
                '</ul>',
                '</div>'
            ].join(''));
            var $sel = this.find('.selector'),
                str = "";
            for (var i = 0; i < 60; i++) {
                str += '<li>' + (i < 10 ? '0' + i : i) + '</li>'
                if (i < 24) {
                    $sel.find('.hours').html(str);
                }
                $sel.find('.minutes').html(str);
                $sel.find('.seconds').html(str);
            }
            $sel.hover(function() {
                $(this).attr('selecting', 'true');
            }, function() {
                $(this).attr('selecting', 'false');
            }).prevAll('.fa-times-circle').hover(function() {
                $sel.attr('selecting', 'true');
            }, function() {
                $sel.attr('selecting', 'false');
            });
        },
        _handle: function() {
            var _this = this;
            this.find('.content ').on('focus', function() {
                if (!this.value) {
                    var $selector = $(this).nextAll(".selector");
                    this.value = _this.getCurrTime();
                    var time = this.value.split(":");
                    var $first = $selector.children().first();
                    _this.setTime($first, time[0]);
                    _this.setTime($first = $first.next(), time[1]);
                    _this.setTime($first = $first.next(), time[2]);
                }
                $(this).addClass('selecting').nextAll('.selector').show(100);
            }).on('blur', function() {
                var $selector = $(this).nextAll(".selector");
                if ($selector.attr('selecting') == 'false') {
                    $(this).removeClass('selecting').nextAll('.selector').hide(100);
                    if ($(this).val().length != 8) {
                        alert('请检查时间合适是否正确')
                    }
                }
            }).nextAll(".fa-times-circle").on('click', function(event) {
                $(this).prevAll("input").val("").trigger("blur");
            });

            this.find('.content').nextAll('.selector').find('ul').on('mouseover', function() {
                var start = $(this).index() * 3;
                _this.setSelection(_this.find('.content')[0], start, start + 2);
            }).on('mousewheel', function(event) {
                var $field = $(event.currentTarget);
                var currValue = Number($field.attr("value"));
                if (event.originalEvent.wheelDelta < 0) {
                    currValue++;
                } else {
                    currValue--;
                }
                if (currValue < $(this).children().length) {
                    _this.setTime($field, currValue);
                }
            }).on('DOMMouseScroll', function(event) {
                var $field = $(event.currentTarget);
                var currValue = Number($field.attr("value"));
                if (event.originalEvent.detail < 0) {
                    currValue++;
                } else {
                    currValue--;
                }
                if (currValue < $(this).children().length) {
                    _this.setTime($field, currValue);
                }
            }).find('li').on('click', function() {
                _this.setTime($(this).parent(), $(this).text());
            });

        },
        setTime: function(lis, value) {
            value = Number(value);
            value = Math.max(value, 0);
            lis.attr("value", value).css({
                transform: "translateY(-" + value * 24 + "px)"
            });
            var index = lis.index();
            var $content = lis.parent().prevAll(".content");
            var $inputs = $content.val().split(':');
            $inputs[index] = value < 10 ? '0' + value : value;
            $inputs = $inputs.join(":");
            $content.val($inputs).trigger("focus");
        },
        getCurrTime: function() {
            return new Date().toTimeString().substr(0, 8);
        },
        setSelection: function(input, startPos, endPos) {
            window.setTimeout(function() {
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
            }, 50);
        }
    }
    this.options = $.extend(_DEFAULT_, options);
    $.extend(this, _PROTO_);
    this._init();
    this._handle();
}

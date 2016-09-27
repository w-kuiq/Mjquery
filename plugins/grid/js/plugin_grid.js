$.fn.grid = function(options) {
    var __DEFAULT__ = {
        head: [],
        url: false,
        pageSize: 10,
        data: []
    };
    var __PROTO__ = {
        _init: function() {
            this.$dom = this.eq(0);
            this.$dom.html('<div class="grid">' +
                '<div class="data"></div>' +
                '<div class="toolbar"></div>' +
                '<div class="loading"><span class="left"></span><span class="right"></span></div></div>');
            this.$data = this.$dom.find(".grid .data");
            this.$toolbar = this.$dom.find(".grid .toolbar");
            this.$loading = this.$dom.find(".loading");
            this.dragging = false; //这个状态用来标示当前表格是不是正在拖拽表头
            this._render();
            this._handle();
        },
        _render: function() {
            var head, row;
            for (var i = 0; i < this.options.head.length; i++) {
                head = this.options.head[i];
                this.$data.append('<div class="col">' +
                    '<div class="head" style="width: ' + (head.width || 80) + 'px">' +
                    '<h6 name="' + head.name + '">' + head.text + '</h6>' +
                    '<i></i>' +
                    '</div>' +
                    '<ul name="' + head.name + '"></ul>' +
                    '</div>');
            }
            if (this.options.url) {
                var $this = this;
                // alert("ajax异步加载数据");
                //通过ajax异步加载数据，根据url所指向的资源路径

                $.ajax({
                    type: "GET",
                    url: this.options.url,
                    dataType: "json",
                    beforeSend: function() {
                        $this.$loading.show();
                    },
                    success: function(data, textStatus) {
                        $this.options.data = data;
                        $this._appendRow();
                    },
                    error: function(XMLHttpRequest, textStatus, errorThrown) {
                        alert(textStatus)
                        alert(errorThrown)
                    },
                    complete: function() {
                        window.setTimeout(function() {
                            //$this.$loading.fadeOut(500);
                            $this.$loading.find(".left").animate({ left: "-50%" }, 500).next().animate({ right: "-50%" }, 500, function() {
                                $this.$loading.hide();
                            });
                        }, 1000);
                    }
                });
            } else {
                this._appendRow();
            }
        },
        _appendRow: function() {
            this.$data.find('ul').html('');
            for (var i = 0; i < this.options.data.length; i++) {
                row = this.options.data[i];
                for (var prop in row) {
                    this.$data.find(".col ul[name='" + prop + "']").append("<li class='" + (row.selected ? "selected" : "") + "' rowIndex='" + i + "'>" + (row[prop] instanceof Date ? row[prop].toLocaleDateString() : row[prop].toString()) + "</li>");
                }
            }
        },
        _handle: function() {
            var $ul = this.find(".grid .data .col ul");
            $ul.on('mouseover', 'li', function() {
                $ul.find("li[rowIndex=" + $(this).index() + "]").addClass('hover');
            }).on('mouseout', 'li', function() {
                $ul.find("li[rowIndex=" + $(this).index() + "]").removeClass('hover');
            }).on('click', 'li', function() {
                var index = $(this).index();
                var $row = $ul.find("li[rowIndex=" + index + "]");
                $row.toggleClass('selected');
                $this_.options.data[index].selected = $row.hasClass("selected");
            });
            var $this_ = this;
            this.find(".grid .data .col .head").on('contextmenu', function() {
                return false;
            }).on('mousedown', function(event) {
                if (event.buttons == 1) return;
                var $heads = $(event.currentTarget).parents(".data").find(".col .head");
                var $col = $(event.currentTarget.parentNode);
                $col.addClass("drag");
                $this_.dragging = true;
                $this_.draggingTarget = $col[0];
                var offsetX = -10;
                var offsetY = -10;
                var x = event.clientX - offsetX;
                var y = event.clientY - offsetY;
                $col.css({ top: y + "px", left: x + "px" });
                $(document.body).on("mousemove", function(event) {
                    var x = event.clientX - offsetX;
                    var y = event.clientY - offsetY;
                    $col.css({ top: y + "px", left: x + "px" });
                }).on("mouseup", function() {
                    $(document.body).off("mousemove mouseup");
                    $col.removeClass("drag");
                    var $inTarget = $this_.draggingInTarget;
                    if ($inTarget.hasClass("drag-in-left")) {
                        $inTarget.parent().before($this_.draggingTarget);
                    } else {
                        $inTarget.parent().after($this_.draggingTarget);
                    }
                    $this_.dragging = false;
                    $this_.draggingTarget = null;
                    $this_.draggingInTarget = null;
                    $heads.removeClass("drag-in-left drag-in-right").off("mousemove");
                });
            }).on('mouseenter', function(event) {
                if ($this_.dragging && event.currentTarget != $this_.draggingTarget) {
                    var $target = $this_.draggingInTarget = $(event.currentTarget);
                    $target.off("mousemove").on("mousemove", function(event) {
                        var offsetX = event.offsetX;
                        var avg = $target.width() / 2;
                        if (offsetX < avg) {
                            $target.removeClass("drag-in-left drag-in-right").addClass("drag-in-left").parent().siblings().find(".head").removeClass("drag-in-left drag-in-right");
                        } else {
                            $target.removeClass("drag-in-left drag-in-right").addClass("drag-in-right").parent().siblings().find(".head").removeClass("drag-in-left drag-in-right");
                        }
                    });
                }
            }).find("h6").on('click', function() {
                var $this = $(this);
                $this.parents(".data").find(".col .head i").removeClass();
                if (!$this.attr("order") || $this.attr("order") == 'desc') {
                    $this.attr("order", "asc").next()[0].className = "fa fa-sort-alpha-asc";
                } else {
                    $this.attr("order", "desc").next()[0].className = "fa fa-sort-alpha-desc";
                }
                var order = $this.attr("order");
                var sortFiled = $this.attr("name");
                $this_.options.data.sort(function(obj1, obj2) {
                    if (order === 'desc') {
                        if (typeof obj2[sortFiled] === 'string') {
                            return obj2[sortFiled].localeCompare(obj1[sortFiled]);
                        } else {
                            return obj2[sortFiled] - obj1[sortFiled];
                        }
                    } else {
                        if (typeof obj2[sortFiled] === 'string') {
                            return obj1[sortFiled].localeCompare(obj2[sortFiled]);
                        } else {
                            return obj1[sortFiled] - obj2[sortFiled];
                        }
                    }
                });
                $this_._appendRow();
            });
        }
    };
    this.options = $.extend(__DEFAULT__, options);
    $.extend(this, __PROTO__);
    this._init();
}

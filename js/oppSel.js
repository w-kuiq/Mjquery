//构造函数
function Antpull(options) {
    this.options = options;
    this._init();
    this._handle();
}
Antpull.prototype = {
    //初始化数据
    _init: function() {
        this.dom = document.createElement("div");
        this.dom.className = "antpull";
        this.input = document.createElement("input");
        this.input.className = "input";
        this.input.placeholder = this.options.placeholder;
        this.list = document.createElement("ul");
        this.list.className = "hide";
        this.dom.appendChild(this.input);
        this.fa = document.createElement("i");
        this.fa.className = "fa fa-angle-down sel";
        this.dom.appendChild(this.fa);
        var item;
        for (var i = 0; i < this.options.data.length; i++) {
            li = document.createElement("li");
            li.innerHTML = this.options.data[i];
            this.list.appendChild(li);
        }
        this.dom.appendChild(this.list);
        this.options.position.appendChild(this.dom);
    },
    _handle: function() {
        var _this = this;
        for (var i = 0; i < this.list.children.length; i++) {
            this.list.children[i].onmouseenter = function() {
                _this.input.value = this.innerHTML;
            }
        }
    }
}

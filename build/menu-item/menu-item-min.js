YUI.add("menu-item",function(e,t){function n(t,r){r||(r={}),this.id=this._yuid=r.id||e.guid("menuItem-"),this.type=r.type||"item",this.url=r.url||"#",n.superclass.constructor.call(this,t,r)}e.extend(n,e.Tree.Node,{_serializable:e.Tree.Node.prototype._serializable.concat("type","url"),disable:function(){return this.state.disabled=!0,this},enable:function(){return delete this.state.disabled,this},isDisabled:function(){return!!this.state.disabled}}),e.namespace("Menu").Item=n},"@VERSION@",{requires:["oop","tree-node"]});

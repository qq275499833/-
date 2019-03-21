function lisphone(){
	$(".list_phone").slideToggle();
}
localStorage.setItem('url',window.location.href);
//跳转到购买页面
function go_buy() {
	document.getElementById("content_buy").scrollIntoView(true);
}
function check_top(){
	var ele_top = $('.goodsPrice').offset().top;
	var top = (window.innerHeight ? window.innerHeight : $(window).height()) + $(window).scrollTop();
	if(top >= ele_top){
		$('.buy_btn').hide();
	}else{
		$('.buy_btn').show();
	}
}
//跳转到顶部
function go_top() {
	document.getElementById("app").scrollIntoView(true);
}
//关闭购买成功信息
function closeSuccess(){
	$(".after_buyNow").removeClass("show");
	$(".black_overlay").removeClass("show");
}
//打开购买成功信息
function show_successwin(){
	$(".after_buyNow").addClass("show");
	$(".black_overlay").addClass("show");
}
function show_pop_car(){
	window.setTimeout("$('.pop_up_car').hide()",1000);//3000毫秒后，隐藏你的DIV
}
//tools
var tools = {
	show_msg:function (info, time) {
		if(typeof(layer.tab) === 'function') {
			layer.msg(info);
		}else{
			layer.open({
				content: info,
				skin: 'msg',
				time: time || 2
			});
		}
	},
	show_loading:function (info, time) {
		if(typeof(layer.tab) === 'function') {
			layer.load(2, {time:(time || 15) * 1000});
		}else{
			layer.open({
				type: 2,
				shadeClose: false,
				content: info||'加载中',
				time: time || 15
			});
		}
	},
	show_win:function(content) {
		$(content).show();
	},
	close_win:function(con){
		$(con).hide();
	},
	close_all:function () {
		layer.closeAll();
	}
};
var siteId=appData.sitedir;
var data,index=0,submiting = false;
function indexData(site){
	$.get("/indexData/" + site).success(function (data1) {
		if(data1.Error) {
			tools.show_msg(data1.Info[appData.language]);
			if(index<3){
				indexData(siteId);
				index++;
			}else{
				return false;
			}
		}else{
			data=data1;
			loadData(data);
		}
	})
}
indexData(siteId);
function loadData(data){
	var app=new Vue({
		el: '#app',
		delimiters: ['[[', ']]'],
		data: {
            mark:1,
            check:1,//0
            extrapay:'',
            flag2:3,
            flag1:1,
			addnum: 1,
			apiserver:data.apiserver,
			detail:data.detail,
			cdnbase:data.cdnbase,
			name_list:data.detail.specs.name_list,
			option1_list:data.detail.specs.option1_list,
			option2_list:data.detail.specs.option2_list,
			option1_show:data.detail.specs.option1_list.length,
			option2_show:data.detail.specs.option2_list.length,
			prods:{
				id: data.detail.id,
				sourceid: data.detail.source,
				userkey: data.detail.userkey,
				name:data.detail.name,
				specname: '',
				sku: '',
				price: 0,
				img: '',
				option1: '',
				option2: '',
				number: 1
			},
            manyoff_new: data.detail.manyoff_new?JSON.parse(data.detail.manyoff_new):"",
            manyoff: data.detail.manyoff?JSON.parse(data.detail.manyoff):"",
            saleoff: data.detail.saleoff?JSON.parse(data.detail.saleoff):"",
            count_info: data.detail.count_info?JSON.parse(data.detail.count_info):"",
            giftGoodsSpec:data.detail.giftGoodsSpecsStr?JSON.parse(data.detail.giftGoodsSpecsStr):"",
            moneyprice: 0,
            priceoff: data.detail.priceoff ? JSON.parse(data.detail.priceoff) : "",
			allPrice:0,
			manyoff_price:0,
			saleoff_price:0,
			realPrice:0,
			getProduct:[],
			clientinfo : {
				clientname:"",
				clientphone:"",
				clientaddress:"",
				clientemail:"",
				clientzipcode:"",
				city:"",
				area:"",
				clientotherinfo:"",
			},
			orderid:0,
			order_clientaddress:"",
			order_clientname:"",
			orderprice:0,
			order_clientphone:"",
			commentList:[],
			comment_phone:"",
			comment_body:"",
			cityData:[],
			areaData:[],
			codeData:[],
			expressinfo:"",
			orders:[],
			remnant:0,
			fblink:data.detail.fblink?data.detail.fblink:data.detail.User.fblink,
			linelink:data.detail.linelink?data.detail.linelink:data.detail.User.linelink,
			whatsapplink:data.detail.whatsapplink?data.detail.whatsapplink:data.detail.User.whatsapplink,
			templist1:[],
			templist2:[],
            giftLength:1,
            giftSelect:{},
            area:{},
            city:{}
		},
		created:function(){
			//选择城市
			this.init_Select_City(this.detail.money,null,'city');
            //初始化赠品
            this.initgift();
		},
		mounted:function(){
			//swiper
			new Swiper ('.swiper-container', {
				autoHeight: true,
				loop: true,
				// 如果需要分页器
				pagination: '.swiper-pagination',
				// 如果需要前进后退按钮
				nextButton: '.swiper-button-next',
				prevButton: '.swiper-button-prev'
			});
			//默认选中一级规格
			for (var i in this.name_list) {
				var spec = this.name_list[i];
				if (spec.isdefault===1) {
					this.select_specitem_nocart(spec,1);
					break;
				}
			}
			this.calc_price_nocart();
            //赠品默认选中一级规格
            if(this.giftSelect[0].length){
                for(var i in this.giftGoodsSpec){
                    for(var j in this.giftGoodsSpec[i]){
                        var giftspec=this.giftGoodsSpec[i][j];
                        if(giftspec.isdefault===1){
                            for(var k=1;k<=this.giftLength;k++){
                                this.select_giftspec(giftspec,i,k);
                            }

                        }
                    }
                }
            }
		},
		methods: {
			//计算备注剩余文字
			descInput:function(){
				var txtVal = this.clientinfo.clientotherinfo.length;
				this.remnant = txtVal;
			},
			//数量按钮
			decNum:function(){
				this.addnum>1?this.addnum-=1:this.addnum = 1;
				$('#addnum').val(this.addnum);
				this.calc_price_nocart();
			},
			addNum:function(){
				this.addnum+=1;
				$('#addnum').val(this.addnum);
				this.calc_price_nocart();
			},
            //初始化赠品
            initgift:function(){
                if(this.detail.gifts){
                    for (var i=0;i<JSON.parse(this.detail.giftGoodsIds).length;i++){
                        var giftid=JSON.parse(this.detail.giftGoodsIds)[i].id;
                        var gift=[{
                            id: giftid,
                            specname: '',
                            sku: '',
                            price: 0,
                            img: '',
                            option1: '',
                            option2: '',
                            number: 1
                        }];
                        this.giftSelect[i]=gift;
                    }
                    this.giftSelect=JSON.parse(JSON.stringify(this.giftSelect));
                }

            },
			// 二级数组去重并重新排列
			check_option1_repeat(list,num) {
				let option1list = [];
				if (this.prods.specname) {
					for (var i in list) {
						if (list[i].name === this.prods.specname) {
							if (option1list.indexOf(list[i].option1) < 0) {
								this.templist1.push(list[i]);
								option1list.push(list[i].option1);
							}
						}
					}
					for (var i in list) {
						if (option1list.indexOf(list[i].option1) < 0) {
							//查找二级规格是否已经存在
							this.templist1.push(list[i]);
							option1list.push(list[i].option1);
						}
					}
				} else {
					for (var i in list) {
						if (option1list.indexOf(list[i].option1) < 0) {
							this.templist1.push(list[i]);
							option1list.push(list[i].option1);
						}
					}
				}
				return this.templist1;
			},
			// 三级数组去重并重新排列
			check_option2_repeat(list,num) {
				let option2list = [];
				if (this.prods.option1&&this.prods.specname) {
					for (let i in list) {
						if (list[i].name === this.prods.specname&&list[i].option1 === this.prods.option1) {
							if (option2list.indexOf(list[i].option2) < 0) {
								this.templist2.push(list[i]);
								option2list.push(list[i].option2);
							}
						}
					}
					for (var i in list) {
						if (option2list.indexOf(list[i].option2) < 0) {
							this.templist2.push(list[i]);
							option2list.push(list[i].option2);
						}
					}
				} else {
					for (var i in list) {
						if (option2list.indexOf(list[i].option2) < 0) {
							this.templist2.push(list[i]);
							option2list.push(list[i].option2);
						}
					}
				}
				return this.templist2;
			},
			//一级规格点击事件
			select_specitem_nocart: function (item, num) {
				this.prods.specname = item.name;
				this.prods.img = item.img;
				this.prods.option1="";
				this.prods.option2="";
				this.prods.price = "";
				this.prods.sku = "";
				if(this.option1_list.length===0){
					this.prods.price = item.price;
					this.prods.sku = item.id;
					this.getProduct=item;
					this.calc_price_nocart();
				}else{
					var arr=[],option1_list=[];
					this.templist1=[];
					this.check_option1_repeat(this.detail.GoodsSpecs,num);
					for(var i in this.detail.GoodsSpecs){
						if(this.prods.specname===this.detail.GoodsSpecs[i].name){
							if (option1_list.indexOf(this.detail.GoodsSpecs[i].option1) < 0) {
								arr.push(i);
								option1_list.push(this.detail.GoodsSpecs[i].option1);
							}
						}
					}
					if(arr.length===1){
						this.select_option1_nocart(this.detail.GoodsSpecs[arr[0]],num);
						arr=null;
					}
				}
			},
			//二级规格选中和禁止选中
			check_option1_disable:function(item){
				for(var i in this.templist1){
					if(this.templist1[i].name===this.prods.specname&&this.templist1[i].option1===item.option1){
						return false;
					}
				}
				return true;
			},
			check_option1_active:function(item){
				for(var i in this.templist1) {
					if(this.prods.option1 === item.option1 && this.prods.specname === this.templist1[i].name){
						return true;
					}
				}
			},
			//二级规格点击事件
			select_option1_nocart: function (item, num) {
				this.prods.option1 = item.option1;
				this.prods.option2="";
				this.prods.price = "";
				this.prods.sku = "";
				if(this.option2_list.length===0){
					for(var i in this.templist1){
						if(this.templist1[i].name===this.prods.specname && this.templist1[i].option1===this.prods.option1){
							this.prods.price = this.templist1[i].price;
							this.prods.sku = this.templist1[i].id;
							this.getProduct = this.templist1[i];
							this.calc_price_nocart();
						}
					}
				}else{
					var arr=[],option2_list=[];
					this.templist2=[];
					this.check_option2_repeat(this.detail.GoodsSpecs,num);
					for(var i in this.detail.GoodsSpecs){
						if(this.prods.option1===this.detail.GoodsSpecs[i].option1&&this.prods.specname===this.detail.GoodsSpecs[i].name){
							if (option2_list.indexOf(this.detail.GoodsSpecs[i].option2) < 0) {
								arr.push(i);
								option2_list.push(this.detail.GoodsSpecs[i].option2);
							}
						}
					}
					if(arr.length===1){
						this.select_option2_nocart(this.detail.GoodsSpecs[arr[0]],num);
						arr=null;
					}
				}
			},
			//三级规格选中和禁止选中
			check_option2_disable:function(item){
				for(var i in this.templist2){
					if(this.templist2[i].name===this.prods.specname&&this.templist2[i].option1===this.prods.option1&&this.templist2[i].option2===item.option2){
						return false;
					}
				}
				return true;
			},
			check_option2_active:function(item){
				for(var i in this.templist2) {
					if(this.prods.option2 === item.option2 &&this.templist2[i].option1===this.prods.option1&& this.prods.specname === this.templist2[i].name){
						return true;
					}
				}
			},
			//三级规格点击事件
			select_option2_nocart: function (item) {
				this.prods.option2 = item.option2;
				this.prods.price = "";
				this.prods.sku = "";
				for(var i in this.templist2){
					if(this.templist2[i].name===this.prods.specname && this.templist2[i].option1===this.prods.option1 && this.templist2[i].option2===this.prods.option2){
						this.prods.price = this.templist2[i].price;
						this.prods.sku = this.templist2[i].id;
						this.getProduct = this.templist2[i];
						this.calc_price_nocart();
					}
				}
			},
			//当没有二级规格时判断缺货
			stockout1:function(item){
				for(var i in this.detail.GoodsSpecs){
					var spec=this.detail.GoodsSpecs[i];
					if(this.prods.specname===spec.name){
						for(var j in this.templist1){
							if(this.templist1[j].option1===spec.option1&&this.templist1[j].option1===item.option1){
								if(this.option2_show===0){
									if(spec.inventory===0){
										return true;
									}else{
										return false;
									}
								}
							}
						}
					}
				}
			},
			//当有二级规格时判断缺货
			stockout2:function(item){
				for(var i in this.detail.GoodsSpecs) {
					var spec = this.detail.GoodsSpecs[i];
                    if (this.prods.specname === spec.name&&this.prods.option1 === spec.option1) {
						for (var j in this.templist2) {
							if (this.templist2[j].option2 === spec.option2 && this.templist2[j].option2 === item.option2) {
								if (spec.inventory === 0) {
									return true;
								} else {
									return false;
								}
							}
						}
					}
				}
			},
            // 赠品二级数组去重并重新排列
            check_giftoption1_repeat(list,index1,num) {
                var templist = [];
                var option1list = [];
                if (this.giftSelect[index1][num-1].specname) {
                    for (var i in list) {
                        if (list[i].name === this.giftSelect[index1][num-1].specname) {
                            if (option1list.indexOf(list[i].option1) < 0) {
                                templist.push(list[i]);
                                option1list.push(list[i].option1);
                            }
                        }
                    }
                    for (var i in list) {
                        if (option1list.indexOf(list[i].option1) < 0) {
                            //查找二级规格是否已经存在
                            templist.push(list[i]);
                            option1list.push(list[i].option1);
                        }
                    }
                } else {
                    for (var i in list) {
                        if (option1list.indexOf(list[i].option1) < 0) {
                            templist.push(list[i]);
                            option1list.push(list[i].option1);
                        }
                    }
                }
                return templist;
            },
            // 赠品三级数组去重并重新排列
            check_giftoption2_repeat(list,index1,num) {
                var templist = [];
                var option2list = [];
                if (this.giftSelect[index1][num-1].option1&&this.giftSelect[index1][num-1].specname) {
                    for (let i in list) {
                        if (list[i].name === this.giftSelect[index1][num-1].specname&&list[i].option1 === this.giftSelect[index1][num-1].option1) {
                            if (option2list.indexOf(list[i].option2) < 0) {
                                templist.push(list[i]);
                                option2list.push(list[i].option2);
                            }
                        }
                    }
                    for (var i in list) {
                        if (option2list.indexOf(list[i].option2) < 0) {
                            templist.push(list[i]);
                            option2list.push(list[i].option2);
                        }
                    }
                } else {
                    for (var i in list) {
                        if (option2list.indexOf(list[i].option2) < 0) {
                            templist.push(list[i]);
                            option2list.push(list[i].option2);
                        }
                    }
                }
                return templist;
            },
            //赠品一级规格点击事件
            select_giftspec:function(item,giftindex,index){
                this.giftSelect[giftindex][index - 1].specname = item.name;
                this.giftSelect[giftindex][index - 1].img = item.img;
                this.giftSelect[giftindex][index - 1].option1="";
                this.giftSelect[giftindex][index - 1].option2="";
                this.giftSelect[giftindex][index - 1].price ="";
                this.giftSelect[giftindex][index - 1].sku = "";
                if(this.detail.giftGoodsSpecs[giftindex].giftOption1_list.length===0) {
                    this.giftSelect[giftindex][index - 1].price = item.price;
                    this.giftSelect[giftindex][index - 1].sku = item.id;
                }else{
                    var arr=[],giftOption1_list=[];
                    item.templist1= this.check_giftoption1_repeat(this.detail.giftGoods[giftindex].GoodsSpecs,giftindex,index);
                    for(var i in this.giftGoodsSpec){
                        for(var j in this.giftGoodsSpec[i]){
                            if(this.giftSelect[giftindex][index - 1].specname===this.giftGoodsSpec[i][j].name){
                                if (giftOption1_list.indexOf(this.giftGoodsSpec[i][j].option1) < 0) {
                                    arr.push(j);
                                    giftOption1_list.push(this.giftGoodsSpec[i][j].option1);
                                }
                            }
                        }
                    }
                    if(arr.length===1){
                        this.select_giftoption1(this.giftGoodsSpec[giftindex][arr[0]],giftindex,index);
                        arr=null;
                    }
                }
            },
            //赠品二级规格选中和禁用事件
            check_giftOption1_active:function(item,giftindex,index){
                item.templist2= this.check_giftoption1_repeat(this.detail.giftGoods[giftindex].GoodsSpecs,giftindex,index);
                if(item.templist2){
                    for(var i in item.templist2) {
                        if(this.giftSelect[giftindex][index-1].option1 === item.option1 && this.giftSelect[giftindex][index-1].specname === item.templist2[i].name){
                            return true;
                        }
                    }
                }
            },
            check_giftOption1_disable:function(item,giftindex,index){
                item.templist2= this.check_giftoption1_repeat(this.detail.giftGoods[giftindex].GoodsSpecs,giftindex,index);
                if(item.templist2){
                    for(var i in item.templist2){
                        if(item.templist2[i].name===this.giftSelect[giftindex][index-1].specname&&item.templist2[i].option1===item.option1){
                            return false;
                        }
                    }
                    return true;
                }
            },
            //赠品二级规格点击事件
            select_giftoption1:function(item,giftindex,index){
                this.giftSelect[giftindex][index - 1].option1=item.option1;
                this.giftSelect[giftindex][index - 1].option2="";
                this.giftSelect[giftindex][index - 1].price ="";
                this.giftSelect[giftindex][index - 1].sku = "";
                if(this.detail.giftGoodsSpecs[giftindex].giftOption2_list.length===0){
                    item.templist1= this.check_giftoption1_repeat(this.detail.giftGoods[giftindex].GoodsSpecs,giftindex,index);
                    for(var i in item.templist1){
                        if(item.templist1[i].name===this.giftSelect[giftindex][index - 1].specname && item.templist1[i].option1===this.giftSelect[giftindex][index - 1].option1){
                            this.giftSelect[giftindex][index - 1].price = item.templist1[i].price;
                            this.giftSelect[giftindex][index - 1].sku = item.templist1[i].id;
                        }
                    }
                }else{
                    var arr=[],giftOption2_list=[];
                    item.templist2= this.check_giftoption1_repeat(this.detail.giftGoods[giftindex].GoodsSpecs,giftindex,index);
                    for(var i in this.giftGoodsSpec){
                        for(var j in this.giftGoodsSpec[i]){
                            if(this.giftSelect[giftindex][index - 1].option1===this.giftGoodsSpec[i][j].option1 && this.giftSelect[giftindex][index - 1].specname===this.giftGoodsSpec[i][j].name){
                                if (giftOption2_list.indexOf(this.giftGoodsSpec[i][j].option2) < 0) {
                                    arr.push(j);
                                    giftOption2_list.push(this.giftGoodsSpec[i][j].option2);
                                }
                            }
                        }
                    }
                    if(arr.length===1){
                        this.select_giftoption2(this.giftGoodsSpec[giftindex][arr[0]],giftindex,index);
                        arr=null;
                    }
                }
            },
            //赠品三级规格选中和禁用事件
            //赠品三级规格选中和禁用事件
            check_giftOption2_active:function(item,giftindex,index){
                item.templist1= this.check_giftoption2_repeat(this.detail.giftGoods[giftindex].GoodsSpecs,giftindex,index);
                if(item.templist1){
                    for(var i in item.templist1) {
                        if(this.giftSelect[giftindex][index-1].option1 === item.templist1[i].option1 && this.giftSelect[giftindex][index-1].specname === item.templist1[i].name&&this.giftSelect[giftindex][index-1].option2 === item.option2){
                            return true;
                        }
                    }
                }
            },
            check_giftOption2_disable:function(item,giftindex,index){
                item.templist1= this.check_giftoption2_repeat(this.detail.giftGoods[giftindex].GoodsSpecs,giftindex,index);
                if(item.templist1){
                    for(var i in item.templist1){
                        if(item.templist1[i].name===this.giftSelect[giftindex][index-1].specname&&item.templist1[i].option1===this.giftSelect[giftindex][index-1].option1&&item.templist1[i].option2===item.option2){
                            return false;
                        }
                    }
                    return true;
                }
            },
            //赠品三级规格点击事件
            select_giftoption2:function(item,giftindex,index){
                this.giftSelect[giftindex][index - 1].option2=item.option2;
                item.templist2= this.check_giftoption2_repeat(this.detail.giftGoods[giftindex].GoodsSpecs,giftindex,index);
                for(var i in item.templist2){
                    if(item.templist2[i].name===this.giftSelect[giftindex][index - 1].specname && item.templist2[i].option1===this.giftSelect[giftindex][index - 1].option1 && item.templist2[i].option2===this.giftSelect[giftindex][index - 1].option2){
                        this.giftSelect[giftindex][index - 1].price = item.templist2[i].price;
                        this.giftSelect[giftindex][index - 1].sku = item.templist2[i].id;
                    }
                }
            },
            //价格满减排序
            compare(property) {
                return function (a, b) {
                    var value1 = a[property];
                    var value2 = b[property];
                    return value1 - value2;
                }
            },
            com_index(arr, num) {
                for (var i = 0; i < arr.length; i++) {
                    if (arr[i].totalmoney > num) {
                        return i - 1;
                    }
                }
            },
			//计算价格
			calc_price_nocart:function(){
				this.allPrice=0;
				this.manyoff_price=0;
				this.saleoff_price=0;
				this.realPrice=0;
				var prod = this.prods;
				this.allPrice = prod.price * this.addnum;
				this.realPrice = this.allPrice;
				//多件优惠
				for (var i=0 ;i<this.addnum ; i++){
					for (var j in this.manyoff_new) {
						var item = this.manyoff_new[j];
						if (item.salecount === parseInt(i) + 1 && prod.price > 0) {
							this.manyoff_price += item.price;
						}
					}
				}

				this.realPrice = this.allPrice - this.manyoff_price;
				for (var i in this.manyoff) {
					//一口价
					if (this.manyoff[i].salecount === this.addnum) {
						if (this.manyoff[i].price > 0) {
							this.realPrice = this.manyoff[i].price;
						}
					}
				}

				//满减优惠
				if (this.saleoff.length > 0) {
					for (var i in this.saleoff) {
						var r = this.saleoff[i];
						if (this.addnum >= r.salecount) {
							this.saleoff_price = r.offprice;
						}
					}
				}
				this.realPrice = this.realPrice  - this.saleoff_price;
                // 价格满减
                if (this.priceoff.length > 0) {
                    this.priceoff=this.priceoff.sort(this.compare('totalmoney'));
                    var i = this.com_index(this.priceoff, this.realPrice);
                    if (i >= 0) {
                        this.moneyprice = this.priceoff[i].saleprice;
                    } else if (i === undefined) {
                        this.moneyprice = this.priceoff[this.priceoff.length - 1].saleprice;
                    }
                    this.realPrice = this.realPrice - this.moneyprice;
                }

			},
			//提交订单
			submit_order_nocart:function () {
				if(submiting) return;
				if(this.prods.length===0) return;
				var cartinfo = [];
				var prod = this.prods;
				if(!prod.id||!prod.sku||!prod.img||prod.price===0){
					tools.show_msg(selectStr+(parseInt(0)+1));
					return;
				}
				//判断所选商品缺货的弹框
				for(var j in this.detail.GoodsSpecs){
					var spec=this.detail.GoodsSpecs[j];
					if(prod.sku===spec.id){
						if(spec.inventory===0){
							tools.show_msg(selectOos+(parseInt(0)+1)+selectOos1);
							return;
						}
					}
				}
				cartinfo.push({
					id: prod.id,
					sku: prod.sku,
					img: prod.img,
					sitedir: appData.sitedir,
					number: this.addnum
				});
                var giftCartinfo={};
                if(this.detail.giftGoodsIds){
                    for(var i in this.giftSelect){
                        var gifts=[];
                        for(var k in this.giftSelect[i]){
                            var prod = this.giftSelect[i][k];
                            if(!prod.id||!prod.sku){
                                tools.show_msg(selectGiftStr+(parseInt(i)+1));
                                return;
                            }
                            gifts.push({
                                id: prod.id,
                                sku: prod.sku,
                                img: prod.img,
                                sitedir: appData.sitedir,
                                number: this.addnum
                            });
                        }
                        giftCartinfo[i]=gifts;
                    }
                }

				var otherPhone=  /^([0-9]+)$/;
                var name=/^\s*$/;
                if(!this.clientinfo.clientname||name.test(this.clientinfo.clientname)){
                    $('#clientname').focus();
                    return tools.show_msg(nameStr);
                }
                if(!this.clientinfo.clientphone||this.clientinfo.clientphone === ' ') {
                    $('#clientphone').focus();
                    return tools.show_msg(PhoneStr);
                }
                if(this.detail.money!=='円'){
                    this.clientinfo.city=this.city?this.city.name:"";
                    this.clientinfo.area=this.area?this.area.name:"";
                }
                this.clientinfo.remoteMoney = this.extrapay?this.extrapay:0;

                if(this.detail.money!=='￥'&&this.detail.money!=='S$'){
					if(this.clientinfo.city === '城市'||this.clientinfo.city === 'Province'||this.clientinfo.city === 'จังหวัด'||this.clientinfo.city === '区域'||this.clientinfo.city === undefined||this.clientinfo.city ==='都道府県を選択'){
						$('#city').focus();
						return tools.show_msg(cityStr);
					}
					if(this.clientinfo.area === '区县'||this.clientinfo.area === '區縣'||this.clientinfo.area === 'City'||this.clientinfo.area === 'เมือง'||this.clientinfo.area === '區'||this.clientinfo.area === undefined){
						$('#area').focus();
						return tools.show_msg(areaStr);
					}
				}else{
					this.clientinfo.city = "";
					this.clientinfo.area = "";
				}
                let ranges = [
                    '\ud83c[\udf00-\udfff]',
                    '\ud83d[\udc00-\ude4f]',
                    '\ud83d[\ude80-\udeff]'
                ];
                this.clientinfo.clientemail =this.clientinfo.clientemail.replace(new RegExp(ranges.join('|'), 'g'), '');
                this.clientinfo.clientaddress=this.clientinfo.clientaddress.replace(new RegExp(ranges.join('|'), 'g'), '');
                this.clientinfo.clientotherinfo=this.clientinfo.clientotherinfo.replace(new RegExp(ranges.join('|'), 'g'), '');
				if(!this.clientinfo.clientaddress||this.clientinfo.clientaddress === ' ') {
					$('#clientaddress').focus();
					return tools.show_msg(addressStr);
				}
				if(this.detail.money === 'S$'||this.detail.money === 'RM'||this.detail.money === '฿'){
					if(!this.clientinfo.clientzipcode||this.clientinfo.clientzipcode === ' '||!otherPhone.test(this.clientinfo.clientzipcode)) {
						$('#clientzipcode').focus();
						return tools.show_msg(postcodeStr);
					}
					if(this.detail.money === 'RM'&&this.clientinfo.clientzipcode.length!==5){
						$('#clientzipcode').focus();
						return tools.show_msg(postcodeStr);
					}
				}
				if(this.clientinfo.clientemail&&!Email.test(this.clientinfo.clientemail)){
					$('#clientemail').focus();
					return tools.show_msg(emailStr);
				}
				submiting=true;
				tools.show_loading(submitingStr, 30);
				$.ajax({
					type:"POST",
					url:'/createorder',
					contentType:"application/json",
					data: JSON.stringify({
						goodsinfo: {sitedir:this.detail.sitedir},
						cartinfo: cartinfo,
                        giftCartinfo:giftCartinfo,
						clientinfo: this.clientinfo,
						referrer:document.referrer?document.referrer:'直接进入',
						siteurl: window.location.href
					}), 
					error:function (data) {
						tools.close_all();
						submiting=false;
						tools.show_msg(submiterrorStr);
						$('#submit_btn').attr('disabled',false);
					},
					success:function(data){
						tools.close_all();
						submiting=false;
						if(data.Error){
                            app.$nextTick(function() {
                                tools.show_msg(data.Info[this.detail.language]);
                            })
						}
						else{
							app.$nextTick(function(){
								var realprice = this.realprice;
								if(typeof fbq === "function"){
									var currency = 'TWD';
									if(this.detail.money === 'RM')
										currency = 'MYR';
									if(this.detail.money === 'HK')
										currency = 'HKD';
									else if(this.detail.money === 'S$')
										currency = 'SGD';
									else if(this.detail.money === '฿')
										currency = 'THB';
									fbq('track', 'Purchase',{
										value: realprice,
										currency: currency
									});
								}
								if(typeof run_sale_code === "function"){
									run_sale_code();
								}
								this.cartinfo = {
									clientname: "",
									clientphone: "",
									clientaddress: "",
									clientemail: "",
									clientzipcode: "",
									city: "",
									area: "",
									clientotherinfo: "",
								};
								this.orderid = data.orderInfo.orderid;
								this.order_clientname = data.orderInfo.clientname;
								this.order_clientaddress = data.orderInfo.clientaddress;
								this.order_clientphone = data.orderInfo.orderphone;
								this.orderprice = data.orderInfo.orderprice;
								show_successwin();
							})
						}
					}
				});
			},
            /*邮编选择*/
            changeCode: function(moneyflag){//moneyflag
                var that = this;
                //var code = ($('#clientzipcode').children(":selected").val())?($('#clientzipcode').children(":selected").val()):($('#clientzipcode').val());
                var code= this.clientinfo.clientzipcode;
				if((moneyflag === '฿')||(moneyflag === 'RM')||(moneyflag === 'S$')){
                    var cityState1;
                    if(moneyflag === '฿'){
                        cityState1 = 3;
                    }else if(moneyflag === 'RM'){
                        cityState1 = 4;
                    }else if(moneyflag === 'S$'){
                        cityState1 = 5;
                    }
                    if(code!==null){//appData.apiserver+
                        $.get("/comment/remote1/" + code +"/" + cityState1).success(function(data){
                            if(data.Error){

                            }else{
                                if((data.cityMess.cityinfo === null)||(data.cityMess.cityinfo.isallow === '禁止')){
                                    that.flag2 = 3;
                                    that.flag1 = 1;
                                    that.extrapay =0;
                                }else if(data.cityMess.cityinfo.isArrive === 0){
                                    that.flag2 = 0;
                                    that.flag1 = 0;
                                    that.extrapay =0;
                                }else if(data.cityMess.cityinfo.isArrive === 1){
                                    that.flag2 = 1;
                                    that.flag1 = 0;
                                    that.extrapay = data.cityMess.cityinfo.extrapay;
                                    if(that.check === 1){
                                        that.flag1 = 1;
                                    }else{
                                        that.flag1 = 0;
                                    }
                                }
                            }
                        })
                    }
                }
            },
			//地址选择
			init_Select_City: function (code, id, ele) {
            	var that = this;
				if (ele === 'city') {
					$.getJSON('/api/getSubAddressList?countryCode='+code, function (data) {
						app.$nextTick(function () {
							this.cityData = data;
							this.clientinfo.city = this.cityData[0];
						})
					});
				} else {
					$.getJSON('/api/getSubAddressList?countryCode='+code+'&addressId='+ id.id, function (data) {
						if (ele === 'area') {
							app.$nextTick(function () {
								this.areaData = data;
								this.clientinfo.area = this.areaData[0];
							})
						} else {
							app.$nextTick(function () {
								this.codeData = data;
							})
						}
					})
				}
                if((code === 'HK')||(code === 'NT')||(code === 'Rp')){
                    /*var cityArea = this.city.name;
                    var cityTest = this.area.name;*/
                    var cityArea = that.city.name;
                    var cityTest = that.area.name;
                    var cityState;
                    if(code === 'HK'){
                        cityState = 1;
                    }else if(code === 'NT'){
                        cityState = 0;
                    }else if(code === 'Rp'){
                        cityState = 2;
                    }
                    if(cityArea!== null){
                        var all ='全部';
                        $.get("/comment/remote2/"+ cityState+'/' +cityArea+'/'+all).success(function(data3){
                            if(data3.Error){

                            }else{
                                if(data3.cityMess.cityinfo === null){
                                    if(cityTest!== null){
                                        $.get("/comment/remote/" + cityTest +'/' + cityState+'/' +cityArea).success(function (data1) {
                                            if (data1.Error) {
                                                /*  tools.show_msg(data1.Info[appData.language]);*/
                                            } else {
                                                if((data1.cityMess.cityinfo === null)||(data1.cityMess.cityinfo.isallow === '禁止')){
                                                    that.flag2 = 3;
                                                    that.flag1 = 1;
                                                    that.extrapay =0;
                                                }else if(data1.cityMess.cityinfo.isArrive === 0){
                                                    that.flag2 = 0;
                                                    that.flag1 = 0;
                                                    that.extrapay =0;
                                                }else if(data1.cityMess.cityinfo.isArrive === 1){
                                                    that.flag2 = 1;
                                                    that.flag1 = 0;
                                                    that.extrapay = data1.cityMess.cityinfo.extrapay;
                                                    if(that.check === 1){
                                                        that.flag1 = 1;
                                                    }else{
                                                        that.flag1 = 0;
                                                    }
                                                }

                                            }
                                        });
                                    }
                                }else{
                                    if(data3.cityMess.cityinfo.isallow === '禁止'){
                                        that.flag2 = 3;
                                        that.flag1 = 1;
                                        that.extrapay = 0;
                                    }else if((data3.cityMess.cityinfo.isallow === '允许')&&(data3.cityMess.cityinfo.isArrive === 0)){
                                        that.flag2 = 0;
                                        that.flag1 = 0;
                                        that.extrapay = 0;
                                    }else if((data3.cityMess.cityinfo.isallow === '允许')&&(data3.cityMess.cityinfo.isArrive === 1)){
                                        that.flag2 = 1;
                                        that.flag1 = 0;
                                        that.extrapay = data3.cityMess.cityinfo.extrapay;
                                        if(that.check === 1){
                                            that.flag1 = 1;
                                        }else{
                                            that.flag1 = 0;
                                        }
                                    }
                                }
                            }
                        })
                    }
                    //

                    //
                }else if((code === '฿')||(code === 'RM')||(code === 'S$')){//另外的城市
                    /* var cityArea = this.city.name;
                     var cityTest = this.area.name;*/
                    var cityArea = that.city.name;
                    var cityTest = that.area.name;
                    var cityState1;
                    if(code === '฿'){
                        cityState1 = 3;
                    }else if(code === 'RM'){
                        cityState1 = 4;
                    }else if(code === 'S$'){
                        cityState1 = 5;
                    }
                    if(cityArea!== null){
                        var all ='全部';
                        $.get("/comment/remote2/"+ cityState1+'/' +cityArea+'/'+all).success(function(data3){
                            if(data3.Error){

                            }else{
                                if(data3.cityMess.cityinfo === null){
                                    if(cityTest!== null){
                                        //根据地区查邮编为全部的，
                                        var zip = '全部';
                                        $.get("/comment/remote3/"+ cityState1+'/' +cityArea+'/'+zip+'/'+cityTest).success(function(data4){
                                            if(data4.Error){

                                            }else{
                                                if(data4.cityMess.cityinfo === null){
                                                    //this.changeCode();//去掉change事件
                                                    that.flag2 = 3;
                                                    that.flag1 = 1;
                                                    that.extrapay = 0;
                                                    that.mark = 1;
                                                }else{
                                                    that.mark = 0;
                                                    if(data4.cityMess.cityinfo.isallow === '禁止'){
                                                        that.flag2 = 3;
                                                        that.flag1 = 1;
                                                        that.extrapay = 0;
                                                    }else if((data4.cityMess.cityinfo.isallow === '允许')&&(data4.cityMess.cityinfo.isArrive === 0)){
                                                        that.flag2 = 0;
                                                        that.flag1 = 0;
                                                        that.extrapay = 0;
                                                    }else if((data4.cityMess.cityinfo.isallow === '允许')&&(data4.cityMess.cityinfo.isArrive === 1)){
                                                        that.flag2 = 1;
                                                        that.flag1 = 0;
                                                        that.extrapay = data4.cityMess.cityinfo.extrapay;
                                                        if(that.check === 1){
                                                            that.flag1 = 1;
                                                        }else{
                                                            that.flag1 = 0;
                                                        }
                                                    }
                                                }
                                            }
                                        })
                                    }
                                }else{
                                    that.mark = 0;
                                    if(data3.cityMess.cityinfo.isallow === '禁止'){
                                        that.flag2 = 3;
                                        that.flag1 = 1;
                                        that.extrapay = 0;
                                    }else if((data3.cityMess.cityinfo.isallow === '允许')&&(data3.cityMess.cityinfo.isArrive === 0)){
                                        that.flag2 = 0;
                                        that.flag1 = 0;
                                        that.extrapay = 0;
                                    }else if((data3.cityMess.cityinfo.isallow === '允许')&&(data3.cityMess.cityinfo.isArrive === 1)){
                                        that.flag2 = 1;
                                        that.flag1 = 0;
                                        that.extrapay = data3.cityMess.cityinfo.extrapay;
                                        if(that.check === 1){
                                            that.flag1 = 1;
                                        }else{
                                            that.flag1 = 0;
                                        }
                                    }
                                }
                            }
                        })
                    }

                }
			},
            getValue:function(){
                var that = this;
                var checked = document.getElementById("remote");
                if(checked.checked){
                    that.flag1 = 1;
                }else{
                    that.flag1 = 0;
                }
            },
			//查询订单
			find_order:function () {
				var expressinfo = this.expressinfo;
				if(!expressinfo){
					return tools.show_msg(findStr);
				}
				$('.find-btn').text('wait 10s');
				$('.find-btn').attr('disabled',"true").addClass("disabled");
				var time = 9;
				var id = setInterval(function () {
					$('.find-btn').text('wait ' + time +'s');
					time--;
					if(time === -1){
						$('.find-btn').removeAttr('disabled').removeClass("disabled");
						$('.find-btn').text(findbtnStr);
						clearInterval(id);
					}
				},1000);
                $.post(this.apiserver+"/queryorder/", {
                    expressinfo:expressinfo,
                    url:window.location.href
                }, function(data) {
					tools.close_all();
					if(data.Error){
						app.$nextTick(function() {
							tools.show_msg(data.Info[this.detail.language]);
						})
					}else{
						app.$nextTick(function() {
							this.orders = data.orders;
						})
					}
				});
			},
			//关闭订单信息
			close_orderinfo:function (){
				this.expressinfo="";
				$('.find-btn').removeAttr('disabled').removeClass("disabled");
				this.orders=[];
			},

		}
	});
}


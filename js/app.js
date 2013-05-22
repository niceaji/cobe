

var ItemModel = Backbone.Model.extend({

	parse : function(data){

		// console.log(data)
		data.content = data.content.trim().replace(/\r\n/g,"<br>");
		data.newsDate = (data.newsDate) ? moment(data.newsDate,"YYYYMMDDHHmmss").format("YYYY-MM-DD HH:mm") : "";
		



		return data;

	}
	
});



var ItemCollection = Backbone.Collection.extend({
	model : ItemModel

});



var ItemView = Backbone.View.extend({

	// el : $('.item-wrap'),
	// className :'item-parent',
	template : _.template($('#itemViewTemplate').html()),
	events : {
		"click .time" : "goPermalink"
	},

	initialize : function(){

	},
	goPermalink : function(e){
		$(window).scrollTop(this.$el.offset().top);


		$('div.selected').removeClass('selected');
		this.$el.addClass("selected");

		workspaceRouter.navigate( selectedDateString +"/"+ this.model.id , {trigger: false});
		return false;
	},
	render :function(){
		// console.log(this.model.toJSON())
		this.$el.append( this.template( this.model.toJSON() ) );
		return this;
	}

});




var AppView = Backbone.View.extend({

	el : '.item-wrap',

	initialize : function(){

		this.collection = new ItemCollection();

		this.listenTo(this.collection, "reset", this.addAll );
		this.listenTo(this.collection, "error", this.error );

		this.setDatePicker();
	},
	error : function(){
		this.$el.html("<h4>데이터가 없습니다!</h4>");
	},
	loadCollection : function(dateString){
		// this.collection.url = 'data/'+NOW_DATE+'.js';
		this.showDate(dateString);
		this.collection.url = 'data/'+dateString+'.js';
		this.collection.fetch({reset:true});
	},

	showDate : function(dateString){
		$('#datepicker input').val( dateString );
	},
	setDatePicker : function(){

		// var picker = $('#datetimepicker').datetimepicker({
		// 		pickTime: false
		// 	,	startDate : moment("20130521","YYYYMMDD").toDate()
		// 	// maskInput : false
		// });

		// picker.on("changeDate",function(e){

		// 	// console.log(e.date.toString());

		// 	workspaceRouter.navigate( moment(e.date).format("YYYY-MM-DD"), {trigger: true});
		// 	// location.href='#'+moment(e.date).format("YYYY-MM-DD");

		// });

		$("#datepicker").datepicker({
				language : 'kr'
			,	startDate :  moment("20130521","YYYYMMDD").toDate()
			,	todayHighlight : true
	
		}).on("changeDate",function(e){

			workspaceRouter.navigate( moment(e.date).format("YYYY-MM-DD"), {trigger: true});
		// 	// location.href='#'+moment(e.date).format("YYYY-MM-DD");

		});
	},
	addAll : function(){

		// console.log(this.collection.models)
		this.$el.html('');
		this.collection.each(function(item,index){

			item.set({index:index});
			this.$el.append( new ItemView({model:item}).render().$el );

		}.bind(this));


		
		$(".timeago").timeago();

		var paths = Backbone.history.getHash().split("/");
		if(paths[1]){
			$('#p'+paths[1]+" .time").click();
		}

	},


});


var selectedDateString = "";

var WorkspaceRouter = Backbone.Router.extend({

	routes : {
			":date" : "change",
			":date/:id" : "change"
	},
	initialize : function(){

		this.appView = new AppView();
		Backbone.history.start();

		if(!location.hash){
			this.navigate(NOW_DATE, {trigger: true});
		}
	},
	change : function(dateString, id){
		selectedDateString = dateString;

		this.appView.loadCollection( dateString );
	}

});

workspaceRouter = new WorkspaceRouter();

















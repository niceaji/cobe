


var ItemModel = Backbone.Model.extend({

	parse : function(data){

		// console.log(data)
		data.content = data.content.trim().replace(/\r\n/g,"<br>");
		
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

	},

	initialize : function(){

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
		$('#datetimepicker input').val( dateString );
	},
	setDatePicker : function(){

		var picker = $('#datetimepicker').datetimepicker({
				pickTime: false
			,	startDate : moment("20130522","YYYYMMDD").toDate()
			// maskInput : false
		});

		picker.on("changeDate",function(e){

			// console.log(e.date.toString());
			workspaceRouter.navigate( moment(e.date).format("YYYY-MM-DD"), {trigger: true});

		});
	},
	addAll : function(){

		// console.log(this.collection.models)

		this.collection.each(function(item,index){

			item.set({index:index});
			this.$el.append( new ItemView({model:item}).render().$el );

		}.bind(this));

		$(".timeago").timeago();
	}

});

// var selectedDate


var WorkspaceRouter = Backbone.Router.extend({

	routes : {
		":date" : "changeDate"
	},
	initialize : function(){

		this.appView = new AppView();
		Backbone.history.start();

		if(!location.hash){
			this.navigate(NOW_DATE, {trigger: true});
		}
	},
	changeDate : function(dateString){
		this.appView.loadCollection( dateString );
	}

});

var workspaceRouter = new WorkspaceRouter();

















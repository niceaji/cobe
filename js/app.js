var ItemModel = Backbone.Model.extend({

	
});
var ItemCollection = Backbone.Collection.extend({
	model : ItemModel
});
var ItemView = Backbone.View.extend({

	// el : $('.item-wrap'),
	template : _.template($('#itemViewTemplate').html()),

	initialize : function(){

		this.collection = new ItemCollection();
		this.listenTo(this.collection, "reset", this.render );
		// this.listenTo(this.model, "add" , this.render);
		
		this.collection.url = 'data/20130516.js';
		this.collection.fetch({reset:true});


	},
	render :function(){

		console.log(arguments)

		this.$el.append( this.template() );


		return this;


	}

});
var AppView = Backbone.View.extend({


});

new ItemView();
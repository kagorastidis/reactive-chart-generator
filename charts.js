
stats = new Mongo.Collection("stats");

if (Meteor.isClient) {

 Template.charts.created = function() {  
  this.getData = function() {
     arr = [];
      query = stats.find().fetch();
      for(var i=0; i<query.length; i++){
        arr.push(parseInt(query[i].stat))
      }
    data = {
        labels: ["January", "February", "March", "April", "May", "June", "July","August","September","October","November","December"],
        datasets: [
        {
            label: "My First dataset",
            fillColor: "rgba(220,220,220,0.2)",
            strokeColor: "tomato",
            pointColor: "rgba(220,220,220,1)",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(220,220,220,1)",
            data: arr
        }
      
        ]
        };
    return data;
  },

  this.getCanvas = function(){
    ctx = document.getElementById("myChart").getContext("2d");
    return ctx;
  },

  this.drawChart = function(){

  },

  this.downloadChart = function download(filename) {
    var e = document.createElement('a');
    e.setAttribute('href', myLineChart.toBase64Image());
    e.setAttribute('download', filename);

    if (document.createEvent) {
        var event = document.createEvent('MouseEvents');
        event.initEvent('click', true, true);
        e.dispatchEvent(event);
    }
    else {
        e.click();
    }
  }
};
  

  Template.charts.helpers({

   
  });

  Template.charts.events({
    'submit .stats':function(e){
      e.preventDefault();
      var stat = e.target.stat.value
      e.target.stat.value = "";
      if(query.length < 12){
        Meteor.call('addStat',stat);
        var template = Template.instance();
        setTimeout(function(){
        myLineChart = new Chart(template.getCanvas()).Line(template.getData(), options);

        }, 100)
      }else{
        alert("You reached the max limit 12 months. You can save this chart and make a new one.");
      }
      
      
      
    },

    'click .removeLast':function(e){
      e.preventDefault();
      Meteor.call("removeLast");
      var template = Template.instance();
      setTimeout(function(){
      myLineChart.destroy();
      myLineChart = new Chart(template.getCanvas()).Line(template.getData(), options);
      }, 1000)  
    },

    'click .remove':function(e){
      e.preventDefault();
      Meteor.call("removeAll");
      var template = Template.instance();
      setTimeout(function(){
      myLineChart.destroy();
      myLineChart = new Chart(template.getCanvas()).Line(template.getData(), options);
      }, 100)
    },

    'click .download':function(){
      var template = Template.instance();
      template.downloadChart('chart');
    }



  });


Template.charts.rendered = function(){

  var template = Template.instance();
  setTimeout(function(){
  myLineChart = new Chart(template.getCanvas()).Line(template.getData(), options);
  }, 1000)

}




}



if (Meteor.isServer) {
Meteor.methods({

  'removeAll':function(){
    return stats.remove({});
  },

  'removeLast':function(){
    var removeLast = stats.findOne({}, {sort:{$natural:-1}})
    return stats.remove({_id:removeLast._id})
 
  },

  'addStat':function(stat){
    stats.insert({stat:stat});
  }

});


}

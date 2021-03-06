
if (Meteor.isClient) {

 Template.charts.created = function() {  

  this.getData = function() {
     arr = [];
      query = stats.find({ user: Meteor.userId()  }).fetch();
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

  this.toggleLoader = function(){

  $("#loader").toggleClass('hidden');

  },

  this.getChartType = function(chartType){
    switch (chartType) {
        case "Line":
           myLineChart = new Chart(this.getCanvas()).Line(this.getData(), options);
          break;
        case "Bar":
           myLineChart = new Chart(this.getCanvas()).Bar(this.getData(), options);
          break;
        case "Radar":
           myLineChart = new Chart(this.getCanvas()).Radar(this.getData(), options);
          break;
        default:
          myLineChart = new Chart(this.getCanvas()).Line(this.getData(), options);
          console.log(chartType);
          break;
    }

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
  /*'data':function(){
    return stats.find({ user: Meteor.userId()  });
  }*/
   
  });

  Template.charts.events({
    'submit .stats':function(e){
      e.preventDefault();
      var stat = e.target.stat.value
      var user = Meteor.userId();
      e.target.stat.value = "";
      if(query.length < 12){
        Meteor.call('addStat',stat,user);
        var template = Template.instance();
        setTimeout(function(){
        template.getChartType(Session.get("chartType"));

        }, 1000)
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
      template.getChartType(Session.get("chartType"));
      }, 1000)  
    },

    'click #login-buttons-password':function(){
      alert("clicked");
    },

    'click .remove':function(e){
      e.preventDefault();
      Meteor.call("removeAll");
      var template = Template.instance();
      template.toggleLoader();
      setTimeout(function(){
      myLineChart.destroy();
      template.getChartType(Session.get("chartType"));
      template.toggleLoader();
      }, 3000)

    },

    'change #inputChartType':function(e){
      e.preventDefault();
      var template = Template.instance();
      var value = $('#inputChartType').val();
      Session.set("chartType",value);
      var chartType = Session.get("chartType");
      myLineChart.destroy();

      template.getChartType(Session.get("chartType"));

    },

    'click .download':function(){
      var template = Template.instance();
      template.downloadChart('chart');
    }

  });


Template.charts.onRendered(function () {
  var template = Template.instance();
  setTimeout(function(){
    template.toggleLoader();
    template.getChartType(Session.get("chartType"));
  }, 5000)


});


}


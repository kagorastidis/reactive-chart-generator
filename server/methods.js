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

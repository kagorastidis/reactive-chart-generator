if (Meteor.isServer) {
Meteor.methods({
  'removeAll':function(){
    return stats.remove({user: Meteor.userId()});
  },

  'removeLast':function(){
    var removeLast = stats.findOne({user: Meteor.userId()}, {sort:{$natural:-1}})
    return stats.remove({_id:removeLast._id})
  },

  'addStat':function(stat,user){
    stats.insert({stat:stat,user:user});
  }

});

}

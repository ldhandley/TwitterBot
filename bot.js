var twit = require('twit');
var config = require('./config.js');
var Twitter = new twit(config);

//RETWEET BOT %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

var retweet = function(){
  var recent_retweet_users = [];
  //get last 10 retweets
  Twitter.get('statuses/user_timeline', {screen_name:"LindzyHop",count:10,include_rts:true}, function(err,data){
    //if there are no errors
    if(!err){
      //save recently retweeted users to list
      for(var i = 0; i < data.length; i++){
	if(typeof(data[i].retweeted_status) != "undefined")
      	  recent_retweet_users.push(data[i].retweeted_status.user.screen_name);
      }

      //filter out duplicate recently tweeted users
      var users_to_exclude = recent_retweet_users.filter(function(item, pos) {
	return recent_retweet_users.indexOf(item) == pos;
      })	

          //potential hashtags to retweet with
	  var queries = ['#PEEOTUS', '#TrumpsAmerica', '#TheResistance'];
	  //exclude recently retweeted users and pick random hashtag
	  var query = ranDom(queries) + " " + exclude(users_to_exclude); 

	  var params = {
	    q: query,
	    result_type: 'mixed',
	    lang: 'en'
	  }
	  console.log("Used the query " + query + " to retweet.");


	  Twitter.get('search/tweets', params, function(err, data) {
	    //if there are no errors
	    if(!err){
	      //grab ID of tweet to retweet
	      var retweetId = data.statuses[0].id_str;
	      //tell Twitter to retweet
	      Twitter.post(
		'statuses/retweet/:id', 
		{
		  id: retweetId
		},
		function(err, response) {
		  if(response){
		    console.log('Retweeted ' + data.statuses[0].id_str + ' from ' + data.statuses[0].user.screen_name);
		  }
		  if(err) {
		    console.log('Something went wrong while retweeting... Duplication maybe?');
		  }
		});
	    }
	    //if unable to search a tweet
	    else{
		console.log('Something went wrong while searching...');
	    }
	  });
    }
  });
 }

// grab & retweet as soon as program is running...
retweet();
// retweet in every 50 minutes (in milliseconds)
setInterval(retweet, 3000000); 

//FAVORITE BOT %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

//find a random tweet and favorite it
var favoriteTweet = function(){
  var queries = ['#PEEOTUS', '#TrumpsAmerica', '#TheResistance'];
  var query = ranDom(queries);
  console.log("Used the query " + query + " to favorite!");

  var params = {
    q: query,
    result_type: 'recent',
    lang: 'en'
  }

  //find the tweet
  Twitter.get('search/tweets', params, function(err,data){
    //find tweets
    var tweet = data.statuses;
    var randomTweet = ranDom(tweet); //pick a random tweet

    //if random tweet exists
    if(typeof randomTweet != 'undefined'){
      //tell twitter to favorite
      Twitter.post('favorites/create',{id: randomTweet.id_str}, function(err, response){
      	if(err){
	  console.log('CANNOT BE FAVORITE... Error', err);
	}
	else{
          console.log('Favorited ' + randomTweet.id_str);
	}
      });
    }
  });
}

//grab and favorite as soon as program is running
//favoriteTweet();

//favorite a new tweet every 60 minutes
setInterval(favoriteTweet, 3600000);

//function to generate a random tweet
function ranDom(arr){
  var index = Math.floor(Math.random()*arr.length);
  return arr[index];
}

function exclude(arr){
  var result = "";
  for(var i=0; i < arr.length; i++){
    result = result + "-from:" + arr[i] + " ";
  }
  return result;
}

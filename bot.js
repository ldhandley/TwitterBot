var twit = require('twit');
var config = require('./config.js');
var Twitter = new twit(config);

//RETWEET BOT

var retweet = function(){
  var params = {
  	q: '#ShePersists',
	result_type: 'recent',
	lang: 'en'
  }

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
	    console.log('Retweeted!!!');
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

// grab & retweet as soon as program is running...
retweet();
// retweet in every 50 minutes (in milliseconds)
setInterval(retweet, 3000000);

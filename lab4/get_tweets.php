<?php
require_once('TwitterAPIExchange.php');

$settings = array(
    'oauth_access_token' => '403162349-0bwGhdftfORvNYNoqW83Z2yJsC8iJwnlIkFdJAVg',
    'oauth_access_token_secret' => 'UFsiC8QClnaANnr3racG2v04TvFH5vQ3ocoYEqWKWQnmv',
    'consumer_key' => 'TBFiO8ulJOEoydWfI6xp9mHO5',
    'consumer_secret' => '9JT2dlGF5DJKx7S6T1KLjN3W0R4pNfrFiDKofikzyECkKOadLF'
);

$url = "https://api.twitter.com/1.1/search/tweets.json";
$requestMethod = "GET";

$query = '?q=';
if(isset($_GET['q']) && $_GET['q']!='' ) {

    $query .= $_GET['q'];

} else {
    $query .= 'something';
}

//echo $query;
$twitter = new TwitterAPIExchange($settings);
$results = $twitter->setGetfield($query)->buildOauth($url, $requestMethod)->performRequest();
echo $results;
?>

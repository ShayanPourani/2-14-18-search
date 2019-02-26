// Do not change lines 1-12
var http = require('http');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
var database = {};
var listener = app.listen(8081, function() {
  console.log('Your app is listening on port 8081');
});
// -------------------------

app.post('/search', function (req, res) {
  // get the publishAfter variable from te user
   var bookName = req.body.bookName;
  // pass the publishAfter variable to the show function
   var publishAfter = req.body.publishAfter;
   showResults(res,bookName,publishAfter);
});

// add a parameter named "publishAfter" to this function and use it inside the function
function showResults(res,bookName,publishAfter){
  http.get('http://openlibrary.org/search.json?q='+bookName, function(re){
  var data = '';
  re.on('data', function(chunk){
    data += chunk;
  });
  re.on('end', function(){
    database = JSON.parse(data);
    res.write('<head><link rel="stylesheet" href="/style.css"></head>');
    res.write('<body>');
    if(database.docs){
      // add a column called "First Publish" to the following line
      res.write('<table><thead><tr><th>Book Title</th><th>Cover</th><th>Author Name</th><th>Publish Year</th></tr></thead><tbody>');
      var l = database.docs.length;
      for(var i = 0; i < l ; i++){
        // add an if statement here to prevent the loop from showing a row if "first_publish_year" is less than the users input
       var publishAfterNumber1 = Number(publishAfter);
       var publishAfterNumber2 = -1;
       if(database.docs[i].first_publish_year){
          publishAfterNumber2 = Number(database.docs[i].first_publish_year);
        }
        if(publishAfterNumber2 < publishAfterNumber1 || publishAfterNumber2 == -1){
          continue;
        }
        res.write('<tr>');
        res.write('<td>'+database.docs[i].title+'</td>');
        res.write('<td><img src="http://covers.openlibrary.org/b/id/'+database.docs[i].cover_i+'-M.jpg" /></td>');
        res.write('<td>');
        if(database.docs[i].author_name){
          for(var j = 0; j < database.docs[i].author_name.length; j++){
            res.write(database.docs[i].author_name[j]+'<br>');
          }
        }
        res.write('</td>');
        if(database.docs[i].first_publish_year){
          res.write('<td>'+database.docs[i].first_publish_year+'</td>');
        }else{
          res.write('<td></td>');
        }
        res.write('</tr>');
      }
      res.write('</tbody></table>');
    }
    res.write('</body>');
    res.end('');
    });
  });
}
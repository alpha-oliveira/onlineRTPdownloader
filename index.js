var express = require('express');
var app = express();

var request = require('request');

var bodyParser = require('body-parser');


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var router = express.Router();              
// test route to make sure everything is working (accessed at GET http://localhost:5000/api)
router.get('/', function(req, res) {
    
    
       request(req.query.link, function (error, resp, body) {
            
            if (error) {
                res.send(error);
            }

            else {
                
                 
          
                let pattern = /(https:\/\/streaming-ondemand\.rtp\.pt\/)(.*)(index\.m3u8\?tlm=hls&streams=)(.*)\.mp4/;
                let matches = body.match(pattern);
                let link = matches[1] + matches[2] + matches[4] + ".mp4";

                
                 res.json({ urlVideo: link });  
            }
             
        });
   
});



// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function (req, response) {
    var errorcode = 0; //alert-info
    var message = "Insira o endereço da página que contém o vídeo. O link para download aparecerá aqui.";

    if (req.query['url']) {
        

        request(req.query['url'], function (error, resp, body) {

            if (error) {
                errorcode = 2;
                message = error;
            }

            else {
                errorcode = 1;
                message = "O link do vídeo é ";
                 
          
                let pattern = /(https:\/\/streaming-ondemand\.rtp\.pt\/)(.*)(index\.m3u8\?tlm=hls&streams=)(.*)\.mp4/;
                let matches = body.match(pattern);
                let link = matches[1] + matches[2] + matches[4] + ".mp4";

                message += '<a href ="' +link+'">' + link+'.<a>' ;
                
            }
            response.render('pages/index', { ialert: errorcode, contalert: message });
        });
    }
    else
    response.render('pages/index', { ialert: errorcode, contalert: message });
    

});


    app.listen(app.get('port'), function () {
        console.log('Node app is running on port', app.get('port'));
    });



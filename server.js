var express = require('express');
var io = require('socket.io');
var geocoder = require('geocoder');
var $ =require('jquery');



var app = express.createServer(
    express.bodyParser()
    , express.static(__dirname + "/public")
    , express.cookieParser()
    , express.session({ secret:'desrever'})
),io = io.listen(app);
io.set('log level', 1);


app.configure(function () {
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.register('.html', require('jade'));
    app.use(express.compiler({ src:__dirname + '/views', enable:['less'] }));
});

app.get('/', function (req, res) {



    res.render('index');


});
var z=0;
var ci=0;
var cord=[];




function soc(){

            io.sockets.on('connection', function (socket) {

                    cord=[41.87194,12.56738];
                    socket.emit('cord', cord);
                    socket.on('mycor', function (data) {

                        code(data,socket);
                });



            });


}
function soc2(sc){
    console.log(cord);
    sc.emit('cord', cord);

}


function code(data,sc){

    var lat1="";
    var lon1="";




            geocoder.geocode(data+"+Italy",function ( err, data ){
                var obj= JSON.parse(JSON.stringify(data));

                if(obj.status=="OVER_QUERY_LIMIT"){
                    console.log(JSON.stringify("OVER_QUERY_LIMIT"));

                }
                else if(obj.results[0]!=null){
                    lat1=obj.results[0].geometry.location.lat;
                    lon1=obj.results[0].geometry.location.lng;
                    cord=[lat1,lon1];
                    soc2(sc);
                }


            });






}


soc();

app.listen(3000);

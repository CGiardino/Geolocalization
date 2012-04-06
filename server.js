var express = require('express');
var io = require('socket.io');
var csv = require('ya-csv');
var geocoder = require('geocoder');
var $ =require('jquery');
var fs = require('fs');
var mongoose = require('mongoose')
    , Schema = mongoose.Schema
    , ObjectId = mongoose.SchemaTypes.ObjectId;
var geo= new Schema({
     lat: Number
    ,lon: Number
    ,cap: Number
})
mongoose.connect('mongodb://localhost/milkplease');
var geoModel = mongoose.model('geo', geo);


/*reader.addListener('data', function(data) {
    var i=0;
    while(data[i]!=null ){
        if(i==1 && data[i]!=""){
            dati[j]=data[i];
            j++;

        }

        i++;

    }
});
reader.addListener('end',gohead);
 */

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




            });


}
function soc2(){

    io.sockets.emit('cord', { will: cord[cord.length-2]});

}


function code(x){

    var lat1="";
    var lon1="";




            geocoder.geocode(dati[x]+"+Italy",function ( err, data ){
                var obj= JSON.parse(JSON.stringify(data));

                if(obj.status=="OVER_QUERY_LIMIT"){
                    console.log(JSON.stringify("OVER_QUERY_LIMIT"));

                    soc();
                }
                else if(obj.results[0]!=null){
                    lat1=obj.results[0].geometry.location.lat;
                    lon1=obj.results[0].geometry.location.lng;
                    cord[ci]=[[lat1],[lon1]];

                    ci++;
                    var conditions = { cap: dati[x]}
                        , update = { $set:{lat:lat1,lon:lon1 }}
                        , options = { multi: true };
                    geoModel.update(conditions,update,options,callback);
                    function callback (err, numAffected) {
                        if(err!=null)
                            console.log(err);
                    };
                        gohead();
                }


            });






}


soc();

app.listen(3000);

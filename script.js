function share(){
try {
    var img = document.getElementById('canvas').toDataURL('image/png', 0.9).split(',')[1];
} catch(e) {
    var img = document.getElementById('canvas').toDataURL().split(',')[1];
}
$('#im').text("Imgur is processing; standby.");


$.ajax({
    url: 'https://api.imgur.com/3/image',
    type: 'post',
    headers: {
        Authorization: 'Client-ID ceb0613b2b28522'
    },
    data: {
        image: img,
        title: $('#gen').val()
    },
    dataType: 'json',
    success: function(response) {
        if(response.success) {
            url = response.data.link;
            window.location = url;
          $('#im').text("Done.");

            return url;
        }
        else
        $('#im').text("There was an issue with the connection.");

    }
});
}


var canvas, context, hw, aw, ah, map, ow, col, url;
window.charmap;
window.numToGen;
  




function plot(y, x) //Treat grid as a 5x5
{
    x = Math.floor(x * s);
    y = Math.floor(y * s);
    context.moveTo(x, y);
    context.beginPath();
    context.rect(x, y, s, s);
    context.fillStyle = pickColor();
    context.fill();

}

function erase(){
  context.clearRect(0,0,aw, ah);

}



function updateListen(){
      ow = hw;
      hw = hex_md5($('#gen').val());
      if(ow==hw)
        return;
      massPlot();
}

function pickColor(){
  var r = "7";
  var g = "7";
  var b = "7";
  var r1 = hw.substring(0, 1);
  var r2 = hw.substring(1, 2);
  var p1 = parseInt("0x" + r1, 16);
  var p2 = parseInt("0x" + r2, 16);
  if(p1 < 6)
    r = r1;
  else if(p1 < 12)
    g = r1;
  else
    b = r1;
  if(p2 < 6)
    r = r2;
  else if(p2 < 12)
    g = r2;
  else
    b = r2;  
  var col = "#"+r+g+b;
  var br = (16 - parseInt(r, 16)).toString(16);
  var bg = (16 - parseInt(g, 16)).toString(16);
  var bb = (16 - parseInt(b, 16)).toString(16);
  var bcol = "#"+br+bg+bb;
  document.body.style.color = bcol;


  return col;


}

function genRandom(){

    $('#gen').val(Math.random() * 10000);
    console.log("Last value: " + $('#gen').val());
    updateListen();
}


function massPlot(){
  erase();
  var dup = 0;
  var max = Math.ceil(map[0].length / 2.0);
  var num = 0;
  for(var j = 0; j < max; j++)
  {
    for(var i = 0; i < map.length; i++)
    {
      num = i + map.length * j;
      if(parseInt("0x" + hw.substring(num * 2, num * 2+2), 16) % 2 == 1)
      {
        dup = 1 + (max - j);

        plot(i, j);
        plot(i, dup);
      }
    }

  }

}


$(function(){
    aw = ah = 480;
    s = aw / 5;
    map = new Array(5);
    for(var i = 0; i < map.length; i++){
      map[i] = new Array(5)
      for(var j = 0; j < map[0].length; j++)
        map[i][j] = 0;
    }

    canvas = document.getElementById('canvas');
    context = canvas.getContext('2d');
    context.strokeStyle = 'black';
    genRandom();
      hw = hex_md5($('#gen').val());

      ow = hw = "";    
      updateListen();
    $('#gen').change(function(){updateListen()}).click(function(){updateListen()}).keyup(function(){updateListen()});    


});

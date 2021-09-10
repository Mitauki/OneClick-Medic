const http = require('http');
const url = require('url');
const fs = require('fs');
const querystring = require('querystring');



const mime = {
  'html': 'text/html',
  'css': 'text/css',
  'jpg': 'image/jpg',
  'png': 'image/png',
  'ico': 'image/x-icon',
  'mp3': 'audio/mp3',
  'mp4': 'video/mp4',
  'js': 'text/javascript'
};

const servidor = http.createServer((pedido, respuesta) => {
  const objetourl = url.parse(pedido.url);
  let camino = 'web' + objetourl.pathname;
  if (camino == 'web/')
    camino = 'web/index.html';
  encaminar(pedido, respuesta, camino);
});



servidor.listen(8888);



function encaminar(pedido, respuesta, camino) {
    switch (camino) {
      case 'web/index': {
        validar(pedido, respuesta);
        break;
      }
      case 'web/registrarse': {
        anime(pedido, respuesta);
        break;
      }
      case 'web/login': {
        animes(pedido,respuesta);
        break;
      }
      case 'web/nosotros': {
        animes(pedido,respuesta);
        break;
      }
      default: {
        fs.stat(camino, error => {
          if (!error) {
            fs.readFile(camino, (error, contenido) => {
              if (error) {
                respuesta.writeHead(500, { 'Content-Type': 'text/plain' });
                respuesta.write('Error interno');
                respuesta.end();
              } else {
                const vec = camino.split('.');
                const extension = vec[vec.length - 1];
                const mimearchivo = mime[extension];
                respuesta.writeHead(200, { 'Content-Type': mimearchivo });
                respuesta.write(contenido);
                respuesta.end();
              }
            });
          } else {
            respuesta.writeHead(404, { 'Content-Type': 'text/html' });
            respuesta.write('<!doctype html><html><head></head><body>Recurso inexistente</body></html>');
            respuesta.end();
          }
        });
      }
    }
  }

  function registrarse(pedido, respuesta) {
    respuesta.writeHead(200, { 'Content-Type': 'text/html' });
    const pagina = `<!DOCTYPE html>
    <html lang="en">

    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>OneClick Medic</title>
        <link rel="shortcut icon" href="img/logo.ico">
        <link href="css/config.css" rel="stylesheet">
        <script defer src="fontawesome/js/all.js"></script>
        <!--load all styles -->
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">
    </head>
    
    <body>
        <div id="sidebar" class="active">
            <div class="toggle-btn">
                <span>&#9776;</span>
            </div>
            <ui>
                <a href="index.html"> <img src="img/logosss.png" alt="Logotipo" class="logo"></a>
                </li>
                <li class="nav">
                    <a class="nav-link" href="nosotros">Sobre OneClick Medic</a>
                </li>
                <li class="nav">
                    <a class="nav-link" href="registrarse">Registrarse</a>
                </li>
                <li class="nav">
                    <a class="nav-link" href="login">Iniciar Secion</a>
                </li>
            </ui>
        </div>
        <script type="text/javascript" src="menu.js"></script>
          <!-- desde aqui se puede seguir programando cuidaco con tocar o dañar el css o el js -->
      
          <h1>REGISTRARSE</h1>
      
          <div id="regis">
              <form action="registro" method="post">
                  Ingrese su nombre de usuario:
                  <input type="text" name="nombre" size="30"><br>
                  Ingrese clave:
                  <input type="password" name="contraseña" size="30"><br>
                  <br>
                  <input type="submit" value="Enviar">
              </form>
          </div>
          <br>
          <div id="imagen5">
          </div>
          <i >FELICIDADES</i>
      <br>
          <footer class="py-5 bg-dark">
              <div class="container">
                  <p class="m-0 text-center text-white">Copyright &copy; Anime Boba Café</p>
              </div>
              <!-- /.container -->
          </footer>
      </body>
      
      </html>`;
  respuesta.write(pagina);
  respuesta.end();
}


function registros(pedido,respuesta) {

    let info = '';
    
    pedido.on('data', datosparciales => {
    
     info += datosparciales;
    
    });
    
    pedido.on('end', () => {
    
     const formulario = querystring.parse(info);
    
     respuesta.writeHead(200, {'Content-Type': 'text/html'});
    
     const pagina=
    
      `<!doctype html><html><head></head><body>
    
      Nombre de usuario:${formulario['nombre']}<br>
      Contraseña:${formulario['contraseña']}<hr>
    
      <a href="index.html">Retornar</a>
    
      </body></html>`;
    
     respuesta.end(pagina);
    
     grabarEnArchivo(formulario);
    
    });	
    
    }


function ingresar(pedido, respuesta) {
  let info = '';
  pedido.on('data', datosparciales => {
    info += datosparciales;
  });

  pedido.on('end', function () {
    const formulario = querystring.parse(info);
    if (formulario['user'] == 'Admin' && formulario['pass'] == '1234') {
      respuesta.writeHead(302, {
        'Location': 'registrados'
      });
    } else {
      respuesta.writeHead(302, {
        'Location': '/'
      });
    }
    respuesta.end();
  });
}

function registrados(pedido, respuesta){

fs.readFile('web/registrados.txt', (error,datos)=> {

  respuesta.writeHead(200, {'Content-Type': 'text/html'});

  respuesta.write('<!doctype html><html><head></head><body>');

  respuesta.write(datos);

   respuesta.write(' </body></html>');

  respuesta.end();

});

}

console.log('Servidor web iniciado');

'use strict'

let http = require('http');
let fs = require('fs');
let url = require('url');

let server = http.createServer((req, res) => {

  let [contentType, folder] = checkFileType(req.url);

  if ( contentType ) {
    // console.log(url.parse(req.url));
    getFile(folder + req.url, contentType, res);
  } else {
    getPage(req.url, res);
  }

});

server.listen(8888, () => {
  console.log('* * * Server Started * * *');
})



function getPage(name, res, statusCode = 200) {

  let path = 'contents/main.html';
  if ( name != '/' ) {
    path = 'contents' + name + '.html';
  }

  fs.readFile(path, 'utf8', ( err, content ) => {
    if ( !err ) {

      fs.readFile('layouts/default.html', 'utf8', ( err, layout ) => {
        if ( err ) handleError(err, 'layouts/default.html');

        fs.readFile('elems/header.html', 'utf8', ( err, header ) => {
          if ( err ) handleError(err, 'elems/header.html');

          fs.readFile('elems/footer.html', 'utf8', ( err, footer ) => {
            if ( err ) handleError(err, 'elems/footer.html');

            fs.readFile('elems/nav.html', 'utf8', ( err, nav ) => {
              if ( err ) handleError(err, 'elems/nav.html');

              let titleMatch = content.match(/\{\{set title "(.*?)"\}\}/);
              if ( titleMatch ) {
                layout = layout.replace(/\{\{get title\}\}/, titleMatch[1]);
                content = content.replace(/\{\{set title ".*?"\}\}/, '');
              }

              layout = layout.replace(/\{\{get header\}\}/g, header)
                .replace(/\{\{get nav\}\}/g, nav)
                .replace(/\{\{get content\}\}/g, content)
                .replace(/\{\{get footer\}\}/g, footer);

              res.statusCode = statusCode;
              res.setHeader('Content-Type', 'text/html');
              res.end(layout);
            });
          });
        });
      });

    } else {
      if ( statusCode != 404 ) {
        getPage('/404', res, 404);
      } else {
        res.end('not found');
      }
    }
  });

}

function getFile(path, contentType, res) {

  fs.readFile(path, (e, data) => {
    if ( e ) {
      console.log('something\'s wrong with file ' + path);
      res.statusCode = 404;
      getPage('/404', res, 404);

      // res.end('File: ' + path + ' Not Found');
    } else {
      res.setHeader('Content-Type', contentType);
      res.statusCode = 200;
      res.end(data);
    }
  });
}

function checkFileType(path) {

  let match = path.match(/\.(.+?)$/);

  if ( !match ) return [false, false];

  let extension = match[1].toLowerCase();

  switch ( extension ) {
    case 'css': return ['text/css', 'css'];
      break;
    case 'js': return ['text/javascript', 'js'];
      break;
    case 'ico': return ['image/x-icon', 'img'];
      break;
    case 'jpg':
    case 'jpeg':
    case 'png': return ['image/' + extension, 'img'];
      break;
    case 'json': return ['text/json', 'json'];

    default: return [false, false];
  }
}

function handleError(error, consoleText) {
  console.log('! ! ! somthing\'s wrong ! ! ! ' + consoleText);
  // throw error;
}

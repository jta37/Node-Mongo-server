``` js
// Dynamic Routing (takes up to 3 path lvls, 
//  displays path components in the response body)
// suffix w/ '?' -> optional params matches /files/:filename and /files
// prefix w/ ':' -> matches /files/:filename (e.g. /foo) but not /files

   app.get('/:a?/:b?/:c?', function (req, res) {
     res.send(req.params.a + ' ' + req.params.b + ' ' + req.params.c);
   });
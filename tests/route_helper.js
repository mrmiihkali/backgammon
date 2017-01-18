var bind_routes = function(routes_path) {
  
  var runner = require('run-middleware')
  var routes = require(routes_path)
  var self = this
  self.routes = routes

  // Insert middlewaer
  runner(routes)

  var query = function(method, path, body) {
    var result = {}
    
    var intermediate = function(code, body, header) {
      result.code = code
      result.body = body
      result.headers = headers
    }
    
    self.routes.runMiddleware(path, {method: method}, intermediate)
       
    return result
  }

  return {
    get: function(path, body, headers) {
        return query('get', path, body, headers)
      },
    post: function(path, body) {
        return query('post', path, body, headers)
      },
    put: function(path, body) {
        return query('put', path, body, headers)
      },
    delete: function(path, body) {
        return query('delete', path, body, headers)
      }
  }
}

module.exports = bind_routes

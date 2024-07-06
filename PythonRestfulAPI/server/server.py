import json
from http.server import BaseHTTPRequestHandler, HTTPServer

# opens a file and reads in the data as json.
def get_data(file_dir):
    with open(file_dir,'r') as file:
        return json.loads(file.read().replace('\n',''))

# http server object.
class SimpleHTTPRequestHandler(BaseHTTPRequestHandler):
    
    # dictonary designed to store the Get Addresses and their Responses.
    GET_AD = {
        '/': {
            "code":200,
            "response":{"message":"RESTful API is running"}
        },
        '/weapons':{
            "code":200,
            "response":get_data('weapons.json')
        },
        '/items':{
            "code":200,
            "response":get_data('items.json')
        }
    }
    
    # sets response to the server.
    def _set_response(self, response_code=200):
        self.send_response(response_code)
        self.send_header('Content-type', 'application/json')
        self.end_headers()
    
    # get data based off the get dictionary.
    def do_GET(self):
        # if the request is for an invalid GET, return an error with a message.
        if not (self.path in self.GET_AD.keys()):
            self._set_response(404)
            self.wfile.write(json.dumps({"Error":"Not a valid API address."})
                             .encode('utf-8'))
            return
        self._set_response(self.GET_AD[self.path]["code"])
        self.wfile.write(json.dumps(self.GET_AD[self.path]["response"])
                         .encode('utf-8'))

def run(
        server_class=HTTPServer,
        handler_class=SimpleHTTPRequestHandler,
        port=8080):
    server_address = ('', port)
    httpd = server_class(server_address, handler_class)
    print(f"Starting httpd server on port {port}")
    httpd.serve_forever()


if __name__ == "__main__":
    run()
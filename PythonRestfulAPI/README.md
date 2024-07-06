# Overview

This module is meant to implement a simple RESTful API a technology I am somewhat familiar with in other languages. This module also uses a client and server

The networking program I wrote runs both client and server as their own program, not scripts. The server creates a local server on port 8080, the client utilizes a domain variable to establish it's connection. The client has preselected options for the user to use to test the server's responses.

The goal in writing this software was to learn how python handled RESTful API and networking solutions.

[Software Demo Video](https://youtu.be/OloC5GLIdsc)

# Network Communication

I used a client/server architecture via a RESTful API design.

I am using TCP via HTTP utilizing port 8080 on the server end.

The messages are in JSON format, and returned in a dictionary format with the keys/attributes response and/or message.

# Development Environment

I used python and the server documentation.

I used the json and http libraries from python.

# Useful Websites

* [Python Server Libraries](https://docs.python.org/3.6/library/socketserver.html)

# Future Work

{Make a list of things that you need to fix, improve, and add in the future.}
* Implement POST requests
* Implement PUT requests
* Implement a GUI Client
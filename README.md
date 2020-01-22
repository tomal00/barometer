# Barometer with web UI

A simple barometer using raspberry pi with Sense Hat. GUI in the form of a Web App included.


### HW Prerequisites
* [Sense Hat](https://www.raspberrypi.org/products/sense-hat/) add-on board
* A device compatible with the Sense Hat (e.g. [Raspberry pi 3-B](https://www.raspberrypi.org/products/raspberry-pi-3-model-b/))


### SW Prerequisites

* [NodeJS](https://nodejs.org), [NPM](https://www.npmjs.com/) installed on the device, which you are going to use as a web server
```
https://nodejs.org/en/download/ (includes both NodeJS and NPM)
```
* [Sass CLI tool](https://sass-lang.com) installed on the device, which you are going to use as a web server
```
https://sass-lang.com/install
```
* [Babel CLI tool](https://babeljs.io) installed on the device, which you are going to use as a web server
```
https://babeljs.io/docs/usage/cli/
```
* [Python 2.7](https://www.python.org) + Python pip installed on the device, which you will use to collect data from the Sense Hat
```
https://www.python.org/downloads/release/python-2713/
https://docs.python.org/2.7/installing/index.html
```
* [MySQL](https://www.mysql.com/) database, where you will store the data from the barometer


## Getting Started

First of all, clone the repo

```
git clone https://github.com/Kendaboi/pss_rocnikovka.git
```
Now you can either decide to run the barometer and the web server on your Sense Hat-compatible device or
to separate the repo in two and move the script in the 'raspberry' directory to your Sense-Hat-compatible device
and host the web server somewhere else. The important thing is, that both web server and the script must be able
to connect and maintain connection with your MySQL database.


### Configuration
```
/web/backend/src/cfg.js - dbCfg:
                                setUp:
                                    host: 'the endpoint of your database server' [string]
                                    user: 'a user with read privileges within your database' [string]
                                    password: 'user's password' [string]
                                    database: 'the name of your database' [string]
                                tableName: 'the name of the table, which will be used to read data from' [string]
                                dateColName: 'name of the column, which will store datetime values in logs' [string]
                                valueColName: 'name of the column, which will store mBar values in logs' [string]
                          port: the port on, which will the http server listen [string]
```
```
/web/frontend/src/js/cfg.js - host: 'the endpoint of your web server' [string]
                            - port: 'same as above in /web/backend/src/cfg.js' [string]
```
```
/raspberry/script.py {config} - tableName = 'name of the table where the script will store logs' [string]
                              - setUp:
                                    user: 'name of a user who has write privileges within the DB' [string]
                                    password: 'password of the user' [string]
                                    host: 'same as above in /web/backend/src/cfg.js' [string]
                                    database: 'same as above in /web/backend/src/cfg.js' [string]
```

## Deployment

To run the Web App and barometer on your raspberry pi, simply navigate yourself to the root directory of the repo and execute the command below.
(the following process may take up to several minutes)
```
bash setup.sh
```
The script will launch http server on the port specified in configuration and the barometer will begin writing logs in to the database.

## Built With

* [Node](https://nodejs.org) - The backend framework used
* [Sass](https://sass-lang.com/) - Styles
* [React](https://reactjs.org/) - the frontend framework used
* [Redux](https://redux.js.org/) - a predictable state container
* [Express](http://expressjs.com/) - Routing
* [Webpack](https://webpack.js.org/) - JS bundling
* [Babel](http://babeljs.io/) - JS transpiling
* [NPM](https://www.npmjs.com/) - Dependency management
* [Socket.io](https://socket.io/) - Delivering real-time updates to clients
* [Recharts](http://recharts.org/) - Charting


## Authors

* **Tomáš Malec** - [Kendaboi](https://github.com/Kendaboi)


## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

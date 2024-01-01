import os
import socket

from flask import Flask
from flask_cors import CORS

def create_app(test_config=None):
    # create and configure the app
    app = Flask(__name__, instance_relative_config=True)
    CORS(app)
    app.config['TESTING'] = True
    app.config.from_mapping(
        SECRET_KEY='dev',
        DATABASE=os.path.join(app.instance_path, 'flaskr.sqlite'),
    )

    if test_config is None:
        # load the instance config, if it exists, when not testing
        app.config.from_pyfile('config.py', silent=True)
    else:
        # load the test config if passed in
        app.config.from_mapping(test_config)

    # ensure the instance folder exists
    try:
        os.makedirs(app.instance_path)
    except OSError:
        pass

    # variable to store server status
    app.config['is_locally_running'] = None

    def determine_server_status():
        global is_locally_running

        # check if the hostname is localhost or 127.0.0.1
        host_name = socket.gethostname()
        local_addresses = ['localhost', '127.0.0.1', '::1']

        if host_name in local_addresses:
            is_locally_running = True
            return
        
    # run the function before first request
    determine_server_status()

    # a simple page that returns all the api urls
    @app.route('/api')
    def api():
        urls = []
        for rule in app.url_map.iter_rules():
            if "static" not in rule.endpoint:
                urls.append(rule.rule)
        return urls

    from . import db
    db.init_app(app)

    from . import visitors
    app.register_blueprint(visitors.bp)

    return app
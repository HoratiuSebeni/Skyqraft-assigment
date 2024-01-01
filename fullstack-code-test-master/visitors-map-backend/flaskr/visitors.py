import requests
from datetime import datetime
from flask import (Blueprint, request, current_app)

from flaskr.db import get_db

bp = Blueprint('visitors', __name__, url_prefix='/')

# find geospacial location of the ip adress using the open API ip-api
def get_geospacial_location(ip):
    fields = 'status,country,lat,lon'
    endpoint = f'http://ip-api.com/json/{ip}?fields={fields}'
    response = requests.get(endpoint)
    data = response.json()
    return data

# add new object for the current ip adress
@bp.route('new_connection', methods=('POST',))
def new_connection():
    # verify where the server is hosted and get the correct ip adress depending on the hosting
    is_locally_running = current_app.config['is_locally_running']
    ip = None
    if is_locally_running is not True:
        endpoint = 'http://api.ipify.org'
        response = requests.get(endpoint)
        ip = response.text
    else:
        ip = request.remote_addr

    # search for the ip in the db
    db = get_db()
    db.execute("PRAGMA foreign_keys = ON;")
    visitor = db.execute(
        'SELECT * FROM visitor WHERE ip = ?', (ip,)
    ).fetchone()
    
    # get the actual date and time
    date = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    # add new visitor in database if it's new
    if visitor is None:
        geospacial_location = get_geospacial_location(ip)
        # check if the request was successful
        if geospacial_location.get('status') == 'success':
            print(geospacial_location.get('status'))
            cursor = db.execute(
                'INSERT INTO visitor (ip, lat, lon, country) VALUES (?, ?, ?, ?)',
                (ip, geospacial_location.get('lat'), geospacial_location.get('lon'), geospacial_location.get('country')),
            )
            db.commit()
        else:
            return "Geospacial location not available"
        
    # verify if the last visit is older than 10 minutes
    else:
        result = db.execute(
            'SELECT * FROM visitor_frequency WHERE ip = ? ORDER BY date DESC LIMIT 1', (ip,),
        ).fetchone()
        last_visit = result['date']
        if (datetime.strptime(date, '%Y-%m-%d %H:%M:%S') - datetime.strptime(last_visit, '%Y-%m-%d %H:%M:%S')).total_seconds() < 600:
            return "Visit within the last 10 minutes"
    
    # add a new visit for the actual IP
    db.execute('INSERT INTO visitor_frequency (ip, date) VALUES (?, ?)', (ip, date))
    db.commit()
    return "Visit recorded"

# get all the visitors
@bp.route('visitors_list', methods=('POST',))
def visitors_list():
    start_date = request.json.get('start_date')
    end_date = request.json.get('end_date')
    country = request.json.get('country')
    if start_date == '':
        start_date = '1900-01-01 00:00:00'
    if end_date == '':
        end_date = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    query = """
        WITH VisitorInfo AS (
            SELECT ip, COUNT(*) AS access_count, MAX(date) AS last_registered_date
            FROM visitor_frequency
            WHERE date BETWEEN ? AND ?
            GROUP BY ip
        )

        SELECT v.*, vi.access_count, vi.last_registered_date
        FROM visitor v
        LEFT JOIN VisitorInfo vi ON v.ip = vi.ip    
        WHERE (? == '' OR v.country = ?)
    """
    db = get_db()
    all_visitors = db.execute(query, (start_date, end_date, country, country)).fetchall()
    data = [
        {
            'ip': row['ip'], 
            'lat': row['lat'], 
            'lon': row['lon'], 
            'country': row['country'], 
            'last_registered_date': row['last_registered_date'], 
            'access_count': row['access_count']
        } 
        for row in all_visitors
        if row['access_count'] is not None
    ]
    return data
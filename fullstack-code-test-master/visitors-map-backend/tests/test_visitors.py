import pytest
from unittest.mock import patch
from flaskr import create_app
from flaskr.db import get_db, init_db, init_db_command
from flaskr.visitors import get_geospacial_location

def test_get_geospacial_location():
    # Mock the requests.get method to return sample data
    result = get_geospacial_location('86.121.92.34')

    assert result['status'] == 'success'
    assert result['country'] == 'Romania'
    assert result['lat'] == 46.5659
    assert result['lon'] == 23.7887

def test_new_connection_local(client):
    # Test the new_connection route for locally running server
    response = client.post('/new_connection', headers={'Host': 'localhost'})
    assert response.status_code == 200

def test_new_connection_remote(client):
    # Test the new_connection route for a remote server
    response = client.post('/new_connection', headers={'Host': 'example.com'})
    assert response.status_code == 200

def test_visitors_default_dates_and_country(client):
    # Test visitors_list endpoint with default dates and country
    data = {
        'start_date': '',
        'end_date': '',
        'country': '',
    }
    headers = {'Content-Type': 'application/json'}
    response = client.get('/visitors_list', json=data, headers=headers)
    assert response.status_code == 200

def test_visitors_custom_dates_and_country(client):
    # Test visitors_list endpoint with custom dates and country
    data = {
        'start_date': '2022-01-01 00:00:00',
        'end_date': '2022-12-31 00:00:00',
        'country': 'France',
    }
    headers = {'Content-Type': 'application/json'}
    response = client.get('/visitors_list', json=data, headers=headers)
    assert response.status_code == 200

def test_visitors_no_start_date(client):
    # Test visitors_list endpoint without start_date
    data = {
        'start_date': '',
        'end_date': '2022-12-31 00:00:00',
        'country': 'France',
    }
    headers = {'Content-Type': 'application/json'}
    response = client.get('/visitors_list', json=data, headers=headers)
    assert response.status_code == 200
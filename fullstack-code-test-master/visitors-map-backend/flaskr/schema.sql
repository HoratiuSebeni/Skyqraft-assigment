CREATE TABLE visitor (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ip TEXT UNIQUE,
    lat REAL,
    lon REAL,
    country TEXT
);

CREATE TABLE visitor_frequency (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ip TEXT,
    date TEXT,
    FOREIGN KEY (ip) REFERENCES visitor(ip)
);
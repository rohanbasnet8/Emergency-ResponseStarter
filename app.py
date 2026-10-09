from contextlib import closing

import psycopg2
from flask import Flask, jsonify, request
from psycopg2.extras import RealDictCursor

from database import get_connection

app = Flask(__name__)


@app.get("/api/health")
def health():
    return jsonify(message="Python API is running")


@app.get("/api/incidents")
def incidents():
    with closing(get_connection()) as connection:
        with connection.cursor(cursor_factory=RealDictCursor) as cursor:
            cursor.execute("""
                SELECT i.incident_id, e.emergency_type, l.address, i.status
                FROM Incident i
                JOIN EmergencyCall e ON e.call_id = i.call_id
                JOIN Location l ON l.location_id = e.location_id
                ORDER BY i.incident_id DESC
            """)
            return jsonify(cursor.fetchall())


@app.post("/api/reports")
def report():
    data = request.get_json(silent=True)
    fields = {"caller_name": 100, "caller_phone": 30, "address": 255,
              "city": 100, "emergency_type": 30, "description": 2000}
    if not isinstance(data, dict):
        return jsonify(error="Send a JSON object."), 400
    for field, limit in fields.items():
        value = data.get(field)
        if not isinstance(value, str) or not value.strip() or len(value) > limit:
            return jsonify(error=f"Complete {field.replace('_', ' ')} (maximum {limit} characters)."), 400
    if data["emergency_type"] not in ("Medical", "Fire", "Police", "Other"):
        return jsonify(error="Choose a valid emergency type."), 400

    # One transaction saves the location, call, and incident together.
    with closing(get_connection()) as connection:
        with connection:
            with connection.cursor() as cursor:
                cursor.execute(
                    "INSERT INTO Location (address, city) VALUES (%s, %s) RETURNING location_id",
                    (data["address"].strip(), data["city"].strip()),
                )
                location_id = cursor.fetchone()[0]
                cursor.execute("""
                    INSERT INTO EmergencyCall
                    (caller_name, caller_phone, emergency_type, description, location_id)
                    VALUES (%s, %s, %s, %s, %s) RETURNING call_id
                """, (data["caller_name"].strip(), data["caller_phone"].strip(),
                       data["emergency_type"], data["description"].strip(), location_id))
                call_id = cursor.fetchone()[0]
                cursor.execute(
                    "INSERT INTO Incident (call_id) VALUES (%s) RETURNING incident_id", (call_id,)
                )
                incident_id = cursor.fetchone()[0]
    return jsonify(message="Report saved to the project database.", incident_id=incident_id), 201


@app.errorhandler(psycopg2.Error)
def database_error(error):
    app.logger.error("Database request failed: %s", type(error).__name__)
    return jsonify(error="Database is not ready. Follow the database steps in README.md."), 503


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5001)

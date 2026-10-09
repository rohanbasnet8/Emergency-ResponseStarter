# Emergency Response Management System

This is the beginning of our group project. We use React for the page, Python Flask for
the API, and PostgreSQL for the database. The dashboard shows incidents, and the
form saves a location, emergency call, and incident. It does not contact emergency
services. Assignment and login features will be added later.

## 1. Set up our database

1. Open pgAdmin and connect to PostgreSQL.
2. Create a new, empty database named emergency_response_starter.
3. Open its Query Tool. Open database/schema.sql and press F5.
4. Open database/sample_data.sql and press F5 to add example rows.
5. Copy .env.example to a new file called .env in the project folder.
6. Open .env and replace your_postgresql_password with your PostgreSQL password.

Run each SQL file only once. If our tables already exist, skip steps 2-4.
If you use a different database name, change DB_NAME in .env too.

## 2. Open our group project on this computer

1. Open C:\mnt\data\EmergencyResponseStarter.
2. Double-click start-backend.cmd to run Python.
3. Double-click start.cmd to run React.
4. Open http://127.0.0.1:5173 in your browser.

Keep both command windows open. Close them when finished.
If either part is already running, use the existing running version.

## Set up on another computer

Install Python, Node.js LTS, and PostgreSQL first. Open PowerShell in this folder:

```powershell
py -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
npm install
```

Follow the database steps above. Then run Python:

```powershell
.\.venv\Scripts\python.exe app.py
```

Open a second terminal in the same folder and run:

```powershell
npm run dev
```

Open http://127.0.0.1:5173. Press Ctrl+C in each terminal to stop it.
start.cmd is set up for the computer where we set up the project; use npm run dev on yours.

## Main files

- src/App.jsx: dashboard, form, and requests to Python.
- src/style.css: simple styling.
- app.py: Python API routes.
- database.py: PostgreSQL connection.
- database/schema.sql: Location, EmergencyCall, Incident, ResponseUnit tables.
- database/sample_data.sql: example rows.
- vite.config.js: sends frontend API requests to Python on port 5001.

If the page says the database is not ready, check .env, the PostgreSQL service,
and whether you ran schema.sql.

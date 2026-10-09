import React, { useEffect, useState } from 'react';

async function api(path, options) {
  const response = await fetch(path, options);
  let data;
  try { data = await response.json(); }
  catch { throw new Error('Start the Python backend and try again.'); }
  if (!response.ok) throw new Error(data.error || 'The request failed.');
  return data;
}

export default function App() {
  const [incidents, setIncidents] = useState([]);
  const [apiStatus, setApiStatus] = useState('Connecting to Python...');
  const [dashboardError, setDashboardError] = useState('');
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);

  async function loadDashboard() {
    try {
      const rows = await api('/api/incidents');
      setIncidents(rows);
      setDashboardError('');
    } catch (error) { setDashboardError(error.message); }
  }

  useEffect(() => {
    api('/api/health').then(data => setApiStatus(data.message))
      .catch(() => setApiStatus('Start the Python backend to connect.'));
    loadDashboard();
  }, []);

  async function submitReport(event) {
    event.preventDefault();
    const form = event.currentTarget;
    setSaving(true);
    setMessage('');
    try {
      const data = await api('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(Object.fromEntries(new FormData(form))),
      });
      setMessage(`${data.message} Incident #${data.incident_id}.`);
      form.reset();
      await loadDashboard();
    } catch (error) { setMessage(error.message); }
    finally { setSaving(false); }
  }

  return <main>
    <h1>Emergency Response Management System</h1>
    <p>Beginning-stage class project. This does not contact emergency services.</p>
    <p>{apiStatus}</p>

    <h2>Dashboard</h2>
    {dashboardError ? <p role="alert">{dashboardError}</p> : <>
      <p>Reported incidents: {incidents.length}</p>
      {incidents.length === 0 ? <p>No incidents yet.</p> : <div className="table-wrap"><table>
        <thead><tr><th>ID</th><th>Type</th><th>Location</th><th>Status</th></tr></thead>
        <tbody>{incidents.map(item => <tr key={item.incident_id}>
          <td>{item.incident_id}</td><td>{item.emergency_type}</td><td>{item.address}</td><td>{item.status}</td>
        </tr>)}</tbody>
      </table></div>}
    </>}
    <button type="button" onClick={loadDashboard}>Refresh dashboard</button>

    <h2>Emergency Report</h2>
    <form onSubmit={submitReport}>
      <label htmlFor="name">Caller name</label><input id="name" name="caller_name" maxLength={100} required />
      <label htmlFor="phone">Phone number</label><input id="phone" name="caller_phone" type="tel" maxLength={30} required />
      <label htmlFor="location">Location / address</label><input id="location" name="address" maxLength={255} required />
      <label htmlFor="city">City</label><input id="city" name="city" maxLength={100} required />
      <label htmlFor="type">Emergency type</label><select id="type" name="emergency_type" defaultValue="" required>
        <option value="">Select a type</option><option>Medical</option><option>Fire</option><option>Police</option><option>Other</option>
      </select>
      <label htmlFor="description">Description</label><textarea id="description" name="description" rows={4} maxLength={2000} required />
      <button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save report'}</button>
    </form>
    {message && <p role="status">{message}</p>}
  </main>;
}

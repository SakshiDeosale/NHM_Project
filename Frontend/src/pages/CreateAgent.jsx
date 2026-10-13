import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function CreateAgent() {
  const [formData, setFormData] = useState({
    agentName: '',
    agentType: '',
    description: '',
    team: '',
    owner: '',
    status: 'Draft',
    priority: 'High',
    notes: '',
    capabilities: {
      nlp: false,
      automation: false,
      analytics: false,
      integration: false,
      scheduling: false,
      alerts: false,
    },
  });

  const handleCheckbox = (key) => {
    setFormData((prev) => ({
      ...prev,
      capabilities: {
        ...prev.capabilities,
        [key]: !prev.capabilities[key],
      },
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Agent Created!');
  };

  return (
    <>
      <div className="page-heading">
        <div className="page-heading-copy">
          <span className="page-icon"><i className="bi bi-robot" aria-hidden="true" /></span>
          <div>
            <p className="eyebrow mb-1">Agent Management</p>
            <h1 className="h3 mb-1">Create Agent</h1>
            <p className="text-muted mb-0">Set up a new intelligent agent with capabilities and configurations.</p>
          </div>
        </div>
        <div className="heading-actions">
          <Link className="btn btn-outline-secondary btn-sm" to="/users">
            <i className="bi bi-arrow-left me-1" aria-hidden="true" /> Back
          </Link>
        </div>
      </div>

      <section className="row g-3">
        <div className="col-12 col-xl-8">
          <form className="panel needs-validation" onSubmit={handleSubmit}>
            <div className="panel-header">
              <div>
                <h2 className="h5 mb-1 section-title">
                  <i className="bi bi-robot me-2" aria-hidden="true" />
                  <span>Agent Information</span>
                </h2>
                <p className="text-muted mb-0">Define the agent's core properties and settings.</p>
              </div>
            </div>

            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label" htmlFor="agentName">Agent Name</label>
                <input
                  className="form-control"
                  id="agentName"
                  type="text"
                  placeholder="e.g., Customer Support Bot"
                  required
                  value={formData.agentName}
                  onChange={(e) => setFormData({ ...formData, agentName: e.target.value })}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label" htmlFor="agentType">Agent Type</label>
                <select
                  className="form-select"
                  id="agentType"
                  required
                  value={formData.agentType}
                  onChange={(e) => setFormData({ ...formData, agentType: e.target.value })}
                >
                  <option value="">Choose type</option>
                  <option value="Chatbot">Chatbot</option>
                  <option value="Task Automation">Task Automation</option>
                  <option value="Data Analysis">Data Analysis</option>
                  <option value="Content Generation">Content Generation</option>
                  <option value="Custom">Custom</option>
                </select>
              </div>

              <div className="col-12">
                <label className="form-label" htmlFor="description">Description</label>
                <textarea
                  className="form-control"
                  id="description"
                  rows="3"
                  placeholder="Describe what this agent does and its primary responsibilities"
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label" htmlFor="team">Assigned Team</label>
                <select
                  className="form-select"
                  id="team"
                  required
                  value={formData.team}
                  onChange={(e) => setFormData({ ...formData, team: e.target.value })}
                >
                  <option value="">Choose team</option>
                  <option value="Operations">Operations</option>
                  <option value="Sales">Sales</option>
                  <option value="Content">Content</option>
                  <option value="Finance">Finance</option>
                  <option value="Support">Support</option>
                </select>
              </div>

              <div className="col-md-6">
                <label className="form-label" htmlFor="owner">Owner/Manager</label>
                <select
                  className="form-select"
                  id="owner"
                  required
                  value={formData.owner}
                  onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
                >
                  <option value="">Choose owner</option>
                  <option value="Admin Hasan">Admin Hasan</option>
                  <option value="Team Lead">Team Lead</option>
                  <option value="Manager">Manager</option>
                  <option value="Supervisor">Supervisor</option>
                </select>
              </div>

              <div className="col-12">
                <label className="form-label">Capabilities</label>
                <div className="capability-checkboxes d-flex flex-wrap gap-3">
                  <div className="form-check">
                    <input className="form-check-input" type="checkbox" id="cap1" checked={formData.capabilities.nlp} onChange={() => handleCheckbox('nlp')} />
                    <label className="form-check-label" htmlFor="cap1">Natural Language Processing</label>
                  </div>
                  <div className="form-check">
                    <input className="form-check-input" type="checkbox" id="cap2" checked={formData.capabilities.automation} onChange={() => handleCheckbox('automation')} />
                    <label className="form-check-label" htmlFor="cap2">Task Automation</label>
                  </div>
                  <div className="form-check">
                    <input className="form-check-input" type="checkbox" id="cap3" checked={formData.capabilities.analytics} onChange={() => handleCheckbox('analytics')} />
                    <label className="form-check-label" htmlFor="cap3">Analytics & Reporting</label>
                  </div>
                  <div className="form-check">
                    <input className="form-check-input" type="checkbox" id="cap4" checked={formData.capabilities.integration} onChange={() => handleCheckbox('integration')} />
                    <label className="form-check-label" htmlFor="cap4">API Integration</label>
                  </div>
                  <div className="form-check">
                    <input className="form-check-input" type="checkbox" id="cap5" checked={formData.capabilities.scheduling} onChange={() => handleCheckbox('scheduling')} />
                    <label className="form-check-label" htmlFor="cap5">Scheduling</label>
                  </div>
                  <div className="form-check">
                    <input className="form-check-input" type="checkbox" id="cap6" checked={formData.capabilities.alerts} onChange={() => handleCheckbox('alerts')} />
                    <label className="form-check-label" htmlFor="cap6">Alert Management</label>
                  </div>
                </div>
              </div>

              <div className="col-md-6">
                <label className="form-label" htmlFor="status">Status</label>
                <select className="form-select" id="status" required value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })}>
                  <option value="Draft">Draft</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              <div className="col-md-6">
                <label className="form-label" htmlFor="priority">Priority Level</label>
                <select className="form-select" id="priority" required value={formData.priority} onChange={(e) => setFormData({ ...formData, priority: e.target.value })}>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Critical">Critical</option>
                </select>
              </div>

              <div className="col-12">
                <label className="form-label" htmlFor="notes">Additional Notes</label>
                <textarea className="form-control" id="notes" rows="3" placeholder="Any additional configuration details or special requirements" value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} />
              </div>
            </div>

            <div className="d-flex flex-wrap justify-content-end gap-2 mt-4">
              <Link className="btn btn-outline-secondary" to="/users">Cancel</Link>
              <button className="btn btn-primary" type="submit">
                <i className="bi bi-check-circle me-1" aria-hidden="true" /> Create Agent
              </button>
            </div>
          </form>
        </div>

        <div className="col-12 col-xl-4">
          <div className="panel h-100">
            <h2 className="h5 mb-3 section-title">
              <i className="bi bi-info-circle me-2" aria-hidden="true" />
              <span>Agent Overview</span>
            </h2>
            <p className="text-muted">Configured agents automate customer interactions, data syncs, and system monitoring tasks seamlessly.</p>
          </div>
        </div>
      </section>
    </>
  );
}

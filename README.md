DevMetrics MVP — Developer Productivity Intelligence

A full-stack web application that moves developers from raw engineering metrics to clear interpretation and actionable next steps.


The Problem
Developers and managers already have data — PRs, Jira issues, CI/CD pipelines, bug reports. The real problem is that raw numbers don't drive action. A dashboard that shows "Lead Time: 4.2 days" is useless if the developer doesn't know whether that's good, what caused it, or what to do about it.
This MVP solves that by taking raw engineering data and producing:

The metric value
A plain-English interpretation of what it means
A specific, actionable next step


Features

IC Profile View — Select any Individual Contributor and see their personal metrics in context
Month Filtering — Filter metrics by month to track improvement over time
5 Core Metrics — All computed from raw source tables per assignment definitions
Intelligent Interpretations — Context-aware story for each metric, not generic one-liners
Dynamic Filters — Developer and month dropdowns populated from the data itself via /api/filters


The 5 Metrics (Assignment Definitions)
MetricDefinition UsedLead Time for ChangesAvg time from PR opened → successful production deploymentCycle TimeAvg time from issue moved to In Progress → issue marked DoneBug RateEscaped production bugs found this month ÷ issues completed this monthDeployment FrequencyCount of successful production deployments in the monthPR ThroughputCount of merged pull requests in the month

Note: These definitions follow the assignment brief exactly, not generic DORA definitions.


Tech Stack
Frontend

React.js (Vite) — functional components, useState, useEffect
Tailwind CSS — custom dark theme, hover states, animations

Backend

Node.js + Express.js — lightweight REST API
ES Modules — modern import/export syntax
In-memory JSON — mock data simulating real Jira, GitHub, CI/CD sources

Data Layer

mockData.json — 3 developers × 3 months × 4 source tables (PRs, issues, deployments, bugs)
parser.js — isolated file reading (easily swappable for a real DB/ORM)
metrics.js — pure calculation logic, no side effects


Project Structure
dev-metrics-mvp/
├── backend/
│   ├── data/
│   │   └── mockData.json        # Source tables: PRs, issues, deployments, bugs
│   └── src/
│       ├── index.js             # Express server + routes
│       ├── controller.js        # Request handling, query param extraction
│       ├── metrics.js           # All 5 metric calculations
│       └── parser.js            # Data access layer (isolated)
└── frontend/
    └── src/
        └── components/
            ├── Dashboard.jsx    # Main view: filters, IC profile, metrics grid
            └── MetricCard.jsx   # Individual metric card: value + interpretation + next step

How to Run Locally
Prerequisites

Node.js v18+
npm

1. Clone the repository
bashgit clone https://github.com/YOUR_USERNAME/dev-metrics-mvp.git
cd dev-metrics-mvp
2. Start the Backend
bashcd backend
npm install
npm start
# Server runs on http://localhost:3000
3. Start the Frontend
bashcd frontend
npm install
npm run dev
# App runs on http://localhost:5173
4. Open in browser
http://localhost:5173

API Endpoints
EndpointMethodDescription/api/metricsGETReturns all 5 computed metrics/api/metrics?developer=HarshGETMetrics filtered by developer/api/metrics?developer=Harsh&month=2023-10GETMetrics filtered by developer and month/api/filtersGETReturns available developers and months from data

Data Model
The mock data simulates 4 real-world engineering systems:
deployments  → CI/CD pipeline records  (id, developer, timestamp, status)
prs          → GitHub-like PR table    (id, developer, openedAt, mergedAt, deployedAt)
issues       → Jira-like issue tracker (id, developer, startedAt, completedAt)
bugs         → Post-release bug reports(id, developer, reportedAt)
3 developers with meaningfully different profiles:

Harsh — fast delivery, low bug rate (healthy baseline)
Alex — moderate lead time, some bugs (needs attention in places)
Sam — slow cycle time, high bug rate (clear improvement areas)


Architecture Decisions & Trade-offs
In-memory JSON vs Database
Chosen for MVP speed. The data access is fully isolated in parser.js — swapping it for a PostgreSQL query or Prisma ORM requires changing one file, not the business logic.
On-request calculation vs pre-aggregation
Metrics are computed fresh on every API call. Works fine for this dataset size. At scale, this moves to a nightly background job (AWS Lambda / BullMQ) that pre-aggregates and caches results.
Hardcoded thresholds
Good/warn/poor thresholds are currently fixed constants. Next iteration moves these into team-configurable database settings so each team can define their own SLAs.

What's Next (If Extended)

 Manager summary view (team-level rollup across all ICs)
 Trend chart (metric progression over multiple months)
 Connect to real GitHub + Jira APIs
 Configurable thresholds per team
 Alert system when a metric crosses a threshold


Assignment Context
Built as part of a Developer Productivity MVP internship assignment for TheProductWorks.in.
Evaluation criteria: Problem Understanding · Product Thinking · Frontend Quality · Backend/Data Handling · Communication · Responsible AI Use

# EfficienCity RMS

<div align="center">

**A centralized platform for municipal resource management and inter‑municipality collaboration**

[![GitHub Stars](https://img.shields.io/github/stars/AngelosFikias0/Resource_Management_System?style=for-the-badge\&logo=github)](https://github.com/AngelosFikias0/Resource_Management_System/stargazers)
[![GitHub Forks](https://img.shields.io/github/forks/AngelosFikias0/Resource_Management_System?style=for-the-badge\&logo=github)](https://github.com/AngelosFikias0/Resource_Management_System/network/members)
[![Issues](https://img.shields.io/github/issues/AngelosFikias0/Resource_Management_System?style=for-the-badge)](https://github.com/AngelosFikias0/Resource_Management_System/issues)
[![License](https://img.shields.io/github/license/AngelosFikias0/Resource_Management_System?style=for-the-badge)](LICENSE)

[Overview](#overview) • [Features](#features) • [Architecture](#architecture) • [Tech Stack](#tech-stack) • [Demo](#demo) • [Installation](#installation)

</div>

---

## Overview

EfficienCity RMS is a full‑stack system that enables municipalities to register, allocate, share, and audit public resources. It replaces fragmented processes with a single source of truth. The platform improves utilization, reduces cost, and increases transparency for both authorities and citizens.

**Core outcomes**

* Real time visibility of municipal assets
* Faster inter‑municipality collaboration
* Auditable and transparent transactions
* Data driven decision making

---

## Problem

Municipalities operate with disconnected tools and manual workflows.

* No centralized inventory
* Slow procurement and approval cycles
* Idle or duplicated resources
* Limited accountability
* Minimal cross‑municipality cooperation

**Impact**
Higher operational cost. Lower service quality. Reduced public trust.

---

## Solution

EfficienCity RMS introduces a unified digital layer across municipalities.

* Centralized asset registry
* Structured request and approval workflows
* Analytics for utilization and demand forecasting
* Immutable audit trails
* Public transparency portal

The system is designed for scale, security, and regulatory environments.

---

## Features

### Municipal Authorities

* Resource registration and lifecycle tracking
* Inter‑municipality resource requests
* Approval workflows with status tracking
* KPI dashboards and reports
* Role based access control

### Citizens

* Public dashboard with aggregated data
* Verifiable transaction history
* Usage statistics and reports
* Mobile friendly interface

### System Administrators

* User and role management
* System health monitoring
* Audit logs
* Backup and recovery automation

---

## Architecture

High level architecture follows a modular and cloud native design.

* React frontend consuming REST APIs
* Spring Boot backend with layered architecture
* PostgreSQL as the primary datastore
* Containerized deployment with Docker
* Kubernetes for orchestration
* CI CD pipelines with GitHub Actions

Designed for horizontal scaling and clear separation of concerns.

---

## Tech Stack

### Frontend

* React
* TypeScript
* HTML5
* CSS3

### Backend

* Java 17
* Spring Boot

### Data

* PostgreSQL

### DevOps and Cloud

* Docker
* Kubernetes
* Microsoft Azure
* GitHub Actions

### Monitoring and Testing

* Prometheus
* Grafana
* JUnit

---

## Demo

Screenshots are available under `docs/images`.

Planned

* Full video walkthrough
* Hosted demo environment

---

## Installation

### Prerequisites

* Node.js 18 or newer
* Java 17 or newer
* Docker 20 or newer
* PostgreSQL 14 or newer

### Local Setup

Clone the repository

```bash
git clone https://github.com/AngelosFikias0/Resource_Management_System.git
cd Resource_Management_System
```

Backend

```bash
cd backend
./mvnw clean install
./mvnw spring-boot:run
```

Frontend

```bash
cd frontend
npm install
npm start
```

Docker alternative

```bash
docker-compose up -d
```

### Environment Variables

Create a `.env` file in the root directory.

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=efficien_city_rms
DB_USER=your_username
DB_PASSWORD=your_password

JWT_SECRET=your_jwt_secret
JWT_EXPIRATION=86400
```

---

## Usage

### Municipal Employee

1. Authenticate
2. Register and manage resources
3. Submit or review requests
4. Approve or reject allocations
5. Export reports

### Citizen

1. Authenticate
2. View public dashboards
3. Explore inventory statistics
4. Access transaction records

---

## Team

| Role               | Name                 |
| ------------------ | -------------------- |
| Software Architect | Άγγελος Φίκιας       |
| Design Lead        | Αλέξανδρος Λαζαρίδης |
| Project Manager    | Βάιος Παλιούρας      |
| Tech Research Lead | Ιωάννης Τσιρκινίδης  |

Academic supervision provided by the University of Macedonia.

---

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Open a pull request

---

## License

MIT License. See the LICENSE file for details.

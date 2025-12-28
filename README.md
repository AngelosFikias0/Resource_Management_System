# EfficienCity RMS

<div align="center">

**A centralized platform for municipal resource management and inter‑municipality collaboration.**

[![GitHub Stars](https://img.shields.io/github/stars/AngelosFikias0/Resource_Management_System?style=for-the-badge&logo=github&color=yellow)](https://github.com/AngelosFikias0/Resource_Management_System/stargazers)
[![GitHub Forks](https://img.shields.io/github/forks/AngelosFikias0/Resource_Management_System?style=for-the-badge&logo=github&color=orange)](https://github.com/AngelosFikias0/Resource_Management_System/network/members)
[![Issues](https://img.shields.io/github/issues/AngelosFikias0/Resource_Management_System?style=for-the-badge&logo=github&color=red)](https://github.com/AngelosFikias0/Resource_Management_System/issues)
[![License](https://img.shields.io/github/license/AngelosFikias0/Resource_Management_System?style=for-the-badge&color=blue)](LICENSE)

[Overview](#-overview) • [Features](#-features) • [Architecture](#-architecture) • [Tech Stack](#-tech-stack) • [Getting Started](#-getting-started) • [Team](#-team)

</div>

---

## 📖 Overview

**EfficienCity RMS** is a full‑stack ecosystem designed to modernize how municipalities register, allocate, share, and audit public resources. By replacing fragmented, manual processes with a single source of truth, the platform improves asset utilization, reduces operational costs, and fosters transparency between local authorities and citizens.

### Core Outcomes
* 👁️ **Real-time Visibility:** Instant tracking of municipal assets and availability.
* 🤝 **Collaboration:** Seamless inter‑municipality resource sharing.
* 🛡️ **Accountability:** Immutable audit trails for every transaction.
* 📊 **Intelligence:** Data-driven decision-making via utilization analytics.

---

## 🧩 The Challenge vs. The Solution

| The Problem | The EfficienCity Solution |
| :--- | :--- |
| **Fragmented Tools:** Disconnected spreadsheets and manual workflows. | **Centralized Registry:** A unified digital inventory for all assets. |
| **Slow Procurement:** Lengthy approval cycles and idle resources. | **Automated Workflows:** Structured requests with instant status updates. |
| **Opacity:** Limited accountability and public trust. | **Transparency Portal:** Public dashboards and verifiable transaction history. |
| **Silos:** Minimal cross‑municipality cooperation. | **Federated Sharing:** A network layer allowing municipalities to support one another. |

---

## ⚡ Features

### 🏛️ For Municipal Authorities
* **Lifecycle Tracking:** Full CRUD operations for resource registration.
* **Inter-Municipality Requests:** Borrow or lend resources seamlessly between districts.
* **Approval Workflows:** Role-based logic for reviewing and approving allocations.
* **Analytics:** KPI dashboards for demand forecasting and usage reports.

### 👤 For Citizens
* **Open Data Dashboard:** View aggregated data on public spending and resource usage.
* **Transparency:** Verify transaction histories to ensure fair usage.
* **Accessibility:** Mobile-friendly interface for on-the-go access.

### 🛠️ For Administrators
* **RBAC:** Granular User and Role management.
* **Observability:** System health monitoring via Prometheus/Grafana.
* **Security:** Automated backup and recovery protocols.

---

## 🏗️ Architecture

The system follows a modular, cloud-native design principle, ensuring horizontal scalability and clear separation of concerns.

```mermaid
graph TD
    User((User))
    LB[Load Balancer / Ingress]
    
    subgraph "Frontend Layer"
        UI[React Client]
    end
    
    subgraph "Backend Layer"
        API[Spring Boot API Gateway]
        Service[Core Logic Service]
    end
    
    subgraph "Data & Infra"
        DB[(PostgreSQL)]
        Cache[(Redis/Cache)]
    end

    User --> LB
    LB --> UI
    UI --> API
    API --> Service
    Service --> DB
    Service -.-> Cache
```

---

## 💻 Tech Stack

### Frontend
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

### Backend
![Spring Boot](https://img.shields.io/badge/Spring_Boot-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white)
![Java](https://img.shields.io/badge/Java-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white)

### Data & Infrastructure
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)

### DevOps & Monitoring
![Prometheus](https://img.shields.io/badge/Prometheus-E6522C?style=for-the-badge&logo=prometheus&logoColor=white)
![Grafana](https://img.shields.io/badge/Grafana-F46800?style=for-the-badge&logo=grafana&logoColor=white)
![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-2088FF?style=for-the-badge&logo=github-actions&logoColor=white)

---

## 🚀 Getting Started

### Prerequisites

* **Node.js:** v18+
* **Java:** JDK 17+
* **Docker:** v20+
* **PostgreSQL:** v14+

### 🔧 Installation

1. **Clone the repository**
```bash
git clone https://github.com/AngelosFikias0/Resource_Management_System.git
cd Resource_Management_System
```

2. **Environment Setup**

Create a `.env` file in the root directory:
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=efficien_city_rms
DB_USER=your_username
DB_PASSWORD=your_password
JWT_SECRET=your_super_secret_key_change_me
JWT_EXPIRATION=86400
```

3. **Run via Docker (Recommended)**
```bash
docker-compose up -d --build
```

4. **Manual Execution**

*Backend:*
```bash
cd backend
./mvnw clean install
./mvnw spring-boot:run
```

*Frontend:*
```bash
cd frontend
npm install
npm start
```

Access the application at `http://localhost:3000`.

---

## 👥 Team

Academic supervision provided by the **University of Macedonia**.

| Name | Role | Socials |
| --- | --- | --- |
| **Άγγελος Φίκιας** | Software Architect | [![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/AngelosFikias0) |
| **Αλέξανδρος Λαζαρίδης** | Design Lead | [![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](#) |
| **Βάιος Παλιούρας** | Project Manager | [![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](#) |
| **Ιωάννης Τσιρκινίδης** | Tech Research Lead | [![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](#) |

---

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

## 📧 Contact

Project Link: [https://github.com/AngelosFikias0/Resource_Management_System](https://github.com/AngelosFikias0/Resource_Management_System)

---

<div align="center">

Made with ❤️ by the EfficienCity Team

</div>

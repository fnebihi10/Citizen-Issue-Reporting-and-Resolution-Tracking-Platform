# Citizen Issue Reporting and Resolution Tracking Platform

A modern full-stack web platform that enables citizens to report local issues, municipal officials to manage and resolve them efficiently, and the public to transparently track the resolution process.

---

## 📖 Overview

The **Citizen Issue Reporting and Resolution Tracking Platform** is a web application developed as a Bachelor's Thesis at the University "Isa Boletini" Mitrovica.

The platform aims to improve communication between citizens and municipalities by providing a centralized system for reporting, tracking, managing, and resolving local infrastructure and public service issues.

Citizens can submit reports with descriptions, categories, locations on an interactive map, and photo evidence. Municipal officers verify each report, assign it to the responsible department, monitor its progress, and document every step until the issue is resolved.

The platform also provides public transparency by allowing visitors to monitor reported issues without exposing citizens' personal information.

---

# Problem Statement

Many municipalities still rely on traditional communication channels such as phone calls, emails, or in-person visits for reporting public issues. These methods often suffer from:

- Lack of transparency
- Slow response times
- Poor communication between citizens and municipal departments
- Difficulty tracking issue progress
- Missing accountability
- Inefficient organization of reports

Citizens frequently do not know whether their reports have been received, assigned, or resolved.

Municipal employees also face difficulties in organizing reports, prioritizing work, monitoring deadlines, and generating statistical reports.

This project addresses these challenges by providing a centralized digital platform that streamlines issue reporting and resolution while improving transparency and accountability.

---

# Project Objectives

The main objectives of this project are:

- Digitize the municipal issue reporting process.
- Improve communication between citizens and municipalities.
- Enable structured issue management.
- Increase transparency throughout the issue lifecycle.
- Simplify assignment of reports to responsible departments.
- Monitor issue resolution through predefined status workflows.
- Generate useful statistics and reports for administrators.

---

# Actors

The system contains four user roles.

## 👤 Citizen

A registered citizen can:

- Register and log into the platform
- Create new issue reports
- Upload photos
- Select issue location on the map
- Track report progress
- View report history
- Receive notifications

---

## 🏛 Municipality Officer

Municipality officers can:

- Review submitted reports
- Verify report validity
- Assign reports to departments
- Update report status
- Add internal comments
- Resolve or reject reports

---

## ⚙ Administrator

Administrators manage the entire platform.

Their responsibilities include:

- User management
- Department management
- Category management
- Dashboard monitoring
- Viewing statistics
- Exporting reports
- Monitoring audit logs
- Managing platform settings

---

## 🌍 Public Visitor

Visitors can:

- Browse public reports
- View issue locations
- Track issue status
- View statistics

Visitors cannot access personal information of citizens.

---

# Project Scope

The platform includes:

- User authentication
- Role-based authorization
- Issue reporting
- Interactive map
- Photo upload
- Issue categorization
- Municipality verification
- Department assignment
- Status workflow
- Comments
- Notifications
- SLA monitoring
- Public transparency
- Administrative dashboard
- Heatmap visualization
- Analytics
- CSV export
- JSON export
- Audit logging

---

# Project Boundaries

The following functionalities are **outside the scope** of this project:

- Emergency service reporting
- Real integration with municipality information systems
- Electronic government identity integration
- Payment processing
- Native Android or iOS applications
- AI-based image classification
- Processing real citizen personal data

The project will use only synthetic data for development and testing purposes.

---

# Initial Categories

The initial categories supported by the platform are:

- Roads and Potholes
- Street Lighting
- Waste Management
- Traffic Signs

Additional categories can be added by administrators.

---

# Technology Stack

## Frontend

- Next.js 15
- React
- TypeScript
- Tailwind CSS

## Backend

- Next.js Route Handlers (App Router)

## Database

- Supabase PostgreSQL

## Authentication

- Supabase Auth

## Storage

- Supabase Storage

## Maps

- OpenStreetMap
- Leaflet

## Charts

- Recharts

## Deployment

- Vercel

---

# Repository Structure

```
citizen-issue-platform/

├── app/
├── components/
├── lib/
├── types/
├── public/
├── docs/
├── diagrams/
├── wireframes/
├── dataset/
├── testing/
└── README.md
```

---

# Development Status

🚧 Project currently under development as part of the Bachelor's Thesis.

---

# License

This project is developed exclusively for academic purposes as a Bachelor's Thesis at the University "Isa Boletini" Mitrovica.
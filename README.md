# Event Management System — Cyber Threats Project

## Project Overview
The **Event Management System** is a full-stack secure web application designed for creating, managing, and categorizing events.  
Built using **React.js (Vite)** for the frontend and **Express.js + Prisma ORM** for the backend, it showcases secure authentication, protected APIs, and deliberate vulnerabilities for educational purposes.

The project demonstrates real-world cybersecurity concepts like **Confidentiality, Integrity, and Availability (CIA Triad)** along with their practical **attacks and mitigations**.

---

## Technologies Used
- **Frontend:** React.js (Vite), Tailwind CSS, Zod, React Hook Form
- **Backend:** Express.js, TypeScript, Prisma ORM
- **Database:** PostgreSQL
- **Authentication:** JWT stored in HTTP-only cookies
- **Security Middleware:** express-rate-limit, CORS configuration
- **Testing:** Postman, Browser DevTools

---

##  Installation and Setup Instructions

### Clone the Repository
```bash
git clone https://github.com/SG2104/EventMgmt
cd Event-Management-System
```

## Backend Setup
```bash
cd BE
npm install
npm run dev
```

- Configure .env file with your database URL and JWT secrets.
- Run Prisma migrations:

```bash
npx prisma migrate dev
```
- Seed initial categories before event creation:

Step 1: Make sure your backend is running
Step 2: Open Postman --> Create a Request
METHOD: POST
URL:
```bash
http://localhost:9000/api/events/categories
```

## Frontend Setup
```bash
cd FE
npm install
npm run dev
```

Access the app
- Frontend: http://localhost:5173
- Backend: http://localhost:9000


## CIA Triad Implementation

Confidentiality
- Attacks Demonstrated:
    - JWT Token Theft via XSS Attack
    - CORS Misconfiguration

- Mitigations:
    - Storing JWT tokens inside secure, HTTP-only cookies.
    - Restricting CORS to only trusted frontend origins.
 
Integrity
- Attacks Demonstrated:
    - CSRF Attack on Logout Endpoint.
    - SQL Injection on Debug Endpoint.

- Mitigations:
    - Authentication protecting using isAuthenticated middleware and SameSite: strict cookies.
    - Used Prisma's $queryRaw with parameterization to prevent SQL Injection.
 

Availability
- Attacks Demonstrated:
    - DoS Attack by Event Creation Flooding.
    - DoS Attack via Login Flooding.

- Mitigations:
    - Applied rate limiting on Event Creation and Login routes.


### Contributors and Responsibilities

| Contributors   | Responsibility |
|:--------------|:-------------------|
| **Shreyal Ganna** | Confidentiality (XSS, CORS) |
| **Keval Patel** | Integrity (CSRF, SQL Injection) |
| **Keegan McNear** | Availability (DoS Attacks) |

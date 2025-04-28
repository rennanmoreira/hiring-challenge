# Opwell Asset Management System

A full-stack application for managing industrial assets, built with Node.js, Express, TypeORM, and Next.js.

> **Note**: This project serves as a technical challenge for candidates applying to Opwell.

# Introduction

Opwell is a company focused on empowering the industrial sector through advanced technology and AI-driven solutions. One of its core services is asset management, which involves maintaining an accurate and structured inventory of industrial facilities, equipment, and parts, along with the necessary documentation for effective maintenance and operation.

This repository contains a sample application designed to simulate that functionality. It allows users to manage an inventory of:

- Plants – physical sites or facilities
- Areas – subdivisions within plants
- Equipment – machines or devices located in areas
- Parts – electrical, electronic, mechanical, or hydraulic components installed in equipment

Each of these entities is fully manageable through CRUD operations, and the application provides intuitive filtering and navigation between them. The frontend is built with Next.js and styled using Ant Design, while the backend uses Node.js, Express, and TSOA to expose a typed REST API.

This project demonstrates how asset data can be modeled and interacted with in a scalable, maintainable way—an important step toward smarter, more efficient industrial operations.

## Requirements

- Node.js v20 or higher
- Yarn package manager

## Overview

This application provides a comprehensive solution for managing industrial assets across multiple plants. It allows users to track plants, areas within plants, equipment within areas, and parts within equipment. The system supports CRUD operations for all entities and provides filtering capabilities to easily find specific assets.

## Architecture

The application follows a modern full-stack architecture:

- **Backend**: Node.js with Express, TypeORM for database operations, and TSOA for API generation
- **Frontend**: Next.js with React, Ant Design for UI components, and React Query for data fetching
- **Database**: SQLite (for simplicity, can be replaced with PostgreSQL or MySQL for production)

## Features

- **Dashboard**: Overview of all assets with quick access to detailed views
- **CRUD Operations**: Create, read, update, and delete all entities
- **Filtering**: Filter assets by various properties
- **Navigation**: Seamless navigation between related entities (e.g., from plants to areas)
- **Responsive Design**: Works on desktop and mobile devices
- **Area Neighbors**: Define and manage neighboring relationships between areas
- **Multiple Area Equipment**: Associate equipment with multiple areas
- **User Management**: Track who created or modified entities for audit purposes
- **History Tracking**: View complete history of area neighbor relationships, including deleted entries

## Backend Implementation

### Technologies

- **Node.js**: Runtime environment
- **Express**: Web framework
- **TypeORM**: Object-Relational Mapping (ORM) for database operations
- **TSOA**: TypeScript OpenAPI for API generation
- **SQLite**: Database (for development, can be replaced with PostgreSQL or MySQL)
- **TypeScript**: Programming language

### Project Structure

```
backend/
├── src/
│   ├── config/         # Configuration files (database, seed data)
│   ├── controllers/    # API controllers
│   │   ├── AreaController.ts
│   │   ├── AreaNeighborController.ts     # Manages area neighbor relationships
│   │   ├── EquipmentAreaController.ts    # Manages equipment-area associations
│   │   ├── EquipmentController.ts
│   │   ├── PartController.ts
│   │   ├── PlantController.ts
│   │   └── UserController.ts             # Manages user authentication
│   ├── models/         # Database models
│   │   ├── Area.ts
│   │   ├── AreaNeighbor.ts               # Defines area neighbor relationships
│   │   ├── Equipment.ts
│   │   ├── EquipmentArea.ts              # Defines equipment-area associations
│   │   ├── Part.ts
│   │   ├── Plant.ts
│   │   └── User.ts                       # User model for authentication and audit
│   ├── services/       # Business logic
│   │   ├── AreaNeighborService.ts        # Area neighbor business logic
│   │   ├── AreaService.ts
│   │   ├── EquipmentAreaService.ts       # Equipment-area business logic
│   │   ├── EquipmentService.ts
│   │   ├── PartService.ts
│   │   ├── PlantService.ts
│   │   └── UserService.ts                # User authentication logic
│   ├── routes/         # Auto-generated routes
│   └── index.ts        # Application entry point
├── tests/              # Test files
├── package.json        # Dependencies and scripts
├── tsconfig.json       # TypeScript configuration
└── tsoa.json           # TSOA configuration
```

### API Documentation

The API documentation is available at `/docs` when the server is running. It provides detailed information about all available endpoints, request/response formats, and data models.

### Setup and Running

1. Install dependencies:

   ```bash
   cd backend
   yarn install
   ```

2. Start the development server:

   ```bash
   yarn dev
   ```

3. Build for production:

   ```bash
   yarn build
   ```

4. Start the production server:
   ```bash
   yarn start
   ```

## Frontend Implementation

### Technologies

- **Next.js**: React framework for server-rendered applications
- **React**: UI library
- **Ant Design**: UI component library
- **React Query**: Data fetching and state management
- **Axios**: HTTP client
- **TypeScript**: Programming language

### Project Structure

```
frontend/
├── src/
│   ├── app/            # Next.js app router pages
│   │   ├── area-neighbors/  # Area neighbor management page
│   │   ├── areas/           # Areas management page
│   │   ├── equipment/       # Equipment management page
│   │   ├── login/           # User authentication page
│   │   ├── parts/           # Parts management page
│   │   └── plants/          # Plants management page
│   ├── components/     # Reusable React components
│   │   ├── Layout.tsx       # Main layout with authentication status
│   │   └── LoginModal.tsx   # Reusable login modal component
│   ├── lib/            # Utility functions and libraries
│   ├── services/       # API service functions
│   │   └── api.ts           # API client with endpoints for all entities
│   ├── utils/          # Utility functions
│   │   └── apiErrorHandler.ts # Error handling for API requests
│   └── globals.css     # Global styles
├── public/             # Static assets
├── package.json        # Dependencies and scripts
└── tsconfig.json       # TypeScript configuration
```

### Pages

- **Dashboard**: Overview of all assets
- **Plants**: Manage plants
- **Areas**: Manage areas within plants
- **Area Neighbors**: Manage neighboring relationships between areas with history tracking
- **Equipment**: Manage equipment within areas (including multiple area associations)
- **Parts**: Manage parts within equipment
- **Login**: User authentication for tracking changes

### Setup and Running

1. Install dependencies:

   ```bash
   cd frontend
   yarn install
   ```

2. Start the development server:

   ```bash
   yarn dev
   ```

3. Build for production:

   ```bash
   yarn build
   ```

4. Start the production server:
   ```bash
   yarn start
   ```

## Data Models

### User

| Field     | Type     | Description           |
| --------- | -------- | --------------------- |
| id        | UUID     | Primary key           |
| username  | String   | Username for login    |
| password  | String   | Hashed password       |
| name      | String   | Display name          |
| createdAt | DateTime | Creation timestamp    |
| updatedAt | DateTime | Last update timestamp |

### Plant

| Field     | Type     | Description           |
| --------- | -------- | --------------------- |
| id        | UUID     | Primary key           |
| name      | String   | Name of the plant     |
| address   | String   | Physical address      |
| areas     | Relation | One-to-many with Area |
| createdAt | DateTime | Creation timestamp    |
| updatedAt | DateTime | Last update timestamp |

### Area

| Field               | Type     | Description                      |
| ------------------- | -------- | -------------------------------- |
| id                  | UUID     | Primary key                      |
| name                | String   | Name of the area                 |
| locationDescription | String   | Area description                 |
| plant               | Relation | Many-to-one with Plant           |
| plantId             | UUID     | Foreign key to Plant             |
| equipment           | Relation | Many-to-many with Equipment      |
| neighbors           | Relation | Many-to-many with Area (self)    |
| createdAt           | DateTime | Creation timestamp               |
| updatedAt           | DateTime | Last update timestamp            |

### AreaNeighbor

| Field               | Type     | Description                      |
| ------------------- | -------- | -------------------------------- |
| id                  | UUID     | Primary key                      |
| area                | Relation | Many-to-one with Area            |
| areaId              | UUID     | Foreign key to source Area       |
| neighborArea        | Relation | Many-to-one with Area            |
| neighborAreaId      | UUID     | Foreign key to neighbor Area     |
| createdByUser       | Relation | Many-to-one with User            |
| createdByUserId     | UUID     | Foreign key to creating User     |
| updatedByUser       | Relation | Many-to-one with User            |
| updatedByUserId     | UUID     | Foreign key to updating User     |
| createdAt           | DateTime | Creation timestamp               |
| updatedAt           | DateTime | Last update timestamp            |
| deletedAt           | DateTime | Soft deletion timestamp          |

### Equipment

| Field                 | Type     | Description                 |
| --------------------- | -------- | --------------------------- |
| id                    | UUID     | Primary key                 |
| name                  | String   | Name of the equipment       |
| manufacturer          | String   | Equipment manufacturer      |
| serialNumber          | String   | Equipment serial number     |
| initialOperationsDate | Date     | Start date of operations    |
| areas                 | Relation | Many-to-many with Area      |
| parts                 | Relation | One-to-many with Part       |
| createdAt             | DateTime | Creation timestamp          |
| updatedAt             | DateTime | Last update timestamp       |

### Part

| Field            | Type     | Description                            |
| ---------------- | -------- | -------------------------------------- |
| id               | UUID     | Primary key                            |
| name             | String   | Name of the part                       |
| type             | Enum     | Part type (IT/OIL_AND_GAS/AGRICULTURE) |
| manufacturer     | String   | Part manufacturer                      |
| serialNumber     | String   | Part serial number                     |
| installationDate | Date     | Installation date                      |
| equipment        | Relation | Many-to-one with Equipment             |
| equipmentId      | UUID     | Foreign key to Equipment               |
| createdAt        | DateTime | Creation timestamp                     |
| updatedAt        | DateTime | Last update timestamp                  |

## Database Schema

```mermaid
erDiagram
    User ||--o{ AreaNeighbor : "creates/updates"
    User ||--o{ EquipmentArea : "creates/updates"
    Plant ||--o{ Area : "has many"
    Area ||--o{ AreaNeighbor : "has many neighbors"
    Area ||--o{ EquipmentArea : "has many"
    Equipment ||--o{ EquipmentArea : "belongs to many"
    Equipment ||--o{ Part : "has many"

    User {
        string id PK "uuid"
        string username
        string password
        string name
        datetime createdAt
        datetime updatedAt
    }

    Plant {
        string id PK "uuid"
        string name
        string address
        datetime createdAt
        datetime updatedAt
    }

    Area {
        string id PK "uuid"
        string name
        string locationDescription
        string plantId FK
        datetime createdAt
        datetime updatedAt
    }

    AreaNeighbor {
        string id PK "uuid"
        string areaId FK
        string neighborAreaId FK
        string createdByUserId FK
        string updatedByUserId FK
        datetime createdAt
        datetime updatedAt
        datetime deletedAt
    }

    Equipment {
        string id PK "uuid"
        string name
        string manufacturer
        string serialNumber
        date initialOperationsDate
        datetime createdAt
        datetime updatedAt
    }

    EquipmentArea {
        string id PK "uuid"
        string equipmentId FK
        string areaId FK
        string createdByUserId FK
        string updatedByUserId FK
        datetime createdAt
        datetime updatedAt
        datetime deletedAt
    }

    Part {
        string id PK "uuid"
        string name
        enum type "ELECTRIC|ELECTRONIC|MECHANICAL|HYDRAULICAL"
        string manufacturer
        string serialNumber
        date installationDate
        string equipmentId FK
        datetime createdAt
        datetime updatedAt
    }
```

The diagram shows the relationships between the main entities in the system:

- A **Plant** can have multiple **Areas**
- An **Area** can have multiple **Neighboring Areas** (through AreaNeighbor)
- An **Area** can have multiple pieces of **Equipment** (through EquipmentArea)
- A piece of **Equipment** can belong to multiple **Areas** (through EquipmentArea)
- A piece of **Equipment** can have multiple **Parts**
- **Users** create and update **AreaNeighbor** and **EquipmentArea** relationships

Each entity has timestamps (`createdAt` and `updatedAt`) for auditing purposes. The AreaNeighbor and EquipmentArea entities also have `deletedAt` for soft deletion, enabling history tracking. The relationships are enforced through foreign keys, ensuring data integrity across the system.

## API Routes

### Authentication

- `POST /api/users/login` - Authenticate a user
- `GET /api/users/current` - Get current authenticated user
- `POST /api/users/logout` - Log out current user

### Plants

- `GET /api/plants` - Get all plants
- `GET /api/plants/:id` - Get a specific plant
- `POST /api/plants` - Create a new plant
- `PUT /api/plants/:id` - Update a plant
- `DELETE /api/plants/:id` - Delete a plant

### Areas

- `GET /api/areas` - Get all areas
- `GET /api/areas/:id` - Get a specific area
- `POST /api/areas` - Create a new area
- `PUT /api/areas/:id` - Update an area
- `DELETE /api/areas/:id` - Delete an area

### Area Neighbors

- `GET /api/area-neighbors` - Get all area neighbors
- `GET /api/area-neighbors/:areaId` - Get neighbors for a specific area
- `GET /api/area-neighbors/history/:areaId` - Get complete history of area neighbor relationships
- `POST /api/area-neighbors` - Create a new area neighbor relationship
- `DELETE /api/area-neighbors/:id` - Delete an area neighbor relationship

### Equipment

- `GET /api/equipment` - Get all equipment
- `GET /api/equipment/:id` - Get a specific equipment
- `POST /api/equipment` - Create new equipment
- `PUT /api/equipment/:id` - Update equipment
- `DELETE /api/equipment/:id` - Delete equipment

### Equipment Areas

- `GET /api/equipment-areas` - Get all equipment-area associations
- `GET /api/equipment-areas/:equipmentId` - Get areas for a specific equipment
- `POST /api/equipment-areas` - Create a new equipment-area association
- `DELETE /api/equipment-areas/:id` - Delete an equipment-area association

### Parts

- `GET /api/parts` - Get all parts
- `GET /api/parts/:id` - Get a specific part
- `POST /api/parts` - Create a new part
- `PUT /api/parts/:id` - Update a part
- `DELETE /api/parts/:id` - Delete a part

## Part Types

- `IT` - Information Technology components
- `OIL_AND_GAS` - Oil and Gas industry components
- `AGRICULTURE` - Agricultural industry components

## Getting Started

1. Clone the repository
2. Install dependencies for both backend and frontend
3. Start the backend server
4. Start the frontend development server
5. Access the application at http://localhost:3000

## License

ISC

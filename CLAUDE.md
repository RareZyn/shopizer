# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Shopizer is a headless Java e-commerce platform built with Spring Boot 2.5.12. It provides REST APIs for catalog, shopping cart, checkout, merchant management, orders, customers, and users. The application uses a multi-module Maven structure and is designed for Java 11+ (tested with Java 11, 17).

## Build and Run Commands

### Build the entire project
```bash
./mvnw clean install
```

### Run the application (from root directory)
```bash
cd sm-shop
../mvnw spring-boot:run
```

### Run with specific database
Edit `sm-shop/src/main/resources/application.properties` to configure database connection. By default, uses H2 in-memory database. MySQL, PostgreSQL, and Oracle configurations are available but commented out in the parent pom.xml.

### Access the API
Once running, access Swagger UI at: http://localhost:8080/swagger-ui.html

### Run tests
```bash
./mvnw test
```

### Run tests for specific module
```bash
cd sm-shop
../mvnw test
```

### Build Docker image
```bash
cd sm-shop
docker build . -t shopizer:local
```

### Run from Docker
```bash
docker run -p 8080:8080 shopizerecomm/shopizer:latest
```

## Project Architecture

### Module Structure

The project is organized into 5 Maven modules that follow a layered architecture:

1. **sm-core-model** - Domain entities and JPA models
   - Contains all business domain entities (Product, Order, Customer, etc.)
   - JPA entity definitions with Hibernate mappings
   - Organized by domain: catalog, customer, merchant, order, payments, shipping, etc.

2. **sm-core-modules** - Integration modules and external service interfaces
   - Payment gateway integrations (PayPal, Stripe, Braintree)
   - Shipping integrations
   - Email modules
   - Storage modules (AWS S3, Google Cloud Storage)

3. **sm-core** - Business logic layer
   - Service interfaces and implementations
   - JPA repositories (Spring Data)
   - Business rules and validation
   - Event handling (product events, asynchronous processing)
   - Configuration (Drools, Database, Search)
   - Located at: `sm-core/src/main/java/com/salesmanager/core/business/`

4. **sm-shop-model** - API request/response DTOs
   - REST API models (request/response objects)
   - Separate from domain entities to decouple API from persistence layer
   - Persistable* classes for incoming requests (e.g., PersistableProduct)
   - Readable* classes for outgoing responses (e.g., ReadableProduct)

5. **sm-shop** - REST API and web layer
   - Main Spring Boot application (ShopApplication.java)
   - REST controllers organized by API version (v0, v1, v2)
   - Facades - business logic orchestration layer between controllers and services
   - Mappers - MapStruct mappers to convert between DTOs and entities
   - Security configuration (JWT-based)
   - Located at: `sm-shop/src/main/java/com/salesmanager/shop/`

### Architectural Pattern

The application follows a **multi-layered architecture with facade pattern**:

```
Controller (REST API)
    ↓
Facade (orchestration, business workflow)
    ↓
Service (business logic, transactions)
    ↓
Repository (data access)
    ↓
Entity (domain model)
```

**Key architectural concepts:**

- **Facades** (`sm-shop/store/facade/`) orchestrate multiple services and handle complex workflows. They serve as an anti-corruption layer between the API and business layer.

- **Mappers** use MapStruct for DTO ↔ Entity conversion. The mapper interfaces are in `sm-shop/mapper/` and MapStruct generates implementations at compile time.

- **Services** (`sm-core/business/services/`) contain business logic and are transaction-aware. Services are organized by domain (catalog, customer, order, etc.).

- **Repositories** (`sm-core/business/repositories/`) use Spring Data JPA for persistence. Most are simple interfaces extending JpaRepository.

- **Event-driven architecture** for product operations - product save/delete operations trigger events that are handled asynchronously (e.g., for search indexing).

### API Versioning

REST APIs are organized by version:
- **v0** - Legacy/deprecated endpoints
- **v1** - Stable production APIs
- **v2** - Newer APIs with enhanced features

API controllers are in: `sm-shop/src/main/java/com/salesmanager/shop/store/api/v{N}/`

### Security

- JWT-based authentication configured in `sm-shop/store/security/`
- Spring Security with custom authentication filters
- API endpoints can be secured via annotations
- Default SecurityAutoConfiguration is excluded in ShopApplication

### Configuration

Key configuration files:
- `sm-shop/src/main/resources/application.properties` - Main Spring Boot configuration
- Database schema: `SALESMANAGER` (configurable via `spring.jpa.properties.hibernate.default_schema`)
- Server runs on port 8080 by default
- Hibernate statistics and SQL logging are configurable

### Key Technologies

- **Spring Boot 2.5.12** - Application framework
- **Hibernate/JPA** - ORM
- **MapStruct 1.3.0** - DTO mapping
- **Swagger 2.9.2** - API documentation
- **Drools 7.32** - Business rules engine
- **Infinispan 9.4.18** - Caching
- **JWT 0.8.0** - Authentication tokens
- **Elasticsearch 7.5.2** - Product search (optional)
- **MySQL/PostgreSQL/Oracle** - Production databases (H2 for dev/test)
- **Payment gateways** - PayPal, Stripe, Braintree
- **Cloud storage** - AWS S3, Google Cloud Storage

### Domain Model Organization

All domain models in `sm-core-model` are organized by business domain:
- `catalog` - Products, categories, manufacturers
- `customer` - Customer accounts, addresses
- `merchant` - Store/merchant configuration
- `order` - Orders, order items, order totals
- `payments` - Payment transactions
- `shipping` - Shipping methods, quotes
- `shoppingcart` - Cart and cart items
- `tax` - Tax classes and rules
- `user` - Admin users and permissions

## Development Guidelines

### Adding a new REST endpoint

1. Create request/response DTOs in `sm-shop-model` if needed
2. Create or update a Facade in `sm-shop/store/facade/` to orchestrate business logic
3. Create MapStruct mapper interfaces in `sm-shop/mapper/` for DTO conversions
4. Add controller endpoint in appropriate API version in `sm-shop/store/api/v{N}/`
5. Services and repositories should already exist in `sm-core` for most operations

### Adding a new entity

1. Create JPA entity in `sm-core-model/model/` under appropriate domain package
2. Create Spring Data repository in `sm-core/repositories/` under matching domain package
3. Create service interface and implementation in `sm-core/services/` under matching domain package
4. Create DTOs in `sm-shop-model` and mappers in `sm-shop/mapper/`

### Running a single test

```bash
cd sm-shop
../mvnw test -Dtest=ProductManagementAPIIntegrationTest
```

### Working with MapStruct

MapStruct generates mapper implementations at compile time. After modifying mapper interfaces:
```bash
./mvnw clean compile
```
This triggers the MapStruct annotation processor configured in the parent pom.xml.

### Database Migrations

The project uses Hibernate's `ddl-auto` for schema management. For production, consider:
- Exporting schema: Configure `spring.jpa.properties.hibernate.hbm2ddl.auto`
- Using Flyway or Liquibase for version-controlled migrations (not currently configured)

### Integration Tests

Integration tests are in `sm-shop/src/test/` and use:
- `@SpringBootTest` with `WebEnvironment.RANDOM_PORT`
- RestTemplate for API testing
- Organized by domain (product, category, cart, order, etc.)

Sample integration test: `ProductManagementAPIIntegrationTest.java`

## CI/CD

CircleCI is configured in `.circleci/config.yml`:
- Build and test run on all commits
- Docker image builds and pushes to DockerHub on successful builds
- Image tagged as: `shopizerecomm/shopizer:3.2.7`

## Common Issues

### MapStruct compilation errors
Run `mvnw clean compile` to regenerate mapper implementations.

### Port already in use
Default port is 8080. Change in `application.properties`: `server.port=XXXX`

### Database connection issues
Check `spring.jpa.properties.hibernate.default_schema` in application.properties matches your database schema name.

### Running on Windows
Use `mvnw.cmd` instead of `./mvnw` on Windows command prompt.

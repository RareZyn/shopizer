#!/bin/bash
# Create database.properties from environment variables for cloud deployment

# Create config directory
mkdir -p /app/config

# Generate database.properties from environment variables
cat > /app/config/database.properties << EOF
##
## Database Configuration - Generated from Environment Variables
##

# PostgreSQL connection
db.jdbcUrl=${SPRING_DATASOURCE_URL}
db.user=${SPRING_DATASOURCE_USERNAME}
db.password=${SPRING_DATASOURCE_PASSWORD}
db.driverClass=org.postgresql.Driver
hibernate.dialect=${SPRING_JPA_DATABASE_PLATFORM:-org.hibernate.dialect.PostgreSQL10Dialect}
db.preferredTestQuery=SELECT 1

db.show.sql=${SPRING_JPA_SHOW_SQL:-false}
db.schema=SALESMANAGER
hibernate.hbm2ddl.auto=${SPRING_JPA_HIBERNATE_DDL_AUTO:-update}

##
# Connection pool configuration
##
db.initialPoolSize=4
db.minPoolSize=4
db.maxPoolSize=10
EOF

echo "Database configuration created at /app/config/database.properties"

# Start the application with config directory in classpath
# This makes database.properties available as classpath:database.properties
exec java $JAVA_OPTS -Dserver.port=$PORT -cp /app/config:/app/shopizer.jar org.springframework.boot.loader.JarLauncher

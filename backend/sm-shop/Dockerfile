# Multi-stage build for Shopizer Spring Boot application
# Stage 1: Build the application
FROM maven:3.8.6-openjdk-11-slim AS build
WORKDIR /app

# Copy the parent pom and all module poms
COPY pom.xml .
COPY sm-core-model/pom.xml sm-core-model/
COPY sm-core-modules/pom.xml sm-core-modules/
COPY sm-core/pom.xml sm-core/
COPY sm-shop-model/pom.xml sm-shop-model/
COPY sm-shop/pom.xml sm-shop/

# Download dependencies (cached layer)
RUN mvn dependency:go-offline -B

# Copy source code
COPY sm-core-model/src sm-core-model/src
COPY sm-core-modules/src sm-core-modules/src
COPY sm-core/src sm-core/src
COPY sm-shop-model/src sm-shop-model/src
COPY sm-shop/src sm-shop/src

# Build the application (skip tests for faster builds)
RUN mvn clean package -DskipTests -B

# Stage 2: Runtime
FROM eclipse-temurin:11-jre-jammy
WORKDIR /app

# Create directory for file uploads
RUN mkdir -p /files

# Copy the built JAR from build stage
COPY --from=build /app/sm-shop/target/sm-shop-*.jar /app/shopizer.jar

# Set environment variables with defaults
ENV PORT=8080
ENV JAVA_OPTS="-Xmx512m -Xms256m"

# Expose port (Render will use PORT env variable)
EXPOSE ${PORT}

# Run the application
# Use PORT environment variable from Render
CMD java $JAVA_OPTS -Dserver.port=$PORT -jar /app/shopizer.jar
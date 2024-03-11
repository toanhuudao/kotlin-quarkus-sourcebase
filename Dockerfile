# Stage 1: Setup Gradle environment and enable caching
FROM gradle:8.5-jdk21 as base
ENV GRADLE_OPTS="-Dorg.gradle.daemon=true"
WORKDIR /home/gradle/src
COPY gradle.properties build.gradle.kts settings.gradle.kts /home/gradle/src/
COPY src /home/gradle/src/src

# Stage 2: Build the application
RUN gradle build --parallel

# Stage 3: Create the final runtime image
FROM registry.access.redhat.com/ubi8/openjdk-21:1.18
ENV LANGUAGE='en_US:en'

# Copy the built application from the build stage
COPY --from=base /home/gradle/src/build/quarkus-app/lib/ /deployments/lib/
COPY --from=base /home/gradle/src/build/quarkus-app/*.jar /deployments/
COPY --from=base /home/gradle/src/build/quarkus-app/app/ /deployments/app/
COPY --from=base /home/gradle/src/build/quarkus-app/quarkus/ /deployments/quarkus/

EXPOSE 8080
USER 185
ENV JAVA_OPTS_APPEND="-Djava.util.logging.manager=org.jboss.logmanager.LogManager"
ENV JAVA_APP_JAR="/deployments/quarkus-run.jar"

ENTRYPOINT [ "/opt/jboss/container/java/run/run-java.sh" ]

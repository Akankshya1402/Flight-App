pipeline {
    agent any

    tools {
        maven 'maven3'
        jdk 'jdk17'
        nodejs 'node20'
    }

    environment {
        SONAR_PROJECT_KEY = 'flight-app-microservices'
        SONAR_PROJECT_NAME = 'Flight-App'
    }

    stages {

        stage('Checkout') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/Akankshya1402/Flight-App.git'
            }
        }

        stage('Backend Build & SonarQube') {
            steps {
                dir('backend') {
                    withSonarQubeEnv('sonarqube') {
                        bat """
                        mvn clean verify ^
                        -DskipTests=true ^
                        sonar:sonar ^
                        -Dsonar.projectKey=%SONAR_PROJECT_KEY% ^
                        -Dsonar.projectName=%SONAR_PROJECT_NAME%
                        """
                    }
                }
            }
        }

        stage('Quality Gate') {
            steps {
                timeout(time: 5, unit: 'MINUTES') {
                    waitForQualityGate abortPipeline: true
                }
            }
        }

        stage('Build Backend Docker Images') {
            steps {
                dir('backend') {
                    bat "docker build -t api-gateway ./api-gateway"
                    bat "docker build -t booking-service ./booking-service"
                    bat "docker build -t config-server ./config-server"
                    bat "docker build -t eureka-server ./eureka-server"
                    bat "docker build -t flight-service ./flight-service"
                    bat "docker build -t notification-service ./notification-service"
                }
            }
        }

        stage('Build Frontend') {
            steps {
                dir('frontend/flight-frontend') {
                    bat "node -v"
                    bat "npm ci"
                    bat "npm run build"
                }
            }
        }

        stage('Build Frontend Docker Image') {
            steps {
                bat "docker build -t flight-frontend ./frontend/flight-frontend"
            }
        }
    }

    post {
        success {
            echo '✅ Flight-App CI pipeline completed successfully'
        }
        failure {
            echo '❌ Flight-App CI pipeline failed'
        }
    }
}


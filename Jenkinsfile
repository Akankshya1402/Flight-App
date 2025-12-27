pipeline {
    agent any

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build API Gateway') {
            steps {
                dir('backend/api-gateway') {
                    sh 'mvn clean package -DskipTests'
                }
            }
        }

        stage('Build Booking Service') {
            steps {
                dir('backend/booking-service') {
                    sh 'mvn clean package -DskipTests'
                }
            }
        }

        stage('Build Config Server') {
            steps {
                dir('backend/config-server') {
                    sh 'mvn clean package -DskipTests'
                }
            }
        }

        stage('Build Eureka Server') {
            steps {
                dir('backend/eureka-server') {
                    sh 'mvn clean package -DskipTests'
                }
            }
        }

        stage('Build Flight Service') {
            steps {
                dir('backend/flight-service') {
                    sh 'mvn clean package -DskipTests'
                }
            }
        }

        stage('Build Frontend') {
            steps {
                dir('frontend') {
                    sh 'npm install'
                    sh 'npm run build'
                }
            }
        }
    }

    post {
        success {
            echo '✅ All microservices and frontend built successfully'
        }
        failure {
            echo '❌ Build failed'
        }
    }
}

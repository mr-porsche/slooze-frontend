pipeline {
    agent any

    environment {
        DOCKER_IMAGE "mrporsch3/slooze-frontend"
        DOCKER_TAG = "latest"
    }

    stages {
        stage('install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Build App') {
            steps {
                sh 'npm run build'
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    docker.build("${DOCKER_IMAGE}:${DOCKER_TAG}")
                }
            }
        }

        stage('Push to Docker Hub') {
            steps {
                script {
                    docker.withRegistry('', 'dockerhub-creds') {
                        docker.image("${DOCKER_IMAGE}:${DOCKER_TAG}")
                    }
                }
            }
        }
    }
}
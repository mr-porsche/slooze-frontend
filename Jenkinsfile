pipeline {
    agent any

    stages {
        stage('install Dependencies') {
            step {
                sh 'npm install'
            }
        }

        stage('Build App') {
            step {
                sh 'npm run build'
            }
        }

        stage('Build Docker Image') {
            step {
                sh 'docker build -t slooze-frontend:ci .'
            }
        }
    }
}
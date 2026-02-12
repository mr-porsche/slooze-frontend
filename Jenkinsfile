pipeline {
    agent any

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
                sh 'docker build -t slooze-frontend:ci .'
            }
        }
    }
}
pipeline {
    agent any

    tools {
        nodejs "Node25" // Verifica que este tool exista en Jenkins
        // dockerTool no es necesario si Docker está instalado en el agente
    }

    stages {
        stage('Instalar dependencias') {
            steps {
                sh 'npm ci' // Mejor que npm install para CI
            }
        }

        stage('Ejecutar tests') {
            steps {
                sh 'npm test -- --detectOpenHandles' // Flag para evitar que Jest se quede pegado
            }
        }

        stage('Construir Imagen Docker') {
            when {
                expression { currentBuild.result == null || currentBuild.result == 'SUCCESS' }
            }
            steps {
                script {
                    // Verifica permisos de Docker
                    sh 'docker --version'
                    sh 'docker build -t hola-mundo-node:latest .'
                }
            }
        }

        stage('Ejecutar Contenedor Node.js') {
            when {
                expression { currentBuild.result == null || currentBuild.result == 'SUCCESS' }
            }
            steps {
                sh '''
                    docker stop hola-mundo-node || true
                    docker rm hola-mundo-node || true
                    docker run -d --name hola-mundo-node -p 3000:3000 hola-mundo-node:latest
                '''
            }
        }

        stage('Verificar aplicación') {
            when {
                expression { currentBuild.result == null || currentBuild.result == 'SUCCESS' }
            }
            steps {
                sh 'sleep 5' // Espera que la app inicie
                sh 'curl -f http://localhost:3000 || true'
            }
        }
    }
    
    post {
        always {
            sh 'docker stop hola-mundo-node || true'
            sh 'docker rm hola-mundo-node || true'
        }
    }
}
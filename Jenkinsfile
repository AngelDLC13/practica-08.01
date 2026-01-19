pipeline {
    agent any
    
    stages {
        stage('Preparar entorno') {
            steps {
                script {
                    // Instalar Node.js si no está disponible
                    sh '''
                        if ! command -v node &> /dev/null; then
                            echo "Instalando Node.js..."
                            curl -fsSL https://deb.nodesource.com/setup_25.x | bash -
                            apt-get install -y nodejs
                        fi
                        node --version
                        npm --version
                    '''
                }
            }
        }

        stage('Instalar dependencias') {
            steps {
                sh 'npm ci'
            }
        }

        stage('Ejecutar tests') {
            steps {
                sh 'npm test'
            }
        }

        stage('Construir Imagen Docker') {
            when {
                expression { currentBuild.result == null || currentBuild.result == 'SUCCESS' }
            }
            steps {
                sh 'docker build -t hola-mundo-node:latest .'
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
                sh 'sleep 5'
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
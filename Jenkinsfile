pipeline {
    agent any
    environment {
        DOCKER_BUILDKIT = '1'
    }
    stages {
        stage('Verificar Repositório') {
            steps {
                checkout([
                    $class: 'GitSCM',
                    branches: [[name: '*/main']],
                    doGenerateSubmoduleConfigurations: false,
                    extensions: [],
                    submoduleCfg: [],
                    userRemoteConfigs: [[
                        url: 'https://github.com/RenanFerreirax/Delivery-Cardapio-e-Restaurante.git'
                    ]]
                ])
            }
        }
        stage('Instalar Dependências') {
            steps {
                sh '''
                    rm -rf node_modules
                    rm -rf package-lock.json
                    npm install
                    npx prisma generate
                '''
            }
        }
        stage('Build Docker') {
            steps {
                sh '''
                    docker compose build --no-cache
                '''
            }
        }
        stage('Deploy') {
            steps {
                sh '''
                    docker compose down
                    docker compose up -d
                '''
            }
        }
        stage('Verificar Containers') {
            steps {
                sh 'docker ps'
            }
        }
    }
    post {
        success {
            echo 'Deploy do Restaurante/Cardápio realizado com sucesso no Yacht (Linux)!'
        }
        failure {
            echo 'Houve um erro durante o deploy do Restaurante/Cardápio.'
        }
        always {
            sh 'docker image prune -f || true'
        }
    }
}

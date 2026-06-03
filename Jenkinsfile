 pipeline {
    agent any

    environment {
        IMAGE_NAME = "delivery-restaurante-cardapio"
        IMAGE_TAG  = "delivery-restaurante-cardapio"
    }

    stages {

        stage('Checkout') {
            steps {
                echo '📥 Clonando repositório...'
                checkout scm
            }
        }

        stage('Instalar Dependências') {
            steps {
                echo '📦 Instalando dependências...'
                sh 'npm install'
            }
        }

        stage('Gerar Prisma Client') {
            steps {
                echo '🗄️  Gerando Prisma Client...'
                sh 'npx prisma generate'
            }
        }

        stage('Build docker') {
            steps {
                echo '🐳 Fazendo build da imagem Docker...'
                sh "docker build -t ${IMAGE_NAME}:${IMAGE_TAG} ."
            }
        }

       stage('Deploy') {
    steps {
        echo '🚀 Subindo containers com Docker Compose...'
        sh 'docker compose up -d --build'
    }
}

    }

    post {

        success {
            echo '✅ Pipeline executado com sucesso!'
        }

        failure {
            echo '❌ Pipeline falhou. Verifique os logs acima.'
        }

        always {
            echo '🏁 Pipeline finalizado.'
        }

    }
}

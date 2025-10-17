🚀 **PROJETO E-COMMERCE | Desafio Trainee - Comp Jr. (Semanas 1-2):**

**Contexto**

Este documento descreve o progresso inicial do Desafio da Trilha Tech de Back-End para o Programa de Trainee da Comp Júnior, referente às semanas 1 e 2. O objetivo nesta fase foi estruturar o ambiente de desenvolvimento e modelar a base de dados que servirá de alicerce para a API RESTful.

**Sobre a Fase Inicial do Projeto**

Nesta etapa, o foco foi a criação de um ambiente de desenvolvimento robusto e escalável. Para isso, o projeto foi conteinerizado com Docker, garantindo que a aplicação e seu banco de dados possam ser executados de forma consistente. Paralelamente, foi realizada a modelagem e a criação do banco de dados relacional em MySQL.

**Desafios e Aprendizados**

  Esta fase inicial do projeto foi uma jornada de grande aprendizado, especialmente por ser meu primeiro contato aprofundado com algumas dessas tecnologias. A experiência de utilizar ferramentas inovadoras foi tão desafiadora quanto gratificante.
  
  Um dos maiores desafios foi compreender a lógica por trás da conteinerização de um banco de dados com Docker. Entender como um serviço que precisa persistir dados, como o MySQL, se comportaria dentro de um contêiner efêmero exigiu pesquisa sobre volumes e redes no Docker. A ideia de isolar o banco de dados e garantir que ele se comunicasse com a futura aplicação, tudo orquestrado pelo Docker, foi um conceito novo e poderoso.
  
  Outro ponto desafiador foi a modelagem do banco de dados. Organizar as tabelas, definir os relacionamentos e decidir quais informações eram realmente essenciais para o funcionamento do e-commerce demandou um planejamento cuidadoso. O objetivo era criar uma estrutura lógica e eficiente, evitando redundâncias e garantindo a integridade dos dados desde o início.
  
  Além disso, um obstáculo técnico interessante foi descobrir como vincular o banco de dados rodando no contêiner ao VS Code. Eu precisava de uma forma de visualizar, gerenciar e, principalmente, criar as tabelas do zero através de scripts, caso o banco de dados ainda não existisse. Após algumas tentativas, a solução foi configurar o Docker para executar automaticamente um script de inicialização (.sql) na primeira vez que o contêiner do MySQL fosse criado, garantindo que o banco de dados e suas tabelas fossem gerados de forma automática e padronizada.
  
  No fim, superar essas barreiras e ver o ambiente funcionando foi uma experiência inovadora, que solidificou muitos conceitos importantes de back-end e infraestrutura.

🛠️ **Tecnologias Utilizadas**

Nesta fase, as seguintes tecnologias foram empregadas para a estruturação do ambiente:

<p align="center"> <img src="https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white" alt="MySQL" /> &nbsp; <img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker" /> </p>

import swaggerAutogen from "swagger-autogen";


const doc = {
    info: {
      title: 'ZenLab',
      description: 'A code platform for competitive programmers',
    },
    host: process.env.BASE_URL
  };
  
  const outputFile = './swagger-output.json';
  const routes = ['./src/Routes/auth.routes.js', './src/Routes/problems.routes.js', './src/Routes/codeExecution.routes.js', './src/Routes/submission.routes.js', './src/Routes/playlist.routes.js'];

  swaggerAutogen()(outputFile, routes, doc);

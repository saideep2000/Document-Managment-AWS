const awsconfig = {
  Auth: {
    region: 'us-east-1',
    userPoolId: 'MyAppUserPool',
    userPoolWebClientId: 'MyAppClient',
    oauth: {
      domain: 'https://docu-flow.auth.us-east-1.amazoncognito.com',
      scope: ['email', 'openid', 'profile'],
      redirectSignIn: 'http://localhost:3000/',
      redirectSignOut: 'http://localhost:3000/',
      responseType: 'code' // or 'token' depending on your configuration
    }
  }
};

export default awsconfig;

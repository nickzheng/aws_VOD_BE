# Environment presets

## configure aws cli
```shell
aws configure
#'us-east-1'
```

## configure Beanstalk
```shell
brew install awsebcli
#'us-east-1'
```

# Release
In the project directory, you can run:

`npm run build`

It will create a release archives `myapp.zip`

`npm run release`

It will run `eb deploy` to deploy `myapp.zip`to `elastic beanstalk` `EC2` 


# Local development

`npm install`

`npm start`

It will host the `swagger` api doc at http://127.0.0.1:3000/api/#/

# Test
`npm test`

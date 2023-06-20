import { fileURLToPath } from "url"
import path from "path"

const dirname = path.dirname(fileURLToPath(import.meta.url))

export let deploy = {

  async start ({cloudformation}) {

    // defines a private bucket with loose acls for signed uploads
    cloudformation.Resources.PrivateBucket = {
      Type: 'AWS::S3::Bucket',
      DeletionPolicy: 'Delete',
      Properties: {
        OwnershipControls: {
          Rules: [{ObjectOwnership: "ObjectWriter"}] // allows direct upload to s3
        },
        PublicAccessBlockConfiguration: {
          BlockPublicAcls: false,
          BlockPublicPolicy: false,
          IgnorePublicAcls: false,
          RestrictPublicBuckets: false 
        },
        BucketEncryption: {
          ServerSideEncryptionConfiguration: [{
            ServerSideEncryptionByDefault: {
              SSEAlgorithm: 'AES256'
            }
          }]
        }
      }
    }

    // defines a Lambda function to process uploads
    let handler = path.join(dirname, '..', '..', 'jobs', 'upload') 
    cloudformation.Resources.PrivateBucketLambda = {
      Type: "AWS::Serverless::Function",
      Properties: {
        Handler: "index.handler",
        CodeUri: handler,
        Runtime: "nodejs16.x",
        Architectures: [
          "x86_64"
        ],
        MemorySize: 1152,
        EphemeralStorage: {
          Size: 512
        },
        Timeout: 300,
        Role: {
          "Fn::Sub": [
            "arn:aws:iam::${AWS::AccountId}:role/${roleName}",
            {
              roleName: {
                Ref: "Role"
              }
            }
          ]
        },
        Environment: {
          Variables: {}
        },
        Policies: [{ 
          S3FullAccessPolicy: {
            BucketName: { Ref: 'PrivateBucket' }
          }
        }],
        Events: {
          PrivateBucketEvent: {
            Type: "S3",
            Properties: {
              Bucket: {Ref: 'PrivateBucket'},
              Events: 's3:ObjectCreated:*'
            }
          }
        }
      }
    }

    // give s3 permission to invoke the Lambda
    cloudformation.Resources.PrivateBucketLambdaPermission = {
      Type: 'AWS::Lambda::Permission',
      Properties: {
        Action: 'lambda:InvokeFunction',
        FunctionName: { Ref: 'PrivateBucketLambda' },
        Principal: 's3.amazonaws.com',
        SourceArn: {'Fn::GetAtt': ['PrivateBucket', 'Arn']},
        SourceAccount: {'Fn::Sub': '${AWS::AccountId}'}
      }
    }

    // ensure all Lambda functions in this stack can access the private bucket
    cloudformation.Resources.PrivateBucketPolicy = {
      Type: 'AWS::IAM::Policy',
      // DependsOn: 'PrivateBucketRole',
      Properties: {
        PolicyName: 'PrivateBucketPolicy',
        PolicyDocument: {
          Statement: [{
            Effect: 'Allow',
            Action: ['s3:*'],
            Resource: [{
              'Fn::Sub': [
                'arn:aws:s3:::${bucket}/*',
                { bucket: { Ref: 'PrivateBucket' } }
              ]
            }]
          }]
        },
        Roles: [ { 'Ref': 'Role' } ],
      }
    }

    // Add name to SSM params for runtime discovery
    /*
    cloudformation.Resources.PrivateBucketParam = {
      Type: 'AWS::SSM::Parameter',
      Properties: {
        Type: 'String',
        Name: {
          'Fn::Sub': [
            '/${AWS::StackName}/private-bucket/${bucket}',
            { bucket }
          ]
        },
        Value: { Ref: 'PrivateBucket' }
      }
    }*/

    // add PRIVATE_BUCKET env var for runtime discovery
    /*
    for (let resource of Object.keys(cloudformation.Resources)) {
      if (cloudformation.Resources[resource].Type === 'AWS::Serverless::Function') {
        cloudformation.Resources[resource].Properties.Environment.Variables.PRIVATE_BUCKET = { Ref: 'PrivateBucket' }
      }
    }*/

    // console.log(JSON.stringify(cloudformation, null, 2))
    return cloudformation
  }
}

import json
import boto3
from botocore.exceptions import ClientError

def lambda_handler(event, context):
    return handle_login(event)

def handle_login(event):
    try:
        body = json.loads(event.get('body', '{}'))
        email = body.get('email')
        password = body.get('password')
        
        dynamodb = boto3.resource('dynamodb')
        table = dynamodb.Table('UserTable')
        
        response = table.get_item(Key={'email': email})
        user = response.get('Item')
        
        if user and password == user['password']:
            return {'statusCode': 200, 'body': json.dumps('Login successful')}
        else:
            return {'statusCode': 403, 'body': json.dumps('Unauthorized')}
    
    except ClientError as e:
        print(f"Error accessing DynamoDB: {e.response['Error']['Message']}")
        return {'statusCode': 500, 'body': json.dumps('Error accessing database')}
    except Exception as e:
        print(f"Unexpected error: {str(e)}")
        return {'statusCode': 500, 'body': json.dumps('Internal server error')}
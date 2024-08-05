import json
import boto3
from botocore.exceptions import ClientError

def lambda_handler(event, context):
    # Determine action based on the path
    path = event.get('path')
    if path.endswith('/test'):
        return handle_test(event)
    elif path.endswith('/signup'):
        return handle_signup(event)
    elif path.endswith('/login'):   
        return handle_login(event)
    else:
        return {'statusCode': 400, 'body': json.dumps('Bad request')}
def handle_test(event):
    try:
        body = json.loads(event.get('body', '{}'))
        email = body.get('email')

        if not email:
            return {'statusCode': 400, 'body': json.dumps('Missing email')}
        dynamodb = boto3.resource('dynamodb')
        table = dynamodb.Table('UserTable')
        
        existing_user = table.get_item(Key={'email': email}).get('Item')
        if existing_user:
            return {'statusCode': 201, 'body': json.dumps('User exists')}
        else:
            return {'statusCode': 409, 'body': json.dumps('User not exists')}
            
    except ClientError as e:
        print(f"Error accessing DynamoDB: {e.response['Error']['Message']}")
        return {'statusCode': 500, 'body': json.dumps('Error accessing database')}
    except Exception as e:
        print(f"Unexpected error: {str(e)}")
        return {'statusCode': 500, 'body': json.dumps('Internal server error')}
def handle_signup(event):
    try:
        body = json.loads(event.get('body', '{}'))
        email = body.get('email')
        password = body.get('password')
        
        if not email or not password:
            return {'statusCode': 400, 'body': json.dumps('Missing email or password')}
        
        dynamodb = boto3.resource('dynamodb')
        table = dynamodb.Table('UserTable')
        
        existing_user = table.get_item(Key={'email': email}).get('Item')
        if existing_user:
            return {'statusCode': 409, 'body': json.dumps('User already exists')}
        
        table.put_item(Item={'email': email, 'password': password})
        return {'statusCode': 201, 'body': json.dumps('User registered successfully')}
    
    except ClientError as e:
        print(f"Error accessing DynamoDB: {e.response['Error']['Message']}")
        return {'statusCode': 500, 'body': json.dumps('Error accessing database')}
    except Exception as e:
        print(f"Unexpected error: {str(e)}")
        return {'statusCode': 500, 'body': json.dumps('Internal server error')}

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
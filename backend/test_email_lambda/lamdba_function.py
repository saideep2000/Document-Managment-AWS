import json
import boto3
from botocore.exceptions import ClientError

def lambda_handler(event, context):
    return handle_test(event)
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
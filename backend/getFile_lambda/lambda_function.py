import json
import boto3
import logging
from botocore.exceptions import ClientError

logger = logging.getLogger()
logger.setLevel(logging.INFO)

def lambda_handler(event, context):
    if event['httpMethod'] == 'OPTIONS':
        return cors_response()

    return handle_get_files(event)

def handle_get_files(event):
    try:
        body = json.loads(event.get('body', '{}'))
        email = body.get('email')
        if not email:
            return error_response('Missing email parameter')

        dynamodb = boto3.resource('dynamodb')
        table = dynamodb.Table('UserFiles')

        response = table.query(
            IndexName='email',
            KeyConditionExpression='email = :email',
            ExpressionAttributeValues={':email': email}
        )

        # Create a list of dictionaries with fileid and filename
        files = [{'fileid': item['fileid'], 'filename': item['filename']} for item in response.get('Items', [])]
        return success_response(files)

    except ClientError as e:
        logger.error(f"Error accessing DynamoDB: {e.response['Error']['Message']}")
        return error_response('Error accessing database')
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        return error_response('Internal server error')


def cors_response():
    return {
        'statusCode': 200,
        'body': json.dumps('CORS configuration'),
        'headers': cors_headers()
    }

def success_response(data):
    return {
        'statusCode': 200,
        'body': json.dumps(data),
        'headers': cors_headers()
    }

def error_response(message):
    return {
        'statusCode': 500,
        'body': json.dumps(message),
        'headers': cors_headers()
    }

def cors_headers():
    return {
        'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
    }

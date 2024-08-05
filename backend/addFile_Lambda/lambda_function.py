import json
import boto3
import uuid
import logging
from botocore.exceptions import ClientError

logger = logging.getLogger()
logger.setLevel(logging.INFO)

s3_client = boto3.client('s3')
dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('UserFiles')

def lambda_handler(event, context):
    if event['httpMethod'] == 'OPTIONS':
        return cors_response()

    return handle_add_file(event)

def handle_add_file(event):
    try:
        body = json.loads(event.get('body', '{}'))
        email = body.get('email')
        filename = body.get('filename')
        
        if not email or not filename:
            return error_response('Missing email or filename parameter')

        file_id = str(uuid.uuid4())
        s3_key = f"{email}/{file_id}-{filename}"

        presigned_url = s3_client.generate_presigned_url('put_object', Params={
            'Bucket': 'docu-manager-bucket',
            'Key': s3_key,
            'ACL': 'private',
            'ContentType': 'application/octet-stream'  # Make sure to specify if known
        }, ExpiresIn=3600)

        table.put_item(Item={
            'fileid': file_id,
            'email': email,
            'filename': filename,
            'filelink': f'https://docu-manager-bucket.s3.amazonaws.com/{s3_key}'
        })

        return success_response({
            'presignedUrl': presigned_url,
            'fileId': file_id,
            'filename' : filename
        })

    except ClientError as e:
        return error_response('Error accessing database or S3', e)


def check_existing_file(email, filename):
    response = table.scan(
        FilterExpression='email = :email and filename = :filename',
        ExpressionAttributeValues={':email': email, ':filename': filename}
    )
    return 'Items' in response and len(response['Items']) > 0

def cors_response():
    return {
        'statusCode': 200,
        'headers': cors_headers(),
        'body': json.dumps('CORS configuration')
    }

def success_response(data):
    return {
        'statusCode': 200,
        'headers': cors_headers(),
        'body': json.dumps(data)
    }

def error_response(message, error=None):
    logger.error(f"Error: {message}, Detail: {error}")
    return {
        'statusCode': 500,
        'headers': cors_headers(),
        'body': json.dumps(message)
    }

def cors_headers():
    return {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'OPTIONS, POST, GET',
        'Access-Control-Allow-Headers': 'Content-Type, X-Amz-Date, Authorization, X-Api-Key, X-Amz-Security-Token'
    }

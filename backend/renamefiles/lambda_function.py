import json
import boto3
import logging
from botocore.exceptions import ClientError

logger = logging.getLogger()
logger.setLevel(logging.INFO)

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('UserFiles')

def lambda_handler(event, context):
    if event['httpMethod'] == 'OPTIONS':
        return cors_response()

    return handle_rename_file(event)

def handle_rename_file(event):
    try:
        body = json.loads(event.get('body', '{}'))
        email = body.get('email')
        fileid = body.get('fileid')
        newfilename = body.get('newfilename')
        
        if not email or not fileid or not newfilename:
            return error_response('Missing parameters')

        # Retrieve the current file metadata
        current_file = table.get_item(
            Key={'fileid': fileid}
        ).get('Item')
        
        if not current_file:
            return error_response('File does not exist')

        # Ensure the file extension remains unchanged if not specified
        current_extension = current_file['filename'].split('.')[-1]
        if '.' not in newfilename:
            newfilename += '.' + current_extension
        
        # Update the file name in DynamoDB
        response = table.update_item(
            Key={
                'fileid': fileid
            },
            UpdateExpression='SET filename = :newfilename',
            ExpressionAttributeValues={
                ':newfilename': newfilename,
                ':email': email
            },
            ConditionExpression='email = :email',
            ReturnValues='UPDATED_NEW'
        )

        return success_response({'message': f'File renamed to {newfilename}'})

    except ClientError as e:
        logger.error(f"Error in DynamoDB operation: {e.response['Error']['Message']}")
        return error_response('Error accessing database', str(e))
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        return error_response('Internal server error', str(e))


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

def error_response(message, detail=None):
    return {
        'statusCode': 500,
        'headers': cors_headers(),
        'body': json.dumps({"message": message, "detail": detail})
    }

def cors_headers():
    return {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'OPTIONS, POST, GET',
        'Access-Control-Allow-Headers': 'Content-Type, X-Amz-Date, Authorization, X-Api-Key, X-Amz-Security-Token'
    }

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
bucket_name = 'docu-manager-bucket'  # Replace with your actual bucket name

def lambda_handler(event, context):
    if event['httpMethod'] == 'OPTIONS':
        return {
            'statusCode': 200,
            'body': json.dumps('CORS configuration'),
            'headers': {
                'Access-Control-Allow-Headers': '*',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
            }
        }
    
    try:
        body = json.loads(event.get('body', '{}'))
        email = body.get('email')
        fileid = body.get('fileid')
        action = body.get('manipulate')
        
        if not email or not fileid or not action:
            return error_response('Missing parameters')

        if action == 'delete':
            return handle_delete(email, fileid)
        elif action == 'download':
            return handle_download(email, fileid)
        elif action == 'duplicate':
            return handle_duplicate(email, fileid)
        else:
            return error_response('Invalid manipulation action')
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        return error_response('Internal server error', str(e))

def handle_delete(email, fileid):
    try:
        # Fetch the item to get the S3 key
        response = table.get_item(Key={'fileid': fileid})
        if 'Item' not in response:
            return {
                'statusCode': 404,
                'body': json.dumps('File not found'),
                'headers': cors_headers()
            }

        # Correctly extracting the S3 key from the full URL
        file_link = response['Item']['filelink']
        file_key = file_link.replace(f"https://{bucket_name}.s3.amazonaws.com/", "")  # Strip the domain part to get the exact key

        print(f"Attempting to delete S3 object with key: {file_key}")

        # Delete the object from S3
        s3_client.delete_object(Bucket=bucket_name, Key=file_key)

        # Delete the DynamoDB record
        table.delete_item(Key={'fileid': fileid})

        return success_response('File deleted successfully')
    except ClientError as e:
        logger.error(f"Error deleting file: {e}")
        return error_response('Error deleting file', str(e))



def handle_download(email, fileid):
    headers = cors_headers()
    
    try:
        # Fetch metadata from DynamoDB
        response = table.get_item(Key={'fileid': fileid})
        if 'Item' not in response:
            return {
                'statusCode': 404,
                'body': json.dumps('File not found'),
                'headers': headers
            }

        # Use the full link as stored in DynamoDB
        file_link = response['Item']['filelink']
        file_key = file_link.replace(f"https://{bucket_name}.s3.amazonaws.com/", "")  # Strip the domain part
        
        # Generate a presigned URL for direct download from S3
        presigned_url = s3_client.generate_presigned_url('get_object', Params={
            'Bucket': bucket_name,
            'Key': file_key,
        }, ExpiresIn=3600)  # URL expires in 1 hour
        
        return {
            'statusCode': 200,
            'body': json.dumps({'presignedUrl': presigned_url}),
            'headers': headers
        }
    except ClientError as e:
        logger.error(f"Error generating download link: {e}")
        return {
            'statusCode': 500,
            'body': json.dumps('Error generating download link'),
            'headers': headers
        }




def handle_duplicate(email, fileid):
    headers = cors_headers()  # Ensure headers are prepared for CORS

    try:
        # Retrieve the item from DynamoDB
        response = table.get_item(Key={'fileid': fileid})
        if 'Item' not in response:
            return {
                'statusCode': 404,
                'body': json.dumps('File not found'),
                'headers': headers
            }

        # Extract necessary details from the item
        original_item = response['Item']
        original_filename = original_item['filename']
        parts = original_filename.rsplit('.', 1)  # Split filename from extension
        new_filename = f"{parts[0]} copy.{parts[1]}" if len(parts) == 2 else f"{original_filename} copy"

        # Properly extracting the S3 key from the full URL
        original_file_link = original_item['filelink']
        original_file_key = original_file_link.replace(f"https://{bucket_name}.s3.amazonaws.com/", "")

        # Generate new file ID and filename
        new_fileid = str(uuid.uuid4())
        new_s3_key = f"{email}/{new_fileid}-{new_filename}"

        # Copy the file in S3
        s3_client.copy_object(
            Bucket=bucket_name,
            CopySource={'Bucket': bucket_name, 'Key': original_file_key},
            Key=new_s3_key,
            ACL='private'
        )

        # Put the new item into DynamoDB
        table.put_item(Item={
            'fileid': new_fileid,
            'email': email,
            'filename': new_filename,
            'filelink': f"https://{bucket_name}.s3.amazonaws.com/{new_s3_key}"
        })

        return {
            'statusCode': 200,
            'body': json.dumps({'message': f'File duplicated successfully as {new_filename}', 'newFileId': new_fileid}),
            'headers': headers
        }

    except ClientError as e:
        logger.error(f"Error duplicating file: {e}")
        return {
            'statusCode': 500,
            'body': json.dumps('Error duplicating file'),
            'headers': headers
        }


def cors_headers():
    return {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'OPTIONS, POST, GET',
        'Access-Control-Allow-Headers': '*'
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
        'Access-Control-Allow-Headers': '*'
    }

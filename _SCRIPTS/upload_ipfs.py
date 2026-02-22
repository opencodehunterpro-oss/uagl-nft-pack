import requests

# Define the Pinata API endpoint and your API key and secret
pinata_api_url = "https://api.pinata.cloud/pinning/pinFileToIPFS"
pinata_api_key = "YOUR_PINATA_API_KEY"
pinata_api_secret = "YOUR_PINATA_SECRET"

# Function to upload a file to IPFS

def upload_to_ipfs(file_path):
    with open(file_path, 'rb') as file:
        response = requests.post(
            pinata_api_url,
            files={"file": file},
            headers={
                "pinata_api_key": pinata_api_key,
                "pinata_secret_api_key": pinata_api_secret
            }
        )
    return response.json()

# Example usage
if __name__ == '__main__':
    file_path = 'path_to_your_file'
    response = upload_to_ipfs(file_path)
    print(response)
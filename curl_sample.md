### Official Document

https://docs.novelai.net/image/basics.html

### Swagger UI

https://api.novelai.net/docs/#/

### INFO

`curl -H "Content-Type:application/json" -H "Authorization: Bearer ${NAI_API_TOKEN}" https://api.novelai.net/user/information`

### Generate Image

`curl -X POST -H "Content-Type:application/json" -H "Authorization: Bearer ${NAI_API_TOKEN}" -d '{"input":"6girl, lineup, smile","model":"nai-diffusion-3","action":"generate","parameters":{}}' -o test_gem_image.zip https://api.novelai.net/ai/generate-image`

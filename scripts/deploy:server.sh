echo What should the version be ? 
read VERSION 
cd ../src/tm-server
echo "Deploying to production 🚀 🔥"

docker build -t lhowsam/tmtodos-api:$VERSION . 
docker push lhowsam/tmtodos-api:$VERSION
ssh root@VPS_ADDR "docker pull lhowsam/tmtodos-api:$VERSION && docker tag lhowsam/tmtodos-api:$VERSION dokku/tmtodos-api:$VERSION && dokku deploy tmtodos-api $VERSION"
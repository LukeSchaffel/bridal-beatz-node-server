to get started run yarn install

create a .env file and fill it with \
PORT=8000 \
ACCESS_TOKEN_SECRET=yoursecrethere \
DATABASE_URL=pathtopostgresdb\
DEV_OR_PROD='DEV'

IMAGEKIT_PUBLIC_API_KEY=\
IMAGEKIT_PRIVATE_API_KEY=\
IMAGEKIT_URL_ID=

npm run dev to run on port 8000\

Image uploads use the Image Kit SDK. To use locally you will need to create an account and fill in env variables accordinly.
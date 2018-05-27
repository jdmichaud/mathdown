FROM ubuntu:xenial

RUN apt update
RUN apt install -y curl xz-utils less
# Install node/npm
RUN cd /root && \
  curl -sOL https://nodejs.org/dist/v10.2.1/node-v10.2.1-linux-x64.tar.xz && \
  tar xf node-v10.2.1-linux-x64.tar.xz && \
  (export PATH=$PATH:/root/node-v10.2.1-linux-x64/bin; npm install -g n) && \
  (export PATH=$PATH:/root/node-v10.2.1-linux-x64/bin; n 8.9.4) && \
  npm update -g npm && \
  rm -fr node-v10.2.1-linux-x64 node-v10.2.1-linux-x64.tar.xz
# Copy the project in the container
COPY . /root/mathdown/
# build the project
RUN cd /root/mathdown && npm install

EXPOSE 80/tcp

# Start the express server when container is started
CMD node /root/mathdown/index.js

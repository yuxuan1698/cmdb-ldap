FROM alpine
MAINTAINER dbh888<duanbaihong@qq.com>
ENV CMDB_VERSION=0.0.1 \
    TERM=xterm \
    installDeps='dumb-init python3 libldap tiff-dev openjpeg-dev zlib-dev freetype-dev jpeg-dev'

ADD . /opt/cmdb/

RUN sed -i 's/dl-cdn.alpinelinux.org/mirrors.aliyun.com/g' /etc/apk/repositories \
    && apk add $installDeps gcc g++ make python3-dev libffi-dev openldap-dev  \
    libxml2-dev libxslt-dev libffi-dev  openssl-dev freetype-dev  \
    && pip3 install --upgrade pip \
    && pip3 install -r /opt/cmdb/requirements.txt \
    && pip3 install gunicorn celery\
    && apk del gcc g++ make python3-dev libffi-dev openldap-dev \
    libxml2-dev libxslt-dev libffi-dev  openssl-dev jpeg-dev  \
    && rm ~/.cache -rf


EXPOSE 8000
WORKDIR /opt/cmdb
ENTRYPOINT ["/opt/cmdb/entrypoint.sh"]
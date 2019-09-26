#!/usr/bin/dumb-init /bin/sh
ulimit -n 65535
if [ ! -s /opt/cmdb/config.yaml ]; then
    cat /opt/cmdb/config.yaml.example > /opt/cmdb/config.yaml
fi
exec /opt/cmdb/runcmdb start
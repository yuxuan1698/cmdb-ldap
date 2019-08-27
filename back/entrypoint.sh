#!/usr/bin/dumb-init /bin/sh
ulimit -n 65535
exec /opt/cmdb/runcmdb start
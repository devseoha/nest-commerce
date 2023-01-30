FROM mysql:5.7

ADD ./mysql-init-files /docker-entrypoint-initdb.d
ADD ./config/my.cnf /etc/mysql/conf.d/

EXPOSE 3306

CMD ["mysqld"]

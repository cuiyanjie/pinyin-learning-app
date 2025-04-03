# 哪吒拼音项目部署指南

## 部署前提
1. 已安装Docker和Docker Compose
2. 项目文件已上传至服务器`/root/data/pinyin`目录

## 部署步骤

### 1. 创建docker-compose.yml文件
将以下内容保存为`/root/data/pinyin/docker-compose.yml`:

```yaml
version: '3.8'

services:
  pinyin-web:
    image: nginx:alpine  
    container_name: pinyin-web
    restart: always
    ports:
      - "1471:80"
    volumes:
      - /root/data/pinyin:/usr/share/nginx/html
    networks:
      - pinyin-net

networks:
  pinyin-net:
    driver: bridge
```

### 2. 启动容器
```bash
cd /root/data/pinyin
docker-compose up -d
```

### 3. 验证部署
```bash
# 检查容器状态
docker ps

# 测试访问
curl http://localhost:1471
```

### 4. 管理命令
```bash
# 停止服务
docker-compose down

# 重启服务  
docker-compose restart

# 查看日志
docker-compose logs
```

## 注意事项
1. 确保1471端口未被占用
2. 如需修改端口，请同步修改docker-compose.yml中的ports配置
3. 项目将随Docker服务自动启动
4. 文件更新后需要重启容器生效

## 访问方式
通过浏览器访问：`http://服务器IP:1471`

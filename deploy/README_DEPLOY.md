Deploy instructions for proyecto_colegio (Ubuntu VPS)

1) Copy the repo to your VPS and place the files in a directory, e.g. /home/usuario/proyecto_colegio

2) Create a .env file in the project root with at least:

PORT=3000
HOST=0.0.0.0
JWT_SECRET=un_secreto_largo

(If you want MySQL, add DB_DIALECT, DB_HOST, DB_NAME, DB_USER, DB_PASSWORD)

3) Make the deploy script executable and run it (or run steps manually):

chmod +x deploy/deploy.sh
./deploy/deploy.sh <git-repo-url>

4) Configure nginx using the file deploy/nginx_proyecto_colegio.conf

sudo cp deploy/nginx_proyecto_colegio.conf /etc/nginx/sites-available/proyecto_colegio
sudo ln -s /etc/nginx/sites-available/proyecto_colegio /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

5) (Optional) Obtain SSL with certbot if you have a domain:

sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d your_domain.com

6) Useful pm2 commands:

pm2 logs proyecto-colegio --lines 200
pm2 status
pm2 restart proyecto-colegio

7) If the UI still reports credential errors, check logs and user existence:

node scripts/findUser.js <identifier>
pm2 logs proyecto-colegio --lines 200

If you need me to generate a systemd unit file instead of pm2 or to add a sample nginx server block with SSL directives, tell me and I will add it.

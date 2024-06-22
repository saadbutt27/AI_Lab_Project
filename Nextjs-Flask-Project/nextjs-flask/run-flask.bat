@echo off
set FLASK_DEBUG=1
pip3 install -r requirements.txt
python3 -m flask --app api/index run -p 5328

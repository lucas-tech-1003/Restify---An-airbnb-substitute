# Run migrations and start server
python3 backend/manage.py makemigrations
python3 backend/manage.py migrate
python3 backend/manage.py runserver &

# Start React
npm start
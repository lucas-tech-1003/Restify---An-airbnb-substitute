# Run migrations and start server
cd backend
python manage.py makemigrations
python manage.py migrate
python manage.py runserver &
# Loaddata if data.json exists
data_file="data.json"
if [ -f "$data_file" ]; then
    python manage.py loaddata "$data_file"
    echo "Data loaded successfully."
else
    echo "Data file does not exist. Skipping..."
fi

# # Define the source and destination folders
# property_photos_source_folder="backend/property_photos"
# avatar_folder="backend/avatars"
# destination_folder="."

# # Check if the property_photos_source_folder folder exists
# if [ -d "$property_photos_source_folder" ]; then
#     # Copy the folder to the destination
#     cp -r "$property_photos_source_folder" "$destination_folder"
#     echo "Property Photos Folder copied successfully."
# else
#     echo "Source folder does not exist."
# fi
# # Check if the avatar_folder  folder exists
# if [ -d "$avatar_folder" ]; then
#     # Copy the folder to the destination
#     cp -r "$avatar_folder" "$destination_folder"
#     echo "Avatar Photos Folder copied successfully."
# else
#     echo "Source folder does not exist."
# fi


# Start React
cd ../frontend
npm start
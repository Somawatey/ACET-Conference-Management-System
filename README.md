# Step 01
composer install

# Step 02
npm install

# Step 03 / Add new table or column
php artisan migrate

# Step 04 / Run Seeder
php artisan db:seed --class=PermissionSeeder
php artisan db:seed --class=UserSeeder

php artisan jwt:secret

# Step 05 / Create the missing folder
mkdir -p storage/framework/views

# Running project
php artisan serve
npm run dev

# If we got error "No application encryption key has been specified."
php artisan key:generate


# Delele Data All Table
php artisan migrate:refresh

# Delete Data One Table
php artisan migrate:refresh --path=""

# clear cache, route, config
php artisan cache:clear
php artisan config:clear
php artisan view:clear
php artisan route:clear
php artisan route:cache
php artisan config:cache

# Run the queue worker:
php artisan queue:work


php artisan make:model YourModelName -mcr

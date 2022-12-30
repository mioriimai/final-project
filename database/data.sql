
-- DANGER: this is NOT how to do it in the real world.
-- You should NEVER EVER check user data into Git!

insert into "users" ("username", "email", "hashedPassword")
values ('anonymous', 'abc@gmail.com', '$argon2i$v=19$m=4096,t=3,p=1$h7icQD/xZr8akZsX+hNA0A$h68atJWyjvunAwNOpSpMfg9sPvoMQ6dKwoh0dJhurWA');

insert into "items" ("originalImageUrl", "bgRemovedImageUrl", "category", "brand", "color", "isFavorite", "userId")
values ('/images/IMG_5668.JPG', '/images/IMG_5668-removebg-preview.png', 'None', 'None', 'None', false, '1');

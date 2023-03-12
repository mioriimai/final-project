-- DANGER: this is NOT how to do it in the real world.
-- You should NEVER EVER check user data into Git!

insert into "users" ("username", "name", "hashedPassword")
values ('anonymous', 'test', '$argon2i$v=19$m=4096,t=3,p=1$h7icQD/xZr8akZsX+hNA0A$h68atJWyjvunAwNOpSpMfg9sPvoMQ6dKwoh0dJhurWA');

insert into "items" ("image", "category", "brand", "color", "favorite", "userId")
values ('/images/IMG_5668-removebg-preview.png', 'None', 'None', 'None', false, '1'),
       ('/images/originalImage-1673270326930.png', 'Jeans', 'Gap', 'Blue', false, '1'),
       ('/images/originalImage-1673270539017.png', 'Accessories', 'None', 'Blue', false, '1'),
       ('/images/originalImage-1673270603689.png', 'Bags', 'Zara', 'Navy', false, '1')

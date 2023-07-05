'''import mysql.connector
import requests
import json

connection = mysql.connector.connect(user = 'root', password = 'zxc!!@123Q',
                                    host = 'localhost', database = 'amazon',
                                    auth_plugin = 'mysql_native_password')

#
response = requests.get("https://fakestoreapi.com/products")
response = response.json()



cursor = connection.cursor()

for i in response:
    print(i["image"])

    insert_query = 'INSERT INTO frontend_product(title, category, url, description, price) VALUES (%(title)s, %(category)s, %(url)s, %(description)s, %(price)s)'


    insert_data = {
        'title': i['title'],
        'category': i['category'],
        'url': i['image'],
        'description': i['description'],
        'price': i['price']
    }

    cursor.execute(insert_query, insert_data)

connection.commit()





#query = 'SELECT id, name, department_id FROM employees ORDER BY employees.id'
#cursor.execute(query)
#(title, category, desc, price, image, rating)

connection.close()'''
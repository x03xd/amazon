import mysql.connector
import requests
import json

connection = mysql.connector.connect(user = 'root', password = 'zxc!!@123Q',
                                     host = 'localhost', database = 'sql_kurs',
                                     auth_plugin = 'mysql_native_password')


response = requests.get("https://fakestoreapi.com/products")

if response.status == 200:
    response = response.json()


cursor = connection.cursor()

insert_query = 'INSERT INTO employees(name, department_id) VALUES(%(name)s, %(department_id)s)'
insert_data = {
    'name' : 'Alojzy',
    'department_id' : 1,
    }

cursor.execute(insert_query, insert_data)
connection.commit()





query = 'SELECT id, name, department_id FROM employees ORDER BY employees.id'
cursor.execute(query)

for (id, name, department_id) in cursor:
        print(f"{id} {name} {department_id}")


connection.close()
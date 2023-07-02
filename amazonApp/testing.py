numbers = '1-20, 50.01-100, 150.01-99999'

print(numbers.split(","))

first_list = []
second_list = []







lista = [1, 2, 3, 4, 5, 6]

class Person:
    def __init__(self, name, age):
        self._name = name
        self._age = age

    # Define a "name" getter
    @property
    def name(self):
        return self._name

    # Define a "name" setter
    @name.setter
    def name(self, value):
        self._name = value


# Create a new Person object
person = Person("Alice", 30)

# Access and set the "name" attribute using the getter and setter
print(person.name)  # "Alice"
person.name = "Bob"
print(person.name)  # "Bob"


lista1 = [1, 2, 3, 4, 5]
lista2 = [6, 7, 8, 9, 10]



for index in range(0, 5):
    lista1[index] = lista2[index]


lista1[0] = 999
print(lista1)
print(lista2)
from django.test import TestCase

# Create your tests here.
u = 'null'

multiple_prices_filter = u.split(",")

first_list = []
second_list = []

for index, s in enumerate(multiple_prices_filter):
    first, second = s.split('-')
    first_list.append(float(first))
    second_list.append(float(second))



print(first_list)
print(second_list)
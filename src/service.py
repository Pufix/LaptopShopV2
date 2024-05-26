#create a rest api without a database
from copy import deepcopy
import random
import sys
from flask import Flask, request, jsonify
from flask_cors import CORS
import pytest
import coverage
import os
from faker import Faker
import pymongo

fake = Faker()
myclient = pymongo.MongoClient("mongodb://localhost:27017/")
mydb = myclient["Electronics"]

class Laptop:
    def __init__(self, id, name, cpu, gpu, ram, storage, price, manufacturer_id):
        self.id = id
        self.name = name
        self.cpu = cpu
        self.gpu = gpu
        self.ram = ram
        self.storage = storage
        self.price = price
        self.manufacturer_id = manufacturer_id


class Manufacturer:
    def __init__(self, id, name):
        self.id = id
        self.name = name

def validate_laptop(laptop):
    if laptop.id < 0 or laptop.price < 0:
        return False
    if laptop.name == '' or laptop.cpu == '' or laptop.gpu == '' or laptop.ram == '' or laptop.storage == '':
        return False
    return True

def getLaptopsFromDatabase():
    mycol = mydb["Laptops"]
    laptops = []
    for x in mycol.find():
        laptops.append(Laptop(x['id'], x['name'], x['cpu'], x['gpu'], x['ram'], x['storage'], x['price'], x['manufacturer_id']))
    return laptops

def getManufacturersFromDatabase():
    mycol = mydb["Manufacturers"]
    manufacturers = []
    for x in mycol.find():
        manufacturers.append(Manufacturer(x['id'], x['name']))
    return manufacturers

laptops = getLaptopsFromDatabase()
manufacturers = getManufacturersFromDatabase()
app = Flask(__name__)

@app.route("/createFakes", methods=['POST'])
def create_fakes():
    mycol = mydb["Laptops"]
    for i in range(10):
        laptops.append(Laptop(len(laptops)+1, fake.company(), fake.name(), fake.name(), fake.name(), fake.name(), random.randint(100, 2000), random.randint(1, len(manufacturers))))
        mycol.insert_one(deepcopy(laptops[-1]).__dict__)
    return 'Fakes created', 200


@app.route("/laptops", methods=['GET'])
def get_laptops():
    return jsonify([laptop.__dict__ for laptop in laptops]),200

@app.route("/manufacturers", methods=['GET'])
def get_manufacturers():
    return jsonify([manufacturer.__dict__ for manufacturer in manufacturers]),200

@app.route("/laptops/<int:id>", methods=['GET'])
def get_laptop(id):
    laptop = next((laptop for laptop in laptops if laptop.id == id), None)
    if laptop:
        return jsonify(laptop.__dict__), 200
    return 'Laptop not found', 404

@app.route("/manufacturers/<int:id>", methods=['GET'])
def get_manufacturer(id):
    manufacturer = next((manufacturer for manufacturer in manufacturers if manufacturer.id == id), None)
    if manufacturer:
        return jsonify(manufacturer.__dict__), 200
    return 'Manufacturer not found', 404

@app.route("/test")
def test():
    return 'Test', 200

@app.route("/laptops", methods=['POST'])
def add_laptop():
    try:
        data = request.get_json()
        new_laptop = Laptop(int(data['id']), data['name'], data['cpu'], data['gpu'], data['ram'], data['storage'], int(data['price']), int(data['manufacturer_id']))
        if not validate_laptop(new_laptop):
            return 'Invalid data', 400
        if new_laptop.id in [laptop.id for laptop in laptops]:
            return 'Laptop already exists', 400
        laptops.append(new_laptop)
        mycol = mydb["Laptops"]
        mycol.insert_one(deepcopy(new_laptop).__dict__)
        return 'ok', 201
     
    except Exception as e:
        print
        return e, 400
    
@app.route("/manufacturers", methods=['POST'])
def add_manufacturer():
    try:
        data = request.get_json()
        idd = int(data['id'])
        namee = data['name']
        new_manufacturer = Manufacturer(idd, namee)
        if new_manufacturer.id in [manufacturer.id for manufacturer in manufacturers]:
            return 'Manufacturer already exists', 400
        manufacturers.append(new_manufacturer)
        mycol = mydb["Manufacturers"]
        mycol.insert_one(deepcopy(new_manufacturer).__dict__)
        return 'ok', 201
    except:
        return 'Invalid data', 400

@app.route("/laptops", methods=['PUT'])
def update_laptop():
    try:
        data = request.get_json()
        new_laptop = Laptop(int(data['id']), data['name'], data['cpu'], data['gpu'], data['ram'], data['storage'], int(data['price']), int(data['manufacturer_id']))
        if not validate_laptop(new_laptop):
            return 'Invalid data', 400
        for laptop in laptops:
            if laptop.id == new_laptop.id:
                laptop.id = new_laptop.id
                laptop.name = new_laptop.name
                laptop.cpu = new_laptop.cpu
                laptop.gpu = new_laptop.gpu
                laptop.ram = new_laptop.ram
                laptop.storage = new_laptop.storage
                laptop.price = new_laptop.price
                laptop.manufacturer_id = new_laptop.manufacturer_id
                mycol = mydb["Laptops"]
                mycol.update_one({'id': laptop.id}, {"$set": laptop.__dict__})
                return jsonify(laptop.__dict__), 200
        return 'Laptop not found', 404
    except:
        return 'Invalid data', 400
    
@app.route("/manufacturers", methods=['PUT'])
def update_manufacturer():
    try:
        data = request.get_json()
        new_manufacturer = Manufacturer(int(data['id']), data['name'])
        for manufacturer in manufacturers:
            if manufacturer.id == new_manufacturer.id:
                manufacturer.id = new_manufacturer.id
                manufacturer.name = new_manufacturer.name
                mycol = mydb["Manufacturers"]
                mycol.update_one({'id': manufacturer.id}, {"$set": manufacturer.__dict__})
                return jsonify(manufacturer.__dict__), 200
        return 'Manufacturer not found', 404
    except:
        return 'Invalid data', 400

@app.route("/laptops/<int:id>", methods=['DELETE'])
def delete_laptop(id):
    for laptop in laptops:
        if laptop.id == id:
            laptops.remove(laptop)
            mycol = mydb["Laptops"]
            mycol.delete_one({'id': id})
            return 'Laptop deleted', 200
    return 'Laptop not found', 404

@app.route("/manufacturers/<int:id>", methods=['DELETE'])
def delete_manufacturer(id):
    for manufacturer in manufacturers:
        if manufacturer.id == id:
            manufacturers.remove(manufacturer)
            mycol = mydb["Manufacturers"]
            mycol.delete_one({'id': id})
            return 'Manufacturer deleted', 200
    return 'Manufacturer not found', 404

#push the local data to the mongodb database
@app.route("/push", methods=['POST'])
def push():
    mycol = mydb["Laptops"]
    mycol.delete_many({})
    for laptop in laptops:
        mycol.insert_one(laptop.__dict__)
    mycol = mydb["Manufacturers"]
    mycol.delete_many({})
    for manufacturer in manufacturers:
        mycol.insert_one(manufacturer.__dict__)
    return 'Data pushed to database', 200
    




















def test_get_laptops():
    response = app.test_client().get('/laptops')
    try:
        assert response.status_code == 200
    except:
        print('test_get_laptops failed')
        print(response.status_code)
        
        sys.exit(1)

def test_get_laptop():
    response = app.test_client().get('/laptops/1')
    try:
        assert response.status_code == 200
    except:
        print('test_get_laptop failed')
        print(response.status_code)
        
        sys.exit(1)

def test_get_laptop_not_found():
    response = app.test_client().get('/laptops/10000')
    try:
        assert response.status_code == 404
    except:
        print('test_get_laptop_not_found failed')
        print(response.status_code)
        
        sys.exit(1)

def test_add_laptop():
    response = app.test_client().post('/laptops', json={'id': len(laptops)+1, 'name': 'Acer Aspire 5', 'cpu': 'AMD Ryzen 5 4500U', 'gpu': 'AMD Radeon RX Vega 6', 'ram': '8GB DDR4', 'storage': '256GB SSD', 'price': 599, 'manufacturer_id': 1})
    try:
        assert response.status_code == 201
    except:
        print('test_add_laptop failed')
        print(response.status_code)
        
        sys.exit(1)

def test_add_laptop_invalid_data():
    response = app.test_client().post('/laptops', json={'id': 7, 'name': 'Acer Aspire 5', 'cpu': 'AMD Ryzen 5 4500U', 'gpu': 'AMD Radeon RX Vega 6', 'ram': '8GB DDR4', 'storage': '256GB SSD', 'price': -599, 'manufacturer_id': 1})
    try:
        assert response.status_code == 400
    except:
        print('test_add_laptop_invalid_data failed')
        print(response.status_code)
        
        sys.exit(1)

def test_add_laptop_invalid_data2():
    response = app.test_client().post('/laptops', json={'id': 8, 'name': '', 'cpu': 'AMD Ryzen 5 4500U', 'gpu': 'AMD Radeon RX Vega 6', 'ram': '8GB DDR4', 'storage': '256GB SSD', 'price': 599, 'manufacturer_id': 1})
    try:
        assert response.status_code == 400
    except:
        print('test_add_laptop_invalid_data2 failed')
        print(response.status_code)
        
        sys.exit(1)


def test_add_laptop_already_exists():
    response = app.test_client().post('/laptops', json={'id': 1, 'name': 'Dell XPS 15', 'cpu': 'Intel Core i7-10750H', 'gpu': 'NVIDIA GeForce GTX 1650 Ti', 'ram': '16GB DDR4', 'storage': '512GB SSD', 'price': 1599, 'manufacturer_id': 1})
    try:
        assert response.status_code == 400
    except:
        print('test_add_laptop_already_exists failed')
        print(response.status_code)
        
        sys.exit(1)

def test_update_laptop():
    response = app.test_client().put('/laptops', json={'id': 1, 'name': 'Dell XPS 15', 'cpu': 'Intel Core i7-10750H', 'gpu': 'NVIDIA GeForce GTX 1650 Ti', 'ram': '16GB DDR4', 'storage': '512GB SSD', 'price': 1599, 'manufacturer_id': 1})
    try:
        assert response.status_code == 200
    except:
        print('test_update_laptop failed')
        print(response.status_code)
        
        sys.exit(1)

def test_update_laptop_not_found():
    response = app.test_client().put('/laptops', json={'id': 99999, 'name': 'Dell XPS 15', 'cpu': 'Intel Core i7-10750H', 'gpu': 'NVIDIA GeForce GTX 1650 Ti', 'ram': '16GB DDR4', 'storage': '512GB SSD', 'price': 1599, 'manufacturer_id': 1})
    try:
        assert response.status_code == 404
    except:
        print('test_update_laptop_not_found failed')
        print(response.status_code)
        
        sys.exit(1)

def test_update_laptop_invalid_data():
    response = app.test_client().put('/laptops', json={'id': 1, 'name': 'Dell XPS 15', 'cpu': 'Intel Core i7-10750H', 'gpu': 'NVIDIA GeForce GTX 1650 Ti', 'ram': '16GB DDR4', 'storage': '512GB SSD', 'price': -1599, 'manufacturer_id': 1})
    try:
        assert response.status_code == 400
    except:
        print('test_update_laptop_invalid_data failed')
        print(response.status_code)
        
        sys.exit(1)

def test_update_laptop_invalid_data2():
    response = app.test_client().put('/laptops', json={'id': 1, 'name': '', 'cpu': 'Intel Core i7-10750H', 'gpu': 'NVIDIA GeForce GTX 1650 Ti', 'ram': '16GB DDR4', 'storage': '512GB SSD', 'price': 'eftin vere', 'manufacturer_id': 1})
    try:
        assert response.status_code == 400
    except:
        print('test_update_laptop_invalid_data2 failed')
        print(response.status_code)
        
        sys.exit(1)

def test_delete_laptop():
    response = app.test_client().delete('/laptops/'+str(len(laptops)))
    try:
        assert response.status_code == 200
    except:
        print('test_delete_laptop failed')
        print(response.status_code)
        
        sys.exit(1)

def test_delete_laptop_not_found():
    response = app.test_client().delete('/laptops/10000')
    try:
        assert response.status_code == 404
    except:
        print('test_delete_laptop_not_found failed')
        print(response.status_code)
        
        sys.exit(1)


#database tests
def test_get_manufacturers():
    response = app.test_client().get('/manufacturers')
    try:
        assert response.status_code == 200
    except:
        print('test_get_manufacturers failed')
        print(response.status_code)
        
        sys.exit(1)

def test_get_manufacturer():
    response = app.test_client().get('/manufacturers/1')
    try:
        assert response.status_code == 200
    except:
        print('test_get_manufacturer failed')
        print(response.status_code)
        
        sys.exit(1)

def test_get_manufacturer_not_found():
    response = app.test_client().get('/manufacturers/10000')
    try:
        assert response.status_code == 404
    except:
        print('test_get_manufacturer_not_found failed')
        print(response.status_code)
        
        sys.exit(1)

def test_add_manufacturer():
    response = app.test_client().post('/manufacturers', json={'id': len(manufacturers)+1, 'name': 'Acer'})
    try:
        assert response.status_code == 201
    except:
        print('test_add_manufacturer failed')
        print(response.status_code)
        
        sys.exit(1)

def test_add_manufacturer_invalid_data():
    response = app.test_client().post('/manufacturers', json={'id': 1, 'name': ''})
    try:
        assert response.status_code == 400
    except:
        print('test_add_manufacturer_invalid_data failed')
        print(response.status_code)
        
        sys.exit(1)

def test_update_manufacturer():
    response = app.test_client().put('/manufacturers', json={'id': 1, 'name': 'Dell'})
    try:
        assert response.status_code == 200
    except:
        print('test_update_manufacturer failed')
        print(response.status_code)
        
        sys.exit(1)

def test_update_manufacturer_not_found():
    response = app.test_client().put('/manufacturers', json={'id': 99999, 'name': 'Dell'})
    try:
        assert response.status_code == 404
    except:
        print('test_update_manufacturer_not_found failed')
        print(response.status_code)
        
        sys.exit(1)

def test_update_manufacturer_invalid_data():
    response = app.test_client().put('/manufacturers', json={'id': 1, 'name': ''})
    try:
        assert response.status_code == 400
    except:
        print('test_update_manufacturer_invalid_data failed')
        print(response.status_code)
        
        sys.exit(1)

def test_delete_manufacturer():
    response = app.test_client().delete('/manufacturers/'+str(len(manufacturers)))
    try:
        assert response.status_code == 200
    except:
        print('test_delete_manufacturer failed')
        print(response.status_code)
        
        sys.exit(1)

def test_delete_manufacturer_not_found():
    response = app.test_client().delete('/manufacturers/10000')
    try:
        assert response.status_code == 404
    except:
        print('test_delete_manufacturer_not_found failed')
        print(response.status_code)
        
        sys.exit(1)

def run_tests():
    test_get_laptops()
    test_get_laptop()
    test_get_laptop_not_found()
    test_add_laptop()
    test_add_laptop_invalid_data()
    test_add_laptop_invalid_data2()
    test_add_laptop_already_exists()
    test_update_laptop()
    test_update_laptop_not_found()
    test_update_laptop_invalid_data()
    test_update_laptop_invalid_data2()
    test_delete_laptop()
    test_delete_laptop_not_found()
    test_get_manufacturers()
    test_get_manufacturer()
    test_get_manufacturer_not_found()
    test_add_manufacturer()
    test_add_manufacturer_invalid_data()
    test_update_manufacturer()


CORS(app)

if __name__ == '__main__':
    #run_tests()
    app.run(debug=True)
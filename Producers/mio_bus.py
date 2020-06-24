import sys
from pykafka import KafkaClient
import json
from datetime import datetime
import uuid
import time

#READ COORDINATES FROM GEOJSON
input_file = open(sys.argv[1])
json_array = json.load(input_file)
coordinates = json_array['features'][0]['geometry']['coordinates']
#print(len(coordinates[0]))

#GENERATE UUID
def generate_uuid():
    return uuid.uuid4()

#KAFKA PRODUCER
client = KafkaClient(hosts="localhost:9092")
topic = client.topics['geodata_mio']
producer = topic.get_sync_producer()

#CONSTRUCT MESSAGE AND SEND IT TO KAFKA
data = {}
data['ruta'] = sys.argv[2]

def generate_checkpoint(coordinates):
    i = 0
    while i < len(coordinates):
        data['key'] = data['ruta'] + '_' + str(generate_uuid())
        data['timestamp'] = str(datetime.utcnow())
        data['latitude'] = coordinates[i][1]
        data['longitude'] = coordinates[i][0]
        message = json.dumps(data)
        print(message)
        producer.produce(message.encode('ascii'))
        time.sleep(1)

        #if bus reaches last coordinate, start from beginning
        if i == len(coordinates)-1:
            i = 0
        else:
            i += 1

generate_checkpoint(coordinates[0])

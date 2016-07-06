import sys
import csv
import json
import requests

def lookup(jurisdiction, number):
    url = 'http://api.opencorporates.com/companies/' + jurisdiction + '/' + number
    response = requests.get(url)
    if response.status_code == 200:
        data = json.loads(response.content)
        company = data['results']['company']
        return {
            'name': company['name'],
            'type': company['company_type'],
            'incorporated': company['incorporation_date'],
            'address': company['registered_address_in_full']
        }
    else:
        print('Error: ' + response.status_code)

def from_file(filename):
    results = []
    with open(filename, 'rb') as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            result = lookup(row['jurisdiction'], row['number'])
            results.append(result)
    return results

def to_file(results):
    with open('company-details.csv', 'wb') as csvfile:
        header = results[0].keys()
        writer = csv.DictWriter(csvfile, header)
        writer.writeheader()
        writer.writerows(results)

# print(lookup(sys.argv[1], sys.argv[2]))
# print(from_file(sys.argv[1]))
to_file(from_file(sys.argv[1]))

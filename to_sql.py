import csv

def infer_sql_data_types(csv_file):
    with open(csv_file, 'r', newline='', encoding='utf-8-sig') as file:
        reader = csv.reader(file)
        headers = next(reader)  # Get headers (column names)
        
        # Initialize a dictionary to store the maximum lengths and example values for each column
        max_lengths = {header: 0 for header in headers}
        example_values = {header: [] for header in headers}

        # Read through each row to analyze the data
        for row in reader:
            for i, value in enumerate(row):
                # Update maximum length if the current value is longer
                max_lengths[headers[i]] = max(max_lengths[headers[i]], len(value))
                # Collect example values (for more sophisticated analysis)
                example_values[headers[i]].append(value)

        # Determine SQL data types based on maximum lengths and example values
        sql_data_types = {}
        for header in headers:
            max_length = max_lengths[header]
            example_value = next((v for v in example_values[header] if v), '')  # First non-empty example value
            if example_value.isdigit():
                if len(example_value) < 10:  # Small integers
                    sql_data_types[header] = 'INT'
                else:
                    sql_data_types[header] = 'BIGINT'
            elif is_float(example_value):
                sql_data_types[header] = 'FLOAT'
            else:
                sql_data_types[header] = f'VARCHAR({max_length})'

        # Generate SQL CREATE TABLE statement
        sql_create = f"CREATE TABLE your_table_name (\n"
        for header in headers:
            sql_create += f"    {header} {sql_data_types[header]},\n"
        sql_create = sql_create.rstrip(',\n') + "\n);"

        return sql_create

def is_float(value):
    try:
        float(value)
        return True
    except ValueError:
        return False

# Example usage:
csv_file_path = 'sheets.csv'
sql_statement = infer_sql_data_types(csv_file_path)
print(sql_statement)

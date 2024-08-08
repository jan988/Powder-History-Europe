from flask import Flask, request, jsonify
import pandas as pd
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Load the dataset
df = pd.read_csv('combined_weather_data5.csv')
print(f"Data loaded:\n{df.head()}")

# Ensure 'date' is converted to datetime.date
df['date'] = pd.to_datetime(df['date']).dt.date

@app.route('/average_snowfall', methods=['GET'])
def average_snowfall():
    print("Received request")
    try:
        # Extract parameters
        start_date_str = request.args.get('start_date')
        end_date_str = request.args.get('end_date')
        locations = request.args.getlist('location')  # Get a list of locations

        # Debug prints
        print(f"Received start_date: {start_date_str}")
        print(f"Received end_date: {end_date_str}")
        print(f"Received locations: {locations}")

        # Convert request date strings to datetime.date objects
        start_date = pd.to_datetime(start_date_str).date()
        end_date = pd.to_datetime(end_date_str).date()

        # Debug prints
        print(f"Converted start_date: {start_date}")
        print(f"Converted end_date: {end_date}")

        # Extract month and day for filtering
        start_month_day = (start_date.month, start_date.day)
        end_month_day = (end_date.month, end_date.day)

        # Add columns for month and day
        df['month'] = df['date'].apply(lambda x: x.month)
        df['day'] = df['date'].apply(lambda x: x.day)

        # Filter the data ignoring the year
        if start_month_day <= end_month_day:
            mask = ((df['month'] > start_month_day[0]) | 
                   ((df['month'] == start_month_day[0]) & (df['day'] >= start_month_day[1]))) & \
                   ((df['month'] < end_month_day[0]) | 
                   ((df['month'] == end_month_day[0]) & (df['day'] <= end_month_day[1])))
        else:  # This handles the case where the date range spans over the end of the year
            mask = ((df['month'] > start_month_day[0]) | 
                   ((df['month'] == start_month_day[0]) & (df['day'] >= start_month_day[1]))) | \
                   ((df['month'] < end_month_day[0]) | 
                   ((df['month'] == end_month_day[0]) & (df['day'] <= end_month_day[1])))

        filtered_df = df.loc[mask]

        # Debug prints for filtered DataFrame
        print(f"Filtered DataFrame:\n{filtered_df}")

        # If no locations are specified, use all unique locations from the data
        if not locations:
            locations = filtered_df['location_id'].unique()
            print(f"Locations defaulted to: {locations}")

        # Calculate average snowfall for each location
        results = {}
        for location in locations:
            location_df = filtered_df[filtered_df['location_id'] == location]
            avg_snowfall = location_df['snowfall_sum'].mean()
            results[location] = avg_snowfall
            print(f"Location: {location}, Average Snowfall: {avg_snowfall}")

        return jsonify(results)

    except Exception as e:
        print(f"An error occurred: {e}")
        return jsonify({"error": "An internal error occurred."}), 500

if __name__ == '__main__':
    app.run(debug=True)

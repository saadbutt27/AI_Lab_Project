from flask import Flask, request, jsonify
import joblib
import os

app = Flask(__name__)


# Construct the path to the .pkl file
pkl_file_path = os.path.join(os.path.dirname(__file__), 'stock_price_sentiment_predictor.pkl')
print(pkl_file_path)

with open(pkl_file_path, "rb") as file:
    model = joblib.load(file)

@app.route("/")
def home():
    return "Welcome to the ML Model API!"

@app.route("/api/python")
def hello_world():
    return "<p>Hello, Flask!</p>"

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json  # Get data from the POST request
    # Assuming data is a dictionary with the necessary keys
    # Adjust the input format as required by your model
    features = [[data['high_price'], data['low_price'], data['adj_close'], data['volume'], data['sentiment']]]
    prediction = model.predict(features)
    return jsonify({'Predicted Open and Close Price:': prediction.tolist()})

# Load the model
# model = joblib.load('stock_price_sentiment_predictor.pkl')

# high_price, low_price, volume, adj_close, sentiment = 151.190002, 146.470001, 149.004959, 103296000, 0.400000
# # Predict for a new day
# new_data = [[high_price, low_price, volume, adj_close, sentiment]]  # Replace with actual values
# predicted_close = model.predict(new_data)
# print(f'Predicted Close Price: {predicted_close[0]}')
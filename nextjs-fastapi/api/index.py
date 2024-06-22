from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import os
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
import re, string

app = FastAPI()

origins = [
    "http://localhost:3000",  # Example frontend URL
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)

class PredictionRequest(BaseModel):
    high_price: float
    low_price: float
    adj_close: float
    volume: int
    tweet: str

class PredictionResponse(BaseModel):
    open_price: float
    close_price: float

class ClassificationRequest(BaseModel):
    open_price: float
    close_price: float
    high_price: float
    low_price: float
    adj_close: float
    volume: int
    tweet: str

class ClassificationResponse(BaseModel):
    recommendation: str

# Construct the path to the .pkl file
lr_pkl_file_path = os.path.join(os.path.dirname(__file__), 'stock_price_sentiment_predictor.pkl')
knn_pkl_file_path = os.path.join(os.path.dirname(__file__), 'stock_buy_sell_knn_classifier.pkl')

# Load the model
with open(lr_pkl_file_path, "rb") as file:
    lr_model = joblib.load(file)

# Load the model
with open(knn_pkl_file_path, "rb") as file:
    knn_model = joblib.load(file)

@app.get("/")
def root():
    return "Welcome to the ML Model API!"

# Initialize VADER sentiment analyzer
analyzer = SentimentIntensityAnalyzer()

# Function to get sentiment score
def get_sentiment(tweet):
    sentiment_dict = analyzer.polarity_scores(tweet)
    return sentiment_dict['compound']  # compound score is a normalized score between -1 and 1


# Function to clean tweets
def clean_tweet(tweet):
    tweet = re.sub(r'@[A-Za-z0-9]+', '', tweet)  # Remove mentions
    tweet = re.sub(r'#', '', tweet)  # Remove hashtags
    tweet = re.sub(r'RT[\s]+', '', tweet)  # Remove RT
    tweet = re.sub(r'[\s]+https?://\S+', '', tweet)  # Remove URLs
    re_punc = re.compile('[%s]' % re.escape(string.punctuation))
    tweet = re_punc.sub('', tweet)  # Remove punctuations
    return tweet

@app.post('/predict')
def predict(request: PredictionRequest):
    print("hello")
    # Clean the tweet
    cleaned_tweet = clean_tweet(request.tweet)
    # Get the sentiment of the cleaned tweet
    sentiment_dict = analyzer.polarity_scores(cleaned_tweet)
    sentiment = sentiment_dict['compound']

    # Convert the request data to a format suitable for the model
    features = [[
        request.high_price,
        request.low_price,
        request.adj_close,
        request.volume,
        sentiment
    ]]
    prediction = lr_model.predict(features)
    open_price = prediction[0][0]
    close_price = prediction[0][1]
    return PredictionResponse(open_price=open_price, close_price=close_price)

@app.post('/classify')
def predict(request: ClassificationRequest):
    # Clean the tweet
    cleaned_tweet = clean_tweet(request.tweet)
    # Get the sentiment of the cleaned tweet
    sentiment_dict = analyzer.polarity_scores(cleaned_tweet)
    sentiment = sentiment_dict['compound']

    # Convert the request data to a format suitable for the model
    features = [[
        request.open_price,
        request.close_price,
        request.high_price,
        request.low_price,
        request.adj_close,
        request.volume,
        sentiment
    ]]
    prediction = knn_model.predict(features)
    return ClassificationResponse(recommendation=prediction[0])


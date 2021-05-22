from flask import Flask, render_template, jsonify
import pandas as pd
from sqlalchemy import create_engine
import os

app = Flask(__name__)

@app.route("/")
def index():
    unknown_id = os.environ.get('API_KEY')
    return render_template("index.html", unknown_id=unknown_id)

@app.route("/api_shuju_meli")
def api_meli():

    connection_string = os.environ.get('DATABASE_URL', '')

    ### Create database connection    
    engine = create_engine(connection_string, encoding="utf16")
    data = pd.read_sql("select * from properties", engine)

    return(
    data
    .loc[data['source_of_info'] == 'mercado_libre']
    .reset_index()
    .drop(['index'], inplace=False, axis=1)
    .to_json(force_ascii = True, orient="records")
)

@app.route("/api_shuju_inmuebles24")
def api_inmuebles24():

    connection_string = os.environ.get('DATABASE_URL', '')

    ### Create database connection
    engine = create_engine(connection_string, encoding="utf16")
    data = pd.read_sql("select * from properties", engine)

    return(
    data
    .loc[data['source_of_info'] == 'Inmuebles 24']
    .reset_index()
    .drop(['index'], inplace=False, axis=1)
    .to_json(force_ascii = True, orient="records")
)




if __name__ == "__main__":
    app.run(debug = True)
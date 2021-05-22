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

    # db_details = "postgres:karen@localhost:5432/properties_db"
    # connection_string = f'postgresql://{db_details}'

    # ### Create database connection    
    # engine = create_engine(connection_string, encoding="utf16")
    # data = pd.read_sql("select * from properties", engine)

#     return(
#     data
#     .loc[data['source_of_info'] == 'mercado_libre']
#     .reset_index()
#     .drop(['index'], inplace=False, axis=1)
#     .to_json(force_ascii = True, orient="records")
# )
    return jsonify([{
        "meli":"demo",
        "views": 100
    }])

@app.route("/api_shuju_inmuebles24")
def api_inmuebles24():

    # db_details = "postgres:karen@localhost:5432/properties_db"
    # connection_string = f'postgresql://{db_details}'


#     ### Create database connection
#     engine = create_engine(connection_string, encoding="utf16")
#     data = pd.read_sql("select * from properties", engine)

#     return(
#     data
#     .loc[data['source_of_info'] == 'Inmuebles 24']
#     .reset_index()
#     .drop(['index'], inplace=False, axis=1)
#     .to_json(force_ascii = True, orient="records")
# )
        return jsonify([{
            "inmuebles24":"demo",
            "views": 100
        }])



if __name__ == "__main__":
    app.run(debug = True)
from flask import Flask, render_template
import pandas as pd
from sqlalchemy import create_engine

app = Flask(__name__)
db_details = "postgres:karen@localhost:5432/properties_db"
connection_string = f'postgresql://{db_details}'

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/api_shuju_meli")
def api_meli():

    ### Create database connection
    engine = create_engine(connection_string, encoding="utf16")
    data = pd.read_sql("select * from properties", engine)

    return(
        data
        .to_json(force_ascii = True, orient="records")
    )

@app.route("/api_shuju_inmuebles24")
def api_inmuebles24():

    ### Create database connection
    engine = create_engine(connection_string, encoding="utf16")
    data = pd.read_sql("select * from properties", engine)

    return(
        data
        .to_json(force_ascii = True, orient="records")
    )





if __name__ == "__main__":
    app.run(debug = True)
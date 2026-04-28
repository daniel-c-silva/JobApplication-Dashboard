import psycopg2 # * import postgres sql
from flask import Flask, jsonify 
from flask_cors import CORS # * backend frontend communication
import os # * used to get the port number from the environement var so it can work on render.com and locally as well.

app = Flask(__name__) # * the app using it to create routes and stuff
CORS(app) # * this is used so the frontend can acess the backend.


conn = psycopg2.connect( # * connect to the database
    host="localhost",
    port="yourport",
    database="postgres",
    user="postgres",
    password="useyourown" 
)

cursor = conn.cursor() # * define our cursor

# * Create table
cursor.execute('''
CREATE TABLE IF NOT EXISTS applications (
    id SERIAL PRIMARY KEY, 
    company TEXT,
    stack TEXT,
    date TEXT,
    status TEXT)
''')

conn.commit()

cursor.close()
conn.close()

# ! *** HELPER FUNCTIONS *** :


# ! function to simplify the connection and cursor definition
def getDB():
    try: 
        conn = psycopg2.connect(
            host="localhost",
            port="yourport",
            database="postgres",
            user="postgres",
            password="yourpassword"
        )
        return conn, conn.cursor()
    except Exception as error:
        return jsonify ({"error": str(error)})



@app.route("/add_application/<company>/<stack>/<date>/<status>")
# ! function to add an application
def addApplication(company, stack, date, status): # ? takes (company stack and date and status) as arguments
    try:
        conn, cursor = getDB()

        cursor.execute('''
        INSERT INTO applications (company, stack, date, status)
        VALUES (%s, %s, %s, %s)
        ''', (company, stack, date, status))

        conn.commit()

        cursor.close()
        conn.close()
        return jsonify({"message": f"Application for {company} was added."})
    except Exception as error:
        return jsonify ({"error": str(error)})


# ? SET STATUS route
@app.route("/change_status/<int:id>/<status>")
# ! function to change the status of an application preferably to sent, pending 1st interview etc.
def setApplicationStatus(id, status):
    try:
        conn, cursor = getDB()

        cursor.execute('''
        UPDATE applications
        SET status = %s
        WHERE id = %s
        ''', (status, id))

        conn.commit()

        cursor.close()
        conn.close()
        return jsonify({"message": f"Status was altered for Application ID {id}."})
    except Exception as error:
        return jsonify ({"error": str(error)})

# ? DELETE route
@app.route("/delete/<int:id>")
# ! function to delete an application.
def deleteApplication(id):
    try:
        conn, cursor = getDB()

        cursor.execute('''
        DELETE FROM applications
        WHERE id = %s
        ''', (id,))

        conn.commit()

        cursor.close()
        conn.close()
        return jsonify({"message": f"Application ID {id} has been deleted."})
    except Exception as error:
        return jsonify ({"error": str(error)})



# ? HOME route 
@app.route("/")
# ! function to get info from db
def readAllApplications():
    try:
        conn, cursor = getDB()

        cursor.execute('''
        SELECT * FROM applications
        ''')

        applications = cursor.fetchall() 

        conn.commit()

        cursor.close()
        conn.close()


        applications_list = [] # * create an empty list to add each application to
        for application in applications:
            applications_list.append({ # * for each application add to the applications list each item in application (id, name, stack, date and status)
                "id": application[0],
                "company": application[1],
                "stack": application[2],
                "date": application[3],
                "status": application[4]
            })
  
      
        return jsonify(applications_list)
    except Exception as error:
            return jsonify ({"error": str(error)})






if __name__ == "__main__": 
   app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 5001)), debug=False) #! this is used to run the app. host




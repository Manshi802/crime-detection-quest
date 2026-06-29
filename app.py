import os
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import sqlite3

app = Flask(__name__)
CORS(app)

# ==========================
# DATABASE INIT
# ==========================
def init_db():
    conn = sqlite3.connect('game.db')
    c = conn.cursor()

    c.execute('''
        CREATE TABLE IF NOT EXISTS suspects (
            id INTEGER PRIMARY KEY,
            name TEXT,
            age INTEGER,
            city TEXT,
            occupation TEXT,
            guilty INTEGER
        )
    ''')

    c.execute("DELETE FROM suspects")

    suspects = [
        (1, 'Rahul Sharma', 28, 'Mumbai', 'Engineer', 0),
        (2, 'Priya Verma', 35, 'Delhi', 'Doctor', 1),
        (3, 'Amit Singh', 22, 'Pune', 'Student', 0),
        (4, 'Neha Gupta', 45, 'Mumbai', 'Banker', 0),
        (5, 'Vikram Rao', 31, 'Delhi', 'Lawyer', 1),
    ]

    c.executemany("INSERT INTO suspects VALUES (?,?,?,?,?,?)", suspects)

    conn.commit()
    conn.close()

init_db()

# ==========================
# API CHECK QUERY
# ==========================
@app.route('/check', methods=['POST'])
def check_query():
    data = request.get_json()

    user_query = data.get("query", "")
    correct_query = data.get("correct_query", "")

    try:
        conn = sqlite3.connect("game.db")
        c = conn.cursor()

        # USER QUERY SAFE
        try:
            c.execute(user_query)
            user_result = c.fetchall()
        except Exception as e:
            print("BACKEND ERROR:",e)
            return jsonify({
                "correct": False,
                "error": "User Query Error: " + str(e)
            })

        # CORRECT QUERY SAFE
        try:
            c.execute(correct_query)
            correct_result = c.fetchall()
        except Exception as e:
            return jsonify({
                "correct": False,
                "error": "System Query Error: " + str(e)
            })

        conn.close()

        is_correct = sorted(user_result) == sorted(correct_result)

        return jsonify({
            "correct": is_correct,
            "result": user_result
        })

    except Exception as e:
        print("ERROR:", e)
        return jsonify({
            "correct": False,
            "error": str(e)
        })
# ==========================
# FRONTEND SERVE
# ==========================
@app.route('/')
def index():
    return send_from_directory('.', 'index.html')

@app.route('/<path:filename>')
def serve_files(filename):
    return send_from_directory('.', filename)

# ==========================
# RUN SERVER
# ==========================
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 5000)), debug=False)

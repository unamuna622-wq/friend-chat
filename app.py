from flask import Flask, render_template, request, jsonify
import sqlite3

app = Flask(__name__)


def init_db():
    connection = sqlite3.connect("chat.db")

    connection.execute("""
        CREATE TABLE IF NOT EXISTS messages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL,
            message TEXT NOT NULL,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    """)

    connection.commit()
    connection.close()


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/send", methods=["POST"])
def send_message():
    data = request.json

    username = data["username"]
    message = data["message"]

    connection = sqlite3.connect("chat.db")

    connection.execute(
        "INSERT INTO messages (username, message) VALUES (?, ?)",
        (username, message)
    )

    connection.commit()
    connection.close()

    return jsonify({"status": "success"})


@app.route("/messages")
def get_messages():
    connection = sqlite3.connect("chat.db")

    messages = connection.execute(
        "SELECT username, message, timestamp FROM messages ORDER BY id"
    ).fetchall()

    connection.close()

    messages = [
        {
            "username": message[0],
            "message": message[1],
            "timestamp": message[2]
        }
        for message in messages
    ]

    return jsonify(messages)


if __name__ == "__main__":
    init_db()
    app.run(debug=True)
from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

messages = []


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/send", methods=["POST"])
def send_message():
    data = request.json
    message = data["message"]

    messages.append(message)

    return jsonify({"status": "success"})


@app.route("/messages")
def get_messages():
    return jsonify(messages)


if __name__ == "__main__":
    app.run(debug=True)
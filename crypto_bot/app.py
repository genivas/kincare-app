from flask import Flask, render_template, jsonify
import json
import os
from trading_engine import TradingEngine
from database import init_db, get_history

# Inicializa o banco de dados na inicializacao do servidor
init_db()

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/state')
def get_state():
    """Lê o arquivo gerado pelo robô e entrega para o navegador."""
    try:
        if os.path.exists('state.json'):
            with open('state.json', 'r') as f:
                data = json.load(f)
            return jsonify(data)
        else:
            return jsonify({"rsi_values": {}, "open_positions": [], "last_update": "Aguardando bot..."})
    except Exception as e:
        return jsonify({"error": str(e)})

from database import init_db, get_history, log_trade

@app.route('/api/close/<path:symbol>', methods=['POST'])
def close_single(symbol):
    engine = TradingEngine(use_testnet=True)
    positions = engine.get_open_positions()
    for pos in positions:
        if pos['symbol'] == symbol:
            result = engine.close_position(symbol)
            log_trade(symbol, pos['side'], float(pos['pnl']))
            return jsonify(result)
    return jsonify({"error": "Posicao nao encontrada"})

@app.route('/api/close_all', methods=['POST'])
def close_all():
    engine = TradingEngine(use_testnet=True)
    positions = engine.get_open_positions()
    for pos in positions:
        engine.close_position(pos['symbol'])
        log_trade(pos['symbol'], pos['side'], float(pos['pnl']))
    return jsonify({"status": "success", "closed": len(positions)})

@app.route('/api/history')
def api_history():
    rows = get_history()
    history = []
    cumulative = 0
    for row in rows:
        cumulative += row[2]
        history.append({
            'symbol': row[0],
            'side': row[1],
            'pnl': row[2],
            'cumulative': cumulative,
            'time': row[3]
        })
    return jsonify(history)

if __name__ == '__main__':
    # Roda o servidor na porta 5000
    app.run(debug=True, host='0.0.0.0', port=5000)

import json
import sqlite3
import os
from trading_engine import TradingEngine

print("Iniciando Limpeza Completa...")

# 1. Fechar todas as posicoes ativas na corretora (Testnet)
print("Buscando posições abertas na Binance...")
engine = TradingEngine(use_testnet=True)
positions = engine.get_open_positions()
print(f"Encontradas {len(positions)} posições abertas. Fechando todas...")

for pos in positions:
    symbol = pos['symbol']
    print(f"Fechando posição: {symbol}...")
    engine.close_position(symbol)

# 2. Resetar banco de dados de trades
print("Deletando histórico de trades...")
if os.path.exists("trades.db"):
    os.remove("trades.db")
    
# Recriar a tabela limpa
conn = sqlite3.connect("trades.db")
cursor = conn.cursor()
cursor.execute('''
    CREATE TABLE IF NOT EXISTS trade_history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        symbol TEXT NOT NULL,
        side TEXT NOT NULL,
        pnl REAL NOT NULL,
        close_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
''')
conn.commit()
conn.close()

# 3. Resetar estado (state.json) para $50 virtual
print("Resetando State.json...")
initial_state = {
    "rsi_values": {},
    "open_positions": [],
    "wallet_balance": 50.0,
    "closed_pnl": 0.0,
    "entry_times": {},
    "last_update": "Limpo"
}
with open("state.json", "w") as f:
    json.dump(initial_state, f, indent=4)

print("Limpeza Concluída! O ambiente está virgem para uma nova rodada de $50.")

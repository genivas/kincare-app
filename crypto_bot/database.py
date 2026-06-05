import sqlite3
import os
from datetime import datetime

DB_PATH = os.path.join(os.path.dirname(__file__), 'trades.db')

def init_db():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS trade_history (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            symbol TEXT NOT NULL,
            side TEXT NOT NULL,
            pnl REAL NOT NULL,
            close_time DATETIME NOT NULL
        )
    ''')
    conn.commit()
    conn.close()

def log_trade(symbol, side, pnl):
    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO trade_history (symbol, side, pnl, close_time)
            VALUES (?, ?, ?, ?)
        ''', (symbol, side, pnl, datetime.now().strftime("%Y-%m-%d %H:%M:%S")))
        conn.commit()
        conn.close()
    except Exception as e:
        print(f"Erro ao salvar trade no banco de dados: {e}")

def get_history():
    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        cursor.execute('SELECT symbol, side, pnl, close_time FROM trade_history ORDER BY id ASC')
        rows = cursor.fetchall()
        conn.close()
        return rows
    except Exception as e:
        print(f"Erro ao buscar histórico: {e}")
        return []

import time
import json
import database
from rsi_calculator import RSICalculator
from trading_engine import TradingEngine

def main():
    print("Iniciando o Robo Institucional (EMA + ATR + Soros) ...")
    
    database.init_db()
    rsi_calc = RSICalculator()
    engine = TradingEngine(use_testnet=True)
    
    try:
        with open('state.json', 'r') as f:
            old_state = json.load(f)
            entry_times = old_state.get("entry_times", {})
    except:
        entry_times = {}

    coins_to_watch = [
        'BTC/USDT', 'ETH/USDT', 'SOL/USDT', 'BNB/USDT',
        'DOGE/USDT', 'ADA/USDT', 'LINK/USDT', 'DOT/USDT',
        'XRP/USDT', 'AVAX/USDT', 'MATIC/USDT', 'SHIB/USDT',
        'UNI/USDT', 'LTC/USDT', 'ATOM/USDT', 'NEAR/USDT',
        'BCH/USDT', 'ETC/USDT', 'FIL/USDT', 'XLM/USDT',
        'INJ/USDT', 'RNDR/USDT', 'OP/USDT', 'ARB/USDT',
        'LDO/USDT', 'APT/USDT', 'SUI/USDT', 'SEI/USDT',
        'TIA/USDT', 'WLD/USDT', 'FTM/USDT', 'SAND/USDT', 
        'MANA/USDT', 'GALA/USDT', 'AXS/USDT', 'AAVE/USDT', 
        'MKR/USDT', 'SNX/USDT'
    ]
    
    initial_virtual_balance = 50.0
    print(f"Modo Desafio! Caixa Inicial Virtual: $ {initial_virtual_balance:.2f} USDT")
    
    max_pnl_tracker = {}
    atr_tracker = {} # Salva a distancia monetaria do stop baseada no ATR
    
    while True:
        print("\n--- Analisando o Mercado de Futuros ---")
        try:
            open_positions = engine.get_open_positions()
            # Calculo dinamico do saldo $50 com base no histórico
            history = database.get_history()
            closed_pnl = sum([row[2] for row in history]) # row[2] é o PnL
            virtual_balance = initial_virtual_balance + closed_pnl
            
            state_data = {
                "rsi_values": {},
                "open_positions": open_positions,
                "wallet_balance": virtual_balance,
                "closed_pnl": closed_pnl,
                "entry_times": entry_times,
                "last_update": time.strftime("%H:%M:%S")
            }
            
            # --- PROTECAO E LUCRO DINAMICO ---
            current_time = time.time()
            current_symbols = []
            for pos in open_positions:
                symbol = pos['symbol']
                pnl = float(pos['pnl'])
                side = pos['side']
                current_symbols.append(symbol)
                
                if symbol not in entry_times:
                    entry_times[symbol] = current_time
                    
                if symbol not in max_pnl_tracker:
                    max_pnl_tracker[symbol] = pnl
                else:
                    max_pnl_tracker[symbol] = max(max_pnl_tracker[symbol], pnl)

                # Busca o ATR do momento da compra (Default -$2.50 se nao achar)
                stop_limit = atr_tracker.get(symbol, -2.50)

                # Regra 1: Stop Loss Guiado pelo ATR
                if pnl <= stop_limit:
                    print(f"STOP LOSS ACIONADO: {symbol} perdeu o limite do ATR ({stop_limit:.2f}). Fechando!")
                    engine.close_position(symbol)
                    database.log_trade(symbol, side, pnl)
                
                # Regra 2: Trailing Take Profit (Se lucro passar de +5 dólares)
                elif max_pnl_tracker[symbol] >= 5.00:
                    if pnl <= (max_pnl_tracker[symbol] - 1.50):
                        print(f"TRAILING STOP ACIONADO: {symbol} garantiu lucro de ${pnl:.2f}!")
                        engine.close_position(symbol)
                        database.log_trade(symbol, side, pnl)

                # Regra 3: Time-Based Stop Loss (Fadiga) - 1 hora (3600s)
                elif pnl < 0 and (current_time - entry_times[symbol]) > 3600:
                    print(f"TIME-STOP: {symbol} sem tração após 60 min. Fechando para libertar margem!")
                    engine.close_position(symbol)
                    database.log_trade(symbol, side, pnl)

            # Limpeza de memória
            for sym in list(max_pnl_tracker.keys()):
                if sym not in current_symbols:
                    del max_pnl_tracker[sym]
            for sym in list(atr_tracker.keys()):
                if sym not in current_symbols:
                    del atr_tracker[sym]
            for sym in list(entry_times.keys()):
                if sym not in current_symbols:
                    del entry_times[sym]

            # Extrai apenas a base 'MOEDA/USDT' para comparar com coins_to_watch (Ignora o :USDT da Binance)
            current_base_symbols = [sym.split(':')[0] for sym in current_symbols]

            # Bloqueio de Risco Sistêmico: Max 10 operações simultâneas (10% de exposição total)
            if len(open_positions) < 10:
                # Gestao de Capital Soros ($50 account mode - 10% por trade, mínimo de $5 para a Binance aceitar)
                amount_usd = max(5.0, virtual_balance * 0.10)

                for coin in coins_to_watch:
                    if coin in current_base_symbols:
                        continue # Evita abrir múltiplas posições na mesma moeda
                        
                    rsi = rsi_calc.get_rsi(coin, timeframe='5m')
                    if rsi is not None:
                        state_data["rsi_values"][coin] = round(rsi, 2)
                        
                        if rsi < 40:
                            # Puxa EMA para confirmar tendencia macro de alta
                            ema = rsi_calc.get_ema(coin, timeframe='1h')
                            price = engine.get_current_price(coin)
                            
                            if ema and price and price > ema:
                                atr = rsi_calc.get_atr(coin, timeframe='5m')
                                if atr:
                                    notional = amount_usd * 5
                                    raw_atr_risk = -(atr / price) * notional * 1.5 # 1.5x ATR
                                    # Para o desafio de $50, impede stops menores que 50 cents (spread mata)
                                    atr_pnl_risk = min(-0.50, raw_atr_risk)
                                    
                                    print(f"ALERTA (LONG): {coin} (RSI {rsi:.2f}) Acima da EMA 1H. Stop ATR: ${atr_pnl_risk:.2f}")
                                    atr_tracker[coin] = atr_pnl_risk
                                    engine.execute_long(coin, amount_usd=amount_usd)

                        elif rsi > 60:
                            # Puxa EMA para confirmar tendencia macro de baixa
                            ema = rsi_calc.get_ema(coin, timeframe='1h')
                            price = engine.get_current_price(coin)
                            
                            if ema and price and price < ema:
                                atr = rsi_calc.get_atr(coin, timeframe='5m')
                                if atr:
                                    notional = amount_usd * 5
                                    raw_atr_risk = -(atr / price) * notional * 1.5
                                    atr_pnl_risk = min(-0.50, raw_atr_risk)
                                    
                                    print(f"ALERTA (SHORT): {coin} (RSI {rsi:.2f}) Abaixo da EMA 1H. Stop ATR: ${atr_pnl_risk:.2f}")
                                    atr_tracker[coin] = atr_pnl_risk
                                    engine.execute_short(coin, amount_usd=amount_usd)
            else:
                print(f"LIMITE SISTEMICO: 10 operações ativas (10% exposição). Aguardando fechamentos.")
            
            with open('state.json', 'w') as f:
                json.dump(state_data, f, indent=4)
            
            time.sleep(15)
            
        except Exception as e:
            print(f"Erro no loop principal: {e}")
            time.sleep(15)

if __name__ == "__main__":
    main()

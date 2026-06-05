import os
import ccxt
from dotenv import load_dotenv

class TradingEngine:
    def __init__(self, use_testnet=True):
        load_dotenv()
        
        self.exchange = ccxt.binance({
            'apiKey': os.getenv('BINANCE_API_KEY'),
            'secret': os.getenv('BINANCE_SECRET_KEY'),
            'enableRateLimit': True,
            'options': {
                'defaultType': 'future', # <-- Magia acontece aqui: Mudança para Futuros
            }
        })
        
        self.use_testnet = use_testnet
        if self.use_testnet:
            self.exchange.set_sandbox_mode(True)
            print("[TESTNET FUTURES] Iniciado no simulador de Futuros (Long & Short)")
        else:
            print("[LIVE FUTURES] Iniciado em modo REAL (Atenção: Dinheiro Real em Risco!)")

    def execute_long(self, symbol, amount_usd=50, leverage=5):
        """
        Aposta na ALTA (Compra no pânico).
        """
        try:
            # 1. Configura a Alavancagem primeiro
            try:
                self.exchange.set_leverage(leverage, symbol)
            except Exception as e:
                print(f"Aviso: Não foi possível setar alavancagem {leverage}x para {symbol}: {e}")

            ticker = self.exchange.fetch_ticker(symbol)
            current_price = ticker['last']
            
            # O tamanho real da operação é o seu dinheiro multiplicado pela alavancagem
            notional_value = amount_usd * leverage
            quantity = notional_value / current_price
            quantity = float(self.exchange.amount_to_precision(symbol, quantity))
            
            print(f"Sinal LONG (5x). Comprando {quantity} de {symbol} a mercado...")
            order = self.exchange.create_market_buy_order(symbol, quantity)
            print(f"LONG aberto com sucesso! ID: {order['id']}")
            
            # O Take Profit e o Stop Loss agora sao controlados dinamicamente pelo main.py (Virtual)
            
            return order

        except ccxt.BadSymbol:
            print(f"Aviso: O par {symbol} nao e suportado na Binance Futures.")
            return None
        except Exception as e:
            print(f"Erro ao abrir LONG na Binance: {e}")
            return None

    def execute_short(self, symbol, amount_usd=50, leverage=5):
        """
        Aposta na QUEDA (Vende na euforia).
        """
        try:
            # 1. Configura a Alavancagem primeiro
            try:
                self.exchange.set_leverage(leverage, symbol)
            except Exception as e:
                print(f"Aviso: Não foi possível setar alavancagem {leverage}x para {symbol}: {e}")

            ticker = self.exchange.fetch_ticker(symbol)
            current_price = ticker['last']
            
            # O tamanho real da operação é o seu dinheiro multiplicado pela alavancagem
            notional_value = amount_usd * leverage
            quantity = notional_value / current_price
            quantity = float(self.exchange.amount_to_precision(symbol, quantity))
            
            print(f"Sinal SHORT (5x). Vendendo a descoberto {quantity} de {symbol} a mercado...")
            order = self.exchange.create_market_sell_order(symbol, quantity)
            print(f"SHORT aberto com sucesso! ID: {order['id']}")
            
            # O Take Profit e o Stop Loss agora sao controlados dinamicamente pelo main.py (Virtual)
            
            return order

        except ccxt.BadSymbol:
            print(f"Aviso: O par {symbol} nao e suportado na Binance Futures.")
            return None
        except Exception as e:
            print(f"Erro ao abrir SHORT na Binance: {e}")
            return None

    def get_open_positions(self):
        """
        Retorna as posições abertas no mercado de futuros e o PnL (Lucro/Prejuízo).
        """
        try:
            positions = self.exchange.fetch_positions()
            active_positions = [p for p in positions if float(p['contracts']) > 0]
            
            clean_positions = []
            for p in active_positions:
                # O PnL pode vir nulo ou em diferentes chaves dependendo do fetch
                pnl = p.get('unrealizedPnl', p.get('info', {}).get('unRealizedProfit', 0))
                
                clean_positions.append({
                    'symbol': p['symbol'],
                    'side': p['side'].upper(), # LONG ou SHORT
                    'entry_price': float(p.get('entryPrice', 0)),
                    'pnl': float(pnl)
                })
            return clean_positions
        except Exception as e:
            print(f"⚠️ Erro ao buscar PnL das posições abertas: {e}")
            return []

    def close_position(self, symbol):
        """Zera a posição atual de uma moeda e cancela as ordens abertas dela."""
        try:
            # 1. Cancelar Take Profits pendentes
            self.exchange.cancel_all_orders(symbol)
            
            # 2. Resgatar tamanho da posição
            positions = self.exchange.fetch_positions([symbol])
            active_positions = [p for p in positions if float(p['contracts']) > 0]
            
            if not active_positions:
                return {"status": "error", "message": f"Nenhuma posição aberta em {symbol}."}
                
            pos = active_positions[0]
            size = float(pos['contracts'])
            side = pos['side'].lower()
            
            # 3. Mandar ordem inversa a mercado (Reduce Only)
            if side == 'long':
                order = self.exchange.create_market_sell_order(symbol, size, params={'reduceOnly': True})
                print(f"ZERADO: Posicao LONG de {symbol} fechada via Dashboard!")
            else:
                order = self.exchange.create_market_buy_order(symbol, size, params={'reduceOnly': True})
                print(f"ZERADO: Posicao SHORT de {symbol} fechada via Dashboard!")
                
            return {"status": "success", "message": f"{symbol} zerada."}
            
        except Exception as e:
            print(f"Erro ao zerar {symbol}: {e}")
            return {"status": "error", "message": str(e)}

    def get_current_price(self, symbol):
        try:
            ticker = self.exchange.fetch_ticker(symbol)
            return ticker['last']
        except Exception as e:
            print(f"Erro ao buscar preco atual de {symbol}: {e}")
            return None

    def close_all_positions(self):
        """Zera todas as posições ativas."""
        try:
            open_pos = self.get_open_positions()
            results = []
            for p in open_pos:
                res = self.close_position(p['symbol'])
                results.append(res)
            return {"status": "success", "message": f"{len(open_pos)} posições fechadas."}
        except Exception as e:
            return {"status": "error", "message": str(e)}

    def get_wallet_balance(self):
        """Retorna o saldo total da conta (Caixa) em USDT."""
        try:
            balance = self.exchange.fetch_balance()
            usdt_total = balance.get('USDT', {}).get('total', 0)
            if float(usdt_total) == 0 and 'info' in balance:
                usdt_total = balance['info'].get('totalWalletBalance', 0)
                if not usdt_total:
                    # Alternativa comum da Binance Futures
                    assets = balance['info'].get('assets', [])
                    for a in assets:
                        if a.get('asset') == 'USDT':
                            usdt_total = a.get('walletBalance', 0)
            return float(usdt_total)
        except Exception as e:
            print(f"⚠️ Erro ao puxar o caixa: {e}")
            return 0.0

import { API_BASE_URL } from '../config/api';

export interface GPSPayload {
  tripId: number;
  latitude: number;
  longitude: number;
  speed: number;
  timestamp: string; // ISO format
}

class WebSocketService {
  private socket: WebSocket | null = null;
  private isConnected = false;
  private reconnectTimeout: ReturnType<typeof setTimeout> | null = null;
  private heartbeatInterval: ReturnType<typeof setInterval> | null = null;

  constructor() {
    // Auto-initialize when needed
  }

  private getWebSocketUrl(): string {
    // Convert HTTP URL to WebSocket URL
    const wsUrl = API_BASE_URL.replace('http://', 'ws://').replace('https://', 'wss://') + '/ws';
    return wsUrl;
  }

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.isConnected && this.socket) {
        resolve();
        return;
      }

      try {
        const wsUrl = this.getWebSocketUrl();
        console.log('[WebSocket] Connecting to:', wsUrl);
        
        this.socket = new WebSocket(wsUrl);

        const timeout = setTimeout(() => {
          this.cleanup();
          reject(new Error('WebSocket connection timeout'));
        }, 10000);

        this.socket.onopen = () => {
          console.log('[WebSocket] Connected successfully');
          clearTimeout(timeout);
          this.isConnected = true;
          this.startHeartbeat();
          resolve();
        };

        this.socket.onerror = (error: Event) => {
          console.error('[WebSocket] Connection error:', error);
          clearTimeout(timeout);
          this.cleanup();
          reject(new Error('WebSocket connection failed'));
        };

        this.socket.onclose = (event: CloseEvent) => {
          console.log('[WebSocket] Connection closed:', event.code, event.reason);
          this.isConnected = false;
          this.stopHeartbeat();
          
          // Auto-reconnect if not intentionally closed
          if (event.code !== 1000) {
            this.scheduleReconnect();
          }
        };

        this.socket.onmessage = (event: MessageEvent) => {
          console.log('[WebSocket] Message received:', event.data);
        };

      } catch (error) {
        console.error('[WebSocket] Error creating WebSocket:', error);
        reject(error);
      }
    });
  }

  private startHeartbeat() {
    this.heartbeatInterval = setInterval(() => {
      if (this.socket && this.isConnected) {
        this.socket.send(JSON.stringify({ type: 'ping' }));
      }
    }, 30000); // Send ping every 30 seconds
  }

  private stopHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  private scheduleReconnect() {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
    }
    
    this.reconnectTimeout = setTimeout(() => {
      console.log('[WebSocket] Attempting to reconnect...');
      this.connect().catch((error) => {
        console.error('[WebSocket] Reconnection failed:', error);
      });
    }, 5000);
  }

  private cleanup() {
    this.isConnected = false;
    this.stopHeartbeat();
    
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
    
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }

  disconnect() {
    console.log('[WebSocket] Disconnecting...');
    this.cleanup();
  }

  sendGPS(payload: GPSPayload): Promise<boolean> {
    return new Promise((resolve) => {
      if (!this.socket || !this.isConnected) {
        console.warn('[WebSocket] Cannot send GPS: not connected');
        resolve(false);
        return;
      }

      try {
        // Send STOMP-formatted message
        const stompMessage = {
          command: 'SEND',
          destination: '/app/gps/update',
          body: JSON.stringify(payload),
        };

        this.socket.send(JSON.stringify(stompMessage));

        console.log('[GPS] Sent GPS data:', {
          tripId: payload.tripId,
          lat: payload.latitude.toFixed(6),
          lng: payload.longitude.toFixed(6),
          speed: payload.speed,
          time: payload.timestamp,
        });
        
        resolve(true);
      } catch (error) {
        console.error('[WebSocket] Error sending GPS:', error);
        resolve(false);
      }
    });
  }

  getConnectionStatus(): boolean {
    return this.isConnected;
  }
}

// Export singleton instance
export const webSocketService = new WebSocketService();

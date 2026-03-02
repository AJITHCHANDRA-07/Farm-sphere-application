import React from 'react';

// Real-time service for FarmSphere application
// Handles real-time updates, notifications, and data synchronization

export interface RealtimeEvent {
  id: string;
  type: 'price_update' | 'weather_alert' | 'scheme_update' | 'market_news';
  title: string;
  message: string;
  timestamp: Date;
  data?: any;
}

export interface RealtimeSubscription {
  id: string;
  eventTypes: string[];
  callback: (event: RealtimeEvent) => void;
}

class RealtimeService {
  private subscriptions: Map<string, RealtimeSubscription> = new Map();
  private eventQueue: RealtimeEvent[] = [];
  private isConnected = false;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  constructor() {
    this.initializeConnection();
  }

  // Initialize real-time connection
  private initializeConnection = () => {
    try {
      // In production, this would connect to WebSocket or SSE endpoint
      // For now, we'll simulate real-time updates
      this.isConnected = true;
      this.startSimulatedUpdates();
      console.log('🔄 Real-time service initialized');
    } catch (error) {
      console.error('❌ Failed to initialize real-time service:', error);
      this.handleReconnection();
    }
  };

  // Handle reconnection logic
  private handleReconnection = () => {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`🔄 Attempting reconnection (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
      
      setTimeout(() => {
        this.initializeConnection();
      }, Math.pow(2, this.reconnectAttempts) * 1000); // Exponential backoff
    } else {
      console.error('❌ Max reconnection attempts reached');
    }
  };

  // Subscribe to real-time events
  public subscribe = (eventTypes: string[], callback: (event: RealtimeEvent) => void): string => {
    const subscriptionId = `sub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const subscription: RealtimeSubscription = {
      id: subscriptionId,
      eventTypes,
      callback
    };

    this.subscriptions.set(subscriptionId, subscription);
    console.log(`📡 Subscribed to events: ${eventTypes.join(', ')}`);
    
    return subscriptionId;
  };

  // Unsubscribe from events
  public unsubscribe = (subscriptionId: string) => {
    if (this.subscriptions.delete(subscriptionId)) {
      console.log(`📡 Unsubscribed: ${subscriptionId}`);
    }
  };

  // Publish event to subscribers
  private publishEvent = (event: RealtimeEvent) => {
    this.subscriptions.forEach((subscription) => {
      if (subscription.eventTypes.includes(event.type)) {
        try {
          subscription.callback(event);
        } catch (error) {
          console.error(`❌ Error in subscription ${subscription.id}:`, error);
        }
      }
    });
  };

  // Simulate real-time updates for demo
  private startSimulatedUpdates = () => {
    // Simulate price updates
    setInterval(() => {
      if (Math.random() > 0.7) {
        const crops = ['Paddy', 'Cotton', 'Turmeric', 'Chili', 'Groundnut'];
        const districts = ['Karimnagar', 'Warangal', 'Nizamabad', 'Adilabad', 'Khammam'];
        const crop = crops[Math.floor(Math.random() * crops.length)];
        const district = districts[Math.floor(Math.random() * districts.length)];
        const change = (Math.random() * 10 - 5).toFixed(2);
        const direction = parseFloat(change) > 0 ? 'increased' : 'decreased';
        
        const event: RealtimeEvent = {
          id: `price_${Date.now()}`,
          type: 'price_update',
          title: 'Market Price Update',
          message: `${crop} prices ${direction} by ${Math.abs(parseFloat(change))}% in ${district} market`,
          timestamp: new Date(),
          data: { crop, district, change: parseFloat(change) }
        };
        
        this.publishEvent(event);
      }
    }, 45000); // Every 45 seconds

    // Simulate weather alerts
    setInterval(() => {
      if (Math.random() > 0.8) {
        const weatherEvents = [
          'Heavy rainfall expected',
          'Temperature drop expected',
          'Drought warning issued',
          'Favorable conditions for farming',
          'Storm warning in area'
        ];
        const districts = ['Medak', 'Rangareddy', 'Siddipet', 'Jagtial', 'Peddapalli'];
        const event = weatherEvents[Math.floor(Math.random() * weatherEvents.length)];
        const district = districts[Math.floor(Math.random() * districts.length)];
        
        const weatherEvent: RealtimeEvent = {
          id: `weather_${Date.now()}`,
          type: 'weather_alert',
          title: 'Weather Alert',
          message: `${event} in ${district} district`,
          timestamp: new Date(),
          data: { event, district }
        };
        
        this.publishEvent(weatherEvent);
      }
    }, 120000); // Every 2 minutes

    // Simulate scheme updates
    setInterval(() => {
      if (Math.random() > 0.9) {
        const schemes = [
          'New agricultural loan scheme announced',
          'Subsidy for organic farming increased',
          'Crop insurance deadline extended',
          'Equipment subsidy program launched',
          'Irrigation scheme benefits expanded'
        ];
        const scheme = schemes[Math.floor(Math.random() * schemes.length)];
        
        const schemeEvent: RealtimeEvent = {
          id: `scheme_${Date.now()}`,
          type: 'scheme_update',
          title: 'Scheme Update',
          message: scheme,
          timestamp: new Date(),
          data: { scheme }
        };
        
        this.publishEvent(schemeEvent);
      }
    }, 300000); // Every 5 minutes
  };

  // Get connection status
  public getConnectionStatus = (): boolean => {
    return this.isConnected;
  };

  // Get active subscriptions count
  public getSubscriptionCount = (): number => {
    return this.subscriptions.size;
  };

  // Clear all subscriptions
  public clearAllSubscriptions = () => {
    this.subscriptions.clear();
    console.log('📡 All subscriptions cleared');
  };

  // Send custom event (for testing)
  public sendCustomEvent = (type: string, title: string, message: string, data?: any) => {
    const event: RealtimeEvent = {
      id: `custom_${Date.now()}`,
      type: type as any,
      title,
      message,
      timestamp: new Date(),
      data
    };
    
    this.publishEvent(event);
  };

  // Disconnect service
  public disconnect = () => {
    this.isConnected = false;
    this.clearAllSubscriptions();
    console.log('🔄 Real-time service disconnected');
  };
}

// Create singleton instance
export const realtimeService = new RealtimeService();

// React hook for using real-time service
export const useRealtime = () => {
  const [events, setEvents] = React.useState<RealtimeEvent[]>([]);
  const [isConnected, setIsConnected] = React.useState(false);

  React.useEffect(() => {
    // Subscribe to all event types
    const subscriptionId = realtimeService.subscribe(
      ['price_update', 'weather_alert', 'scheme_update', 'market_news'],
      (event: RealtimeEvent) => {
        setEvents(prev => [event, ...prev].slice(0, 50)); // Keep last 50 events
      }
    );

    // Check connection status
    const checkConnection = setInterval(() => {
      setIsConnected(realtimeService.getConnectionStatus());
    }, 1000);

    return () => {
      realtimeService.unsubscribe(subscriptionId);
      clearInterval(checkConnection);
    };
  }, []);

  const subscribe = React.useCallback((eventTypes: string[], callback: (event: RealtimeEvent) => void) => {
    return realtimeService.subscribe(eventTypes, callback);
  }, []);

  const unsubscribe = React.useCallback((subscriptionId: string) => {
    realtimeService.unsubscribe(subscriptionId);
  }, []);

  const sendCustomEvent = React.useCallback((type: string, title: string, message: string, data?: any) => {
    realtimeService.sendCustomEvent(type, title, message, data);
  }, []);

  return {
    events,
    isConnected,
    subscribe,
    unsubscribe,
    sendCustomEvent,
    getConnectionStatus: realtimeService.getConnectionStatus,
    getSubscriptionCount: realtimeService.getSubscriptionCount
  };
};

export default realtimeService;

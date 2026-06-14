import { Server as HttpServer } from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { config } from './index';
import { logger } from './logger';

let io: SocketIOServer;

export function initializeSocket(httpServer: HttpServer): SocketIOServer {
  io = new SocketIOServer(httpServer, {
    cors: {
      origin: config.corsOrigin,
      methods: ['GET', 'POST'],
      credentials: true,
    },
    pingInterval: 25000,
    pingTimeout: 60000,
  });

  // Authentication middleware for Socket.IO
  io.use((socket: Socket, next) => {
    const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.split(' ')[1];

    if (!token) {
      // Allow unauthenticated connections for public tracking
      socket.data.userId = null;
      return next();
    }

    try {
      const decoded = jwt.verify(token, config.jwt.accessSecret) as { userId: string; role: string };
      socket.data.userId = decoded.userId;
      socket.data.role = decoded.role;
      next();
    } catch {
      // Allow connection but without auth context
      socket.data.userId = null;
      next();
    }
  });

  io.on('connection', (socket: Socket) => {
    const userId = socket.data.userId;
    logger.info(`🔌 Socket connected: ${socket.id}${userId ? ` (User: ${userId})` : ' (anonymous)'}`);

    // Join user's personal room for notifications
    if (userId) {
      socket.join(`user:${userId}`);
    }

    // ─── Order Tracking ─────────────────────────────────
    socket.on('order:track', (orderId: string) => {
      socket.join(`order:${orderId}`);
      logger.debug(`Socket ${socket.id} tracking order: ${orderId}`);
    });

    socket.on('order:untrack', (orderId: string) => {
      socket.leave(`order:${orderId}`);
    });

    // ─── Delivery Location ──────────────────────────────
    socket.on('delivery:location', (data: { orderId: string; lat: number; lng: number }) => {
      io.to(`order:${data.orderId}`).emit('delivery:locationUpdate', {
        orderId: data.orderId,
        lat: data.lat,
        lng: data.lng,
        timestamp: new Date().toISOString(),
      });
    });

    // ─── Disconnect ─────────────────────────────────────
    socket.on('disconnect', (reason) => {
      logger.info(`🔌 Socket disconnected: ${socket.id} (${reason})`);
    });
  });

  logger.info('✅ Socket.IO initialized');
  return io;
}

export function getIO(): SocketIOServer {
  if (!io) {
    throw new Error('Socket.IO not initialized. Call initializeSocket first.');
  }
  return io;
}

// ─── Emit Helpers ────────────────────────────────────────

export function emitOrderUpdate(orderId: string, data: Record<string, unknown>): void {
  if (io) {
    io.to(`order:${orderId}`).emit('order:statusUpdate', data);
  }
}

export function emitToUser(userId: string, event: string, data: Record<string, unknown>): void {
  if (io) {
    io.to(`user:${userId}`).emit(event, data);
  }
}

export function emitNotification(userId: string, notification: Record<string, unknown>): void {
  if (io) {
    io.to(`user:${userId}`).emit('notification:new', notification);
  }
}

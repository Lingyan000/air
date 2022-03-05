import { io, Socket } from 'socket.io-client';
import { useGlobSetting } from '/@/hooks/setting';
import { nanoid } from 'nanoid';

export function useSocket(): {
  socket: Socket;
  id: string;
} {
  if (!(window as any).$socket || !(window as any).$socketGroupId) {
    const globSetting = useGlobSetting();

    (window as any).$socketGroupId = nanoid();

    (window as any).$socket = io(globSetting.apiUrl, {
      transports: ['websocket'],
    });

    (window as any).$socket.emit('addGroup', (window as any).$socketGroupId);
  }

  return {
    socket: (window as any).$socket,
    id: (window as any).$socketGroupId,
  };
}

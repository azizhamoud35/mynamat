import { useEffect, useRef, useState } from 'react';
import Peer from 'peerjs';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Video, VideoOff, Mic, MicOff, PhoneOff, Maximize2, Minimize2, GripVertical } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import Draggable from 'react-draggable';

interface VideoChatProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  appointment: {
    id: string;
    customerId: string;
    customerName?: string;
  };
}

export function VideoChat({ open, onOpenChange, appointment }: VideoChatProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [peer, setPeer] = useState<Peer | null>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isMinimized, setIsMinimized] = useState(true);
  const [position, setPosition] = useState({ x: 20, y: 20 });
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const { currentUser } = useAuth();

  useEffect(() => {
    if (!open) return;

    const initializeVideoChat = async () => {
      try {
        setIsLoading(true);
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true
        });
        setLocalStream(stream);
        
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }

        const newPeer = new Peer(`namat-${currentUser?.uid}`);
        setPeer(newPeer);

        newPeer.on('call', (call) => {
          call.answer(stream);
          call.on('stream', (remoteStream) => {
            setRemoteStream(remoteStream);
            if (remoteVideoRef.current) {
              remoteVideoRef.current.srcObject = remoteStream;
            }
          });
        });

        const call = newPeer.call(`namat-${appointment.customerId}`, stream);
        call.on('stream', (remoteStream) => {
          setRemoteStream(remoteStream);
          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = remoteStream;
          }
        });

        setIsLoading(false);
      } catch (error) {
        console.error('Error initializing video chat:', error);
        toast.error('Failed to initialize video chat');
        onOpenChange(false);
      }
    };

    initializeVideoChat();

    return () => {
      localStream?.getTracks().forEach(track => track.stop());
      peer?.destroy();
    };
  }, [open]);

  const toggleVideo = () => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      videoTrack.enabled = !videoTrack.enabled;
      setIsVideoEnabled(videoTrack.enabled);
    }
  };

  const toggleAudio = () => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      audioTrack.enabled = !audioTrack.enabled;
      setIsAudioEnabled(audioTrack.enabled);
    }
  };

  const endCall = () => {
    localStream?.getTracks().forEach(track => track.stop());
    peer?.destroy();
    onOpenChange(false);
  };

  const handleDragStop = (_e: any, data: { x: number; y: number }) => {
    setPosition({ x: data.x, y: data.y });
  };

  if (!open) return null;

  const VideoContainer = isMinimized ? (
    <Draggable
      position={position}
      onStop={handleDragStop}
      handle=".drag-handle"
      bounds="parent"
    >
      <div className="fixed z-50 w-72 rounded-lg overflow-hidden shadow-lg bg-black">
        <div className="drag-handle flex items-center justify-between bg-black/90 p-2 cursor-move">
          <GripVertical className="h-4 w-4 text-white/60" />
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-white/60 hover:text-white"
              onClick={() => setIsMinimized(false)}
            >
              <Maximize2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-white/60 hover:text-white"
              onClick={endCall}
            >
              <PhoneOff className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <video
          ref={remoteVideoRef}
          autoPlay
          playsInline
          className="w-full aspect-video object-cover"
        />
        <video
          ref={localVideoRef}
          autoPlay
          playsInline
          muted
          className="absolute bottom-2 right-2 w-20 h-15 rounded-md overflow-hidden border border-white/20"
        />
        <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
          <div className="flex items-center justify-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={toggleVideo}
            >
              {isVideoEnabled ? (
                <Video className="h-3 w-3 text-white" />
              ) : (
                <VideoOff className="h-3 w-3 text-red-500" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={toggleAudio}
            >
              {isAudioEnabled ? (
                <Mic className="h-3 w-3 text-white" />
              ) : (
                <MicOff className="h-3 w-3 text-red-500" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </Draggable>
  ) : (
    <Dialog open={true} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[80vh] p-0">
        <div className="relative flex flex-col h-full">
          <div className="flex-1 bg-black relative">
            {remoteStream ? (
              <video
                ref={remoteVideoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-white">
                {isLoading ? (
                  <div className="flex flex-col items-center gap-2">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                    <p>Connecting to {appointment.customerName}...</p>
                  </div>
                ) : (
                  <p>Waiting for {appointment.customerName} to join...</p>
                )}
              </div>
            )}

            <div className="absolute bottom-4 right-4 w-48 h-36 bg-black rounded-lg overflow-hidden shadow-lg">
              <video
                ref={localVideoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
            <div className="flex items-center justify-center gap-4">
              <Button
                variant="outline"
                size="icon"
                className="rounded-full bg-white/10 hover:bg-white/20 backdrop-blur"
                onClick={() => setIsMinimized(true)}
              >
                <Minimize2 className="h-5 w-5" />
              </Button>

              <Button
                variant="outline"
                size="icon"
                className={cn(
                  "rounded-full bg-white/10 hover:bg-white/20 backdrop-blur",
                  !isVideoEnabled && "bg-red-500/80 hover:bg-red-500/60"
                )}
                onClick={toggleVideo}
              >
                {isVideoEnabled ? (
                  <Video className="h-5 w-5" />
                ) : (
                  <VideoOff className="h-5 w-5" />
                )}
              </Button>

              <Button
                variant="outline"
                size="icon"
                className={cn(
                  "rounded-full bg-white/10 hover:bg-white/20 backdrop-blur",
                  !isAudioEnabled && "bg-red-500/80 hover:bg-red-500/60"
                )}
                onClick={toggleAudio}
              >
                {isAudioEnabled ? (
                  <Mic className="h-5 w-5" />
                ) : (
                  <MicOff className="h-5 w-5" />
                )}
              </Button>

              <Button
                variant="destructive"
                size="icon"
                className="rounded-full"
                onClick={endCall}
              >
                <PhoneOff className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  return VideoContainer;
}
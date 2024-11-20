// Previous imports remain the same...

export function VideoCall({ open, onOpenChange, session, role }: VideoChatProps) {
  // Previous state and logic remain the same...

  return (
    <Dialog open={true} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[80vh] p-0">
        <DialogHeader className="sr-only">
          <DialogTitle>
            Video Call with {role === 'coach' ? session.customerName : 'Coach'}
          </DialogTitle>
        </DialogHeader>
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
                    <p>Connecting to {role === 'coach' ? session.customerName : 'coach'}...</p>
                  </div>
                ) : (
                  <p>Waiting for {role === 'coach' ? session.customerName : 'coach'} to join...</p>
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
}
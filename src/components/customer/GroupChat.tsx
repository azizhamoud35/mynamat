// ... previous imports remain the same
import { 
  Dialog, 
  DialogContent,
  DialogHeader,
  DialogTitle 
} from '@/components/ui/dialog';

export function GroupChat({ group, onClose }: GroupChatProps) {
  // ... state declarations remain the same

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[80vh] p-0">
        <DialogHeader className="sr-only">
          <DialogTitle>
            Chat - {group.name}
          </DialogTitle>
        </DialogHeader>
        {/* ... rest of the component remains the same */}
      </DialogContent>
    </Dialog>
  );
}
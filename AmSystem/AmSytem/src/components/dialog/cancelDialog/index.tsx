import { Button } from "@/components/ui/button";
import { Dialog, DialogHeader, DialogContent, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { CircleX } from "lucide-react";

interface CancelDialogProps {
  label: string;
  buttonLabel: string;
  isOpen: boolean;
  onOpenChange: (value: boolean) => void;
  onConfirm: (confirmed: boolean) => void;
}

const CancelDialog = ({ label, buttonLabel, isOpen, onOpenChange, onConfirm }: CancelDialogProps) => {
  const confirmDelete = (confirmed: boolean) => {
    onConfirm(confirmed);
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="flex flex-col items-center">
        <DialogHeader>
          <DialogTitle>
            <CircleX color="red" size={"50px"} />
          </DialogTitle>
        </DialogHeader>
        <span className="text-[20px] font-bold">{label}</span>
        <DialogFooter>
          <Button onClick={() => confirmDelete(true)} variant={"destructive"}>
            {buttonLabel}
          </Button>
          <Button onClick={() => confirmDelete(false)} variant={"outline"}>
            Sair
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CancelDialog;

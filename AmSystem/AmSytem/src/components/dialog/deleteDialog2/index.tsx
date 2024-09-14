import { Button } from "@/components/ui/button";
import { Dialog, DialogHeader, DialogContent, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { CircleX } from "lucide-react";

interface DeleteDialog2Props {
  isOpen: boolean;
  onOpenChange: (value: boolean) => void;
  onConfirm: (confirmed: boolean) => void;
}

const DeleteDialog2 = ({ isOpen, onOpenChange, onConfirm }: DeleteDialog2Props) => {
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
        <span className="text-[20px] font-bold">Têm certeza que deseja deletar o registro?</span>
        <DialogFooter>
          <Button onClick={() => confirmDelete(true)} variant={"destructive"}>
            Deletar
          </Button>
          <Button onClick={() => confirmDelete(false)} variant={"outline"}>
            Cancelar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteDialog2;

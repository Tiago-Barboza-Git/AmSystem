import { Button } from "@/components/ui/button";
import { Dialog, DialogHeader, DialogContent, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { AxiosError } from "axios";
import { CircleX } from "lucide-react";
import { UseMutationResult } from "react-query";

interface DeleteDialogProps {
  isOpen: boolean;
  registerId: number;
  onOpenChange: (value: boolean) => void;
  // deleteFunction?: UseMutationResult<number, unknown, number, unknown>;
  deleteFunction?: UseMutationResult<number, AxiosError<unknown, any>, number, unknown>;
  handleDelete?: (value: number) => void;
}

const DeleteDialog = ({ isOpen, registerId, onOpenChange, deleteFunction, handleDelete }: DeleteDialogProps) => {
  const deleteRegister = () => {
    if (deleteFunction !== undefined) deleteFunction?.mutate(registerId);
    else if (handleDelete !== undefined) handleDelete(registerId);
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
          <Button onClick={deleteRegister} variant={"destructive"}>
            Deletar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteDialog;

import * as AlertDialog from "@radix-ui/react-alert-dialog";
import { Button } from "@/components/ui/button";

interface AlertDialogConfirmProps {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const AlertDialogConfirm = ({ open, onConfirm, onCancel }: AlertDialogConfirmProps) => {
  return (
    <AlertDialog.Root open={open}>
      <AlertDialog.Portal>
        <AlertDialog.Overlay className="bg-black/50 fixed inset-0" />
        <AlertDialog.Content className="fixed bg-white p-6 shadow-lg rounded-md max-w-sm mx-auto top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
          <AlertDialog.Title className="text-lg font-bold">Tem certeza?</AlertDialog.Title>
          <AlertDialog.Description className="mt-2 text-sm">
            Existem valores preenchidos no formulário. Se sair, todas as alterações serão perdidas. Deseja continuar?
          </AlertDialog.Description>
          <div className="mt-4 flex justify-end space-x-4">
            <AlertDialog.Cancel asChild>
              <Button variant="outline" onClick={onCancel}>
                Cancelar
              </Button>
            </AlertDialog.Cancel>
            <AlertDialog.Action asChild>
              <Button variant="destructive" onClick={onConfirm}>
                Continuar
              </Button>
            </AlertDialog.Action>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
};

export default AlertDialogConfirm;

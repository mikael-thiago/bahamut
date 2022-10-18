import { useDisclosure } from "@chakra-ui/react";
import { Operation, useOperationService } from "@services/OperationService";
import { FC } from "react";
import { OperationModal, OperationModalProps } from "./OperationModal";

export type OperationModalFormHookProps = Pick<OperationModalProps, "onSubmit" | "selectedYear">;

export type OperationFormModalHook = {
  OperationModal: FC<OperationModalFormHookProps>;
  openOperationModal: () => void;
  closeOperationModal: () => void;
};

export const useOperationModal = (): OperationFormModalHook => {
  const { isOpen, onOpen: openOperationModal, onClose: closeOperationModal } = useDisclosure();

  const operationModalFC = (props: OperationModalFormHookProps) => (
    <OperationModal isOpen={isOpen} onClose={closeOperationModal} {...props} />
  );

  return {
    openOperationModal,
    closeOperationModal,
    OperationModal: operationModalFC,
  };
};

export const useOperationModalContainer = () => {
  const { openOperationModal, closeOperationModal, OperationModal } = useOperationModal();

  const { createOperation } = useOperationService();

  const onCreateOperation = async (request: Omit<Operation, 'userId'>) => {
    await createOperation(request);
    return closeOperationModal();
  }

  const operationModalFC = ({
    selectedYear,
  }: Pick<OperationModalFormHookProps, "selectedYear">) => (
    <OperationModal onSubmit={onCreateOperation} selectedYear={selectedYear} />
  );

  return {
    openOperationModal,
    OperationModal: operationModalFC,
  };
};